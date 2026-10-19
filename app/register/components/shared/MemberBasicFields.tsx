import type { ReactNode } from "react";
import { FormErrors, MemberData, MemberKey } from "../../types";
import { FOOD_OPTIONS, GENDER_OPTIONS } from "../../constants";
import { FormField } from "./FormField";
import styles from "../../register.module.css";

export interface MemberBasicFieldsProps {
  memberKey: MemberKey;
  title: string;
  icon?: ReactNode;
  memberData: MemberData;
  errors: FormErrors;
  emailSubtitle?: string;
  onUpdate: (memberKey: MemberKey, field: keyof MemberData, value: string) => void;
}

export function MemberBasicFields({ memberKey, title, memberData, errors, emailSubtitle, onUpdate }: MemberBasicFieldsProps) {
  const genderError = errors[memberKey + ".gender"];
  const foodError = errors[memberKey + ".foodPreference"];
  return (
    <section aria-label={title + " contact details"}>
      <div className={styles.fields}>
        <FormField id={memberKey + "-firstName"} label="First name" placeholder="First name" autoComplete={"section-" + memberKey + " given-name"}
          value={memberData.firstName} error={errors[memberKey + ".firstName"]} onChange={(e) => onUpdate(memberKey, "firstName", e.target.value)} />
        <FormField id={memberKey + "-lastName"} label="Last name" placeholder="Last name" autoComplete={"section-" + memberKey + " family-name"}
          value={memberData.lastName} error={errors[memberKey + ".lastName"]} onChange={(e) => onUpdate(memberKey, "lastName", e.target.value)} />
        <FormField id={memberKey + "-email"} label="Email address" type="email" placeholder="you@example.com"
          autoComplete={"section-" + memberKey + " email"} value={memberData.email} error={errors[memberKey + ".email"]}
          onChange={(e) => onUpdate(memberKey, "email", e.target.value)} hint={emailSubtitle} />
        <FormField id={memberKey + "-phone"} label="Phone number" type="tel" inputMode="tel" placeholder="98765 43210" prefix="+91"
          autoComplete={"section-" + memberKey + " tel-national"} value={memberData.phone} error={errors[memberKey + ".phone"]}
          onChange={(e) => onUpdate(memberKey, "phone", e.target.value)} />
        <fieldset className={styles.choiceGroup} role="radiogroup" aria-required="true" aria-invalid={Boolean(genderError)} tabIndex={-1} aria-describedby={genderError ? memberKey + "-gender-error" : undefined}>
          <legend className={styles.fieldLabel}>Gender <span className={styles.required}>*</span></legend>
          <div className={styles.choices}>
            {GENDER_OPTIONS.map((option) => (
              <label key={option} className={styles.choice}>
                <input type="radio" name={memberKey + "-gender"} value={option} checked={memberData.gender === option}
                  required onChange={() => onUpdate(memberKey, "gender", option)} />
                <span className={styles.radioDot} aria-hidden="true" />{option}
              </label>
            ))}
          </div>
          {genderError && <p id={memberKey + "-gender-error"} className={styles.error} role="alert">{genderError}</p>}
        </fieldset>
        <fieldset className={styles.choiceGroup} role="radiogroup" aria-required="true" aria-invalid={Boolean(foodError)} tabIndex={-1} aria-describedby={foodError ? memberKey + "-food-error" : undefined}>
          <legend className={styles.fieldLabel}>Food preference <span className={styles.required}>*</span></legend>
          <div className={styles.choices}>
            {FOOD_OPTIONS.map((option) => (
              <label key={option.value} className={styles.choice}>
                <input type="radio" name={memberKey + "-foodPreference"} value={option.value} checked={memberData.foodPreference === option.value}
                  required onChange={() => onUpdate(memberKey, "foodPreference", option.value)} />
                <span className={styles.radioDot} aria-hidden="true" />{option.label}
              </label>
            ))}
          </div>
          {foodError && <p id={memberKey + "-food-error"} className={styles.error} role="alert">{foodError}</p>}
        </fieldset>
      </div>
    </section>
  );
}
