import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Ban, User, Users } from "lucide-react";
import { PRICING_CONFIG } from "../../constants";
import { getMemberKeys } from "../../utils/registration";
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
  onRegistrationTypeChange: (type: TeamRegistrationData["registrationType"]) => void;
}

export function Step1TeamDetails({ formData, errors, onUpdateField, onUpdateMember, onNext, isSoldOut = false, initialMember = "member1", onRegistrationTypeChange }: Step1TeamDetailsProps) {
  const [selectedMember, setActiveMember] = useState<MemberKey>(initialMember);
  const isSolo = formData.registrationType === "solo";
  const activeMember = isSolo ? "member1" : selectedMember;
  const container = useRef<HTMLFormElement>(null);

  const continueForm = () => {
    const validation = validateStep1(formData);
    const leaderNeedsAttention = Boolean(validation.teamName) || Object.keys(validation).some((key) => key.startsWith("member1."));
    if (!isSolo && activeMember === "member1" && !leaderNeedsAttention) {
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
      transition={{ duration: 0.2 }} className={styles.stepContent} ref={container} noValidate aria-label="Registration contact details"
      onSubmit={(event) => { event.preventDefault(); if (!isSoldOut) continueForm(); }}>
      {isSoldOut && <div className={styles.notice} role="status"><Ban size={18} /><div><strong>Registration is full</strong>All available seats have been filled.</div></div>}
      <div className={styles.sectionHeading}>
        <div><h2>Make your entry.</h2><p>Come solo or bring a teammate. Start with your details.</p></div>
        <span className={styles.stepCounter}>01 <span>/ 04</span></span>
      </div>
      <fieldset className={styles.registrationChoice}>
        <legend className={styles.fieldLabel}>How are you joining?</legend>
        <div className={styles.registrationOptions}>
          {(["solo", "team"] as const).map((type) => (
            <label key={type} className={styles.registrationOption}>
              <input type="radio" name="registration-type" value={type} checked={formData.registrationType === type} disabled={isSoldOut}
                onChange={() => { setActiveMember("member1"); onRegistrationTypeChange(type); }} />
              {type === "solo" ? <User size={19} aria-hidden="true" /> : <Users size={19} aria-hidden="true" />}
              <span><strong>{type === "solo" ? "Solo" : "Team of two"}</strong><small>{type === "solo" ? "Just you & your ideas" : "Create with a teammate"}</small></span>
              <b>₹{PRICING_CONFIG.feePerMember * (type === "solo" ? 1 : 2)}</b>
            </label>
          ))}
        </div>
      </fieldset>
      <div className={styles.teamField}>
        <FormField id="team-name" label="Team name" placeholder="What should we call your team?" value={formData.teamName} disabled={isSoldOut}
          hint={isSolo ? "A team name is required for solo registrations too." : undefined}
          onChange={(e) => onUpdateField("teamName", e.target.value)} error={errors.teamName} />
      </div>
      {!isSolo && <MemberTabs scope="basic" activeMember={activeMember} onSelect={setActiveMember} formData={formData} errors={errors}
        fields={["firstName", "lastName", "email", "phone", "gender"]} />}
      {getMemberKeys(formData).map((member) => (
        <div key={member} data-member-panel role={isSolo ? "group" : "tabpanel"} id={"basic-" + member + "-panel"}
          aria-label={isSolo ? "Your details" : undefined} aria-labelledby={isSolo ? undefined : "basic-" + member + "-tab"}
          hidden={activeMember !== member} className={[styles.memberPanel, isSolo ? styles.soloPanel : ""].join(" ")}>
          <MemberBasicFields memberKey={member} title={isSolo ? "Your" : member === "member1" ? "Team leader" : "Teammate"}
            memberData={formData[member]} errors={errors} onUpdate={onUpdateMember}
            emailSubtitle={member === "member1" ? "Your receipt and verification code go here." : "Your teammate's event ticket goes here."} />
        </div>
      ))}
      <div className={styles.actions}>
        {activeMember === "member2" ? (
          <button type="button" onClick={() => setActiveMember("member1")} className={styles.textButton}><ArrowLeft size={14} aria-hidden="true" /> Team leader</button>
        ) : <span className={styles.actionNote}>All fields are required</span>}
        <button type="submit" disabled={isSoldOut} className={styles.primaryButton}>
          {!isSolo && activeMember === "member1" ? "Next: teammate" : "Continue to academics"}<ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </motion.form>
  );
}
