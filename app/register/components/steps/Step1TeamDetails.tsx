import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Ban } from "lucide-react";
import { FormErrors, MemberData, MemberKey, TeamRegistrationData } from "../../types";
import { validateStep1 } from "../../utils/validation";
import { MemberBasicFields } from "../shared/MemberBasicFields";
import { FormField } from "../shared/FormField";
import { MemberTabs, focusMemberField } from "../shared/MemberTabs";
import styles from "../../register.module.css";

export interface Step1TeamDetailsProps {
  formData: TeamRegistrationData;
  errors: FormErrors;
  onUpdateField: (field: "teamName" | "confirmAccuracy", value: string | boolean) => void;
  onUpdateMember: (memberKey: MemberKey, field: keyof MemberData, value: string) => void;
  onNext: () => void;
  isSoldOut?: boolean;
  initialMember?: MemberKey;
}

export function Step1TeamDetails({ formData, errors, onUpdateField, onUpdateMember, onNext, isSoldOut = false, initialMember = "member1" }: Step1TeamDetailsProps) {
  const [activeMember, setActiveMember] = useState<MemberKey>(initialMember);
  const container = useRef<HTMLFormElement>(null);

  const continueForm = () => {
    const validation = validateStep1(formData);
    const leaderNeedsAttention = Boolean(validation.teamName) || Object.keys(validation).some((key) => key.startsWith("member1."));
    if (activeMember === "member1" && !leaderNeedsAttention) {
      setActiveMember("member2");
      focusMemberField(container.current);
      return;
    }
    if (leaderNeedsAttention) setActiveMember("member1");
    onNext();
    focusMemberField(container.current, true);
  };

  return (
    <motion.form key="step-1" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }} className={styles.stepContent} ref={container} noValidate aria-label="Team contact details"
      onSubmit={(event) => { event.preventDefault(); if (!isSoldOut) continueForm(); }}>
      {isSoldOut && <div className={styles.notice} role="status"><Ban size={18} /><div><strong>Registration is full</strong>All team seats have been filled.</div></div>}
      <div className={styles.sectionHeading}>
        <div><h2>Let&apos;s build your team.</h2><p>Choose a name. Add your people. You&apos;re on your way.</p></div>
        <span className={styles.stepCounter}>01 <span>/ 04</span></span>
      </div>
      <div className={styles.teamField}>
        <FormField id="team-name" label="Team name" placeholder="What should we call your team?" value={formData.teamName} disabled={isSoldOut}
          onChange={(e) => onUpdateField("teamName", e.target.value)} error={errors.teamName} />
      </div>
      <MemberTabs scope="basic" activeMember={activeMember} onSelect={setActiveMember} formData={formData} errors={errors}
        fields={["firstName", "lastName", "email", "phone", "gender"]} />
      {(["member1", "member2"] as const).map((member) => (
        <div key={member} role="tabpanel" id={"basic-" + member + "-panel"} aria-labelledby={"basic-" + member + "-tab"}
          hidden={activeMember !== member} className={styles.memberPanel}>
          <MemberBasicFields memberKey={member} title={member === "member1" ? "Team leader" : "Teammate"}
            memberData={formData[member]} errors={errors} onUpdate={onUpdateMember}
            emailSubtitle={member === "member1" ? "Your receipt and verification code go here." : "Your teammate's event ticket goes here."} />
        </div>
      ))}
      <div className={styles.actions}>
        {activeMember === "member2" ? (
          <button type="button" onClick={() => setActiveMember("member1")} className={styles.textButton}><ArrowLeft size={14} aria-hidden="true" /> Team leader</button>
        ) : <span className={styles.actionNote}>All fields are required</span>}
        <button type="submit" disabled={isSoldOut} className={styles.primaryButton}>
          {activeMember === "member1" ? "Next: teammate" : "Continue to academics"}<ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </motion.form>
  );
}
