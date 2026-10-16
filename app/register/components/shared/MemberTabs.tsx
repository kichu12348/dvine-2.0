import { Check, CircleAlert } from "lucide-react";
import type { FormErrors, MemberData, MemberKey, TeamRegistrationData } from "../../types";
import styles from "../../register.module.css";

interface MemberTabsProps {
  scope: string;
  activeMember: MemberKey;
  onSelect: (member: MemberKey) => void;
  formData: TeamRegistrationData;
  errors: FormErrors;
  fields: (keyof MemberData)[];
}

export function MemberTabs({ scope, activeMember, onSelect, formData, errors, fields }: MemberTabsProps) {
  return (
    <div className={styles.memberTabs} role="tablist" aria-label="Team members">
      {(["member1", "member2"] as const).map((member, index) => {
        const filled = fields.filter((field) => formData[member][field].trim()).length;
        const hasError = Object.keys(errors).some((key) => key.startsWith(member + "."));
        const complete = filled === fields.length && !hasError;
        return (
          <button
            key={member}
            type="button"
            role="tab"
            id={scope + "-" + member + "-tab"}
            aria-controls={scope + "-" + member + "-panel"}
            aria-selected={activeMember === member}
            tabIndex={activeMember === member ? 0 : -1}
            onClick={() => onSelect(member)}
            onKeyDown={(event) => {
              if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
              event.preventDefault();
              const next = event.key === "Home" ? "member1" : event.key === "End" ? "member2" : member === "member1" ? "member2" : "member1";
              onSelect(next);
              document.getElementById(scope + "-" + next + "-tab")?.focus();
            }}
            className={[styles.memberTab, activeMember === member ? styles.selectedMember : "", hasError ? styles.memberTabError : ""].join(" ")}
          >
            <span className={styles.tabAvatar} aria-hidden="true">{hasError ? <CircleAlert size={15} /> : complete ? <Check size={15} /> : "0" + (index + 1)}</span>
            <span className={styles.tabLabel}>{index === 0 ? "Team leader" : "Teammate"}<small>{hasError ? "Needs attention" : filled + "/" + fields.length + " completed"}</small></span>
            {activeMember === member && <span className={styles.tabIndicator} aria-hidden="true" />}
          </button>
        );
      })}
    </div>
  );
}

export function focusMemberField(container: HTMLElement | null, errorsOnly = false) {
  window.requestAnimationFrame(() => {
    const selector = errorsOnly
      ? '#team-name[aria-invalid="true"], [data-member-panel]:not([hidden]) [aria-invalid="true"]'
      : '[data-member-panel]:not([hidden]) input:not([type="radio"]), [data-member-panel]:not([hidden]) select, [data-member-panel]:not([hidden]) button[role="combobox"]';
    container?.querySelector<HTMLElement>(selector)?.focus();
  });
}
