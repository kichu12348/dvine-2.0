import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FormErrors, MemberData, MemberKey, TeamRegistrationData } from "../../types";
import { validateStep2 } from "../../utils/validation";
import { getMemberKeys } from "../../utils/registration";
import { MemberAcademicFields } from "../shared/MemberAcademicFields";
import { MemberTabs, focusMemberField } from "../shared/MemberTabs";
import styles from "../../register.module.css";

export interface Step2AcademicDetailsProps {
  formData: TeamRegistrationData;
  errors: FormErrors;
  activeCollegeTarget: MemberKey | null;
  collegeSuggestions: string[];
  onCollegeChange: (memberKey: MemberKey, val: string) => void;
  onCollegeSelect: (memberKey: MemberKey, val: string) => void;
  onCollegeFocus: (memberKey: MemberKey) => void;
  onUpdateMember: (memberKey: MemberKey, field: keyof MemberData, value: string) => void;
  onPrev: () => void;
  onNext: () => void;
  initialMember?: MemberKey;
}

export function Step2AcademicDetails({ formData, errors, activeCollegeTarget, collegeSuggestions, onCollegeChange, onCollegeSelect, onCollegeFocus, onUpdateMember, onPrev, onNext, initialMember = "member1" }: Step2AcademicDetailsProps) {
  const [selectedMember, setActiveMember] = useState<MemberKey>(initialMember);
  const isSolo = formData.registrationType === "solo";
  const activeMember = isSolo ? "member1" : selectedMember;
  const container = useRef<HTMLFormElement>(null);
  const continueForm = () => {
    const validation = validateStep2(formData);
    const leaderNeedsAttention = Object.keys(validation).some((key) => key.startsWith("member1."));
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
    <motion.form key="step-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }} className={styles.stepContent} ref={container} noValidate aria-label="Academic details"
      onSubmit={(event) => { event.preventDefault(); continueForm(); }}>
      <div className={styles.sectionHeading}>
        <div><h2>Where you&apos;re coming from.</h2><p>{isSolo ? "Add your college and course details." : <>A few academic details for each member of {formData.teamName || "your team"}.</>}</p></div>
        <span className={styles.stepCounter}>02 <span>/ 04</span></span>
      </div>
      {!isSolo && <MemberTabs scope="academic" activeMember={activeMember} onSelect={setActiveMember} formData={formData} errors={errors}
        fields={["collegeName", "yearOfStudy", "department"]} />}
      {getMemberKeys(formData).map((member) => (
        <div key={member} data-member-panel role={isSolo ? "group" : "tabpanel"} id={"academic-" + member + "-panel"}
          aria-label={isSolo ? "Your academic details" : undefined} aria-labelledby={isSolo ? undefined : "academic-" + member + "-tab"}
          hidden={activeMember !== member} className={[styles.memberPanel, isSolo ? styles.soloPanel : ""].join(" ")}>
          <MemberAcademicFields memberKey={member} title={isSolo ? "Participant" : member === "member1" ? "Team leader" : "Teammate"}
            nameHighlight={formData[member].firstName + " " + formData[member].lastName} memberData={formData[member]} errors={errors}
            collegeSuggestions={collegeSuggestions} isCollegeTargetActive={activeCollegeTarget === member}
            onCollegeChange={onCollegeChange} onCollegeSelect={onCollegeSelect} onCollegeFocus={onCollegeFocus} onUpdate={onUpdateMember} />
        </div>
      ))}
      <div className={styles.actions}>
        <button type="button" onClick={activeMember === "member1" ? onPrev : () => setActiveMember("member1")} className={styles.textButton}>
          <ArrowLeft size={14} aria-hidden="true" /> {activeMember === "member1" ? "Your details" : "Team leader"}
        </button>
        <button type="submit" className={styles.primaryButton}>
          {!isSolo && activeMember === "member1" ? "Next: teammate" : "Review & pay"}<ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </motion.form>
  );
}
