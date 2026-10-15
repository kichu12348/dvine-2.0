import React from "react";
import { FormErrors, MemberData, MemberKey } from "../../types";
import { YEAR_OPTIONS } from "../../constants";
import { CollegeAutocomplete } from "./CollegeAutocomplete";
import { FormField } from "./FormField";
import styles from "../../register.module.css";

export interface MemberAcademicFieldsProps {
  memberKey: MemberKey;
  title: string;
  nameHighlight?: string;
  icon?: React.ReactNode;
  memberData: MemberData;
  errors: FormErrors;
  collegeSuggestions: string[];
  isCollegeTargetActive: boolean;
  onCollegeChange: (memberKey: MemberKey, val: string) => void;
  onCollegeSelect: (memberKey: MemberKey, val: string) => void;
  onCollegeFocus: (memberKey: MemberKey) => void;
  onUpdate: (memberKey: MemberKey, field: keyof MemberData, value: string) => void;
}

export function MemberAcademicFields({ memberKey, title, nameHighlight, memberData, errors, collegeSuggestions, isCollegeTargetActive, onCollegeChange, onCollegeSelect, onCollegeFocus, onUpdate }: MemberAcademicFieldsProps) {
  const yearError = errors[memberKey + ".yearOfStudy"];
  return (
    <section aria-label={title + (nameHighlight ? ": " + nameHighlight : "")}>
      <div className={styles.academicFields}>
        <div className={styles.fullWidth}>
          <CollegeAutocomplete memberKey={memberKey} value={memberData.collegeName} suggestions={collegeSuggestions}
            isTargetActive={isCollegeTargetActive} error={errors[memberKey + ".collegeName"]}
            onChange={onCollegeChange} onSelect={onCollegeSelect} onFocus={onCollegeFocus} />
        </div>
        <div>
          <label htmlFor={memberKey + "-year"} className={styles.fieldLabel}><span>Year of study <span className={styles.required}>*</span></span></label>
          <select id={memberKey + "-year"} className={styles.input} value={memberData.yearOfStudy} aria-required="true"
            aria-invalid={Boolean(yearError)} aria-describedby={yearError ? memberKey + "-year-error" : undefined}
            onChange={(e) => onUpdate(memberKey, "yearOfStudy", e.target.value)}>
            <option value="" disabled>Select your year</option>
            {YEAR_OPTIONS.map((year) => <option key={year} value={year}>{year}</option>)}
          </select>
          {yearError && <p id={memberKey + "-year-error"} className={styles.error} role="alert">{yearError}</p>}
        </div>
        <FormField id={memberKey + "-department"} label="Branch / department" placeholder="e.g. Computer Science"
          value={memberData.department} error={errors[memberKey + ".department"]} onChange={(e) => onUpdate(memberKey, "department", e.target.value)} />
      </div>
    </section>
  );
}
