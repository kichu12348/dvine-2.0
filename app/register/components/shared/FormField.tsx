import type { InputHTMLAttributes, ReactNode } from "react";
import { Label } from "../../../components/ui/label";
import styles from "../../register.module.css";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  prefix?: string;
  optional?: boolean;
}

export function FormField({ id, label, error, hint, icon, prefix, optional, className, ...inputProps }: FormFieldProps) {
  return (
    <div className={className}>
      <Label htmlFor={id} className={styles.fieldLabel}>
        <span>
          {label} {optional ? <span className={styles.required}>(optional)</span> : <span className={styles.required}>*</span>}
        </span>
      </Label>
      <div className={prefix ? styles.phoneWrap : styles.inputWrap}>
        {prefix && <span className={styles.phonePrefix}>{prefix}</span>}
        {icon && <span className={styles.inputIcon} aria-hidden="true">{icon}</span>}
        <input {...inputProps} id={id} aria-required={!optional} aria-invalid={Boolean(error)}
          aria-describedby={[error ? id + "-error" : "", hint ? id + "-hint" : ""].filter(Boolean).join(" ") || undefined}
          className={[styles.input, icon ? styles.inputWithIcon : ""].join(" ")} />
      </div>
      {error && <p id={id + "-error"} className={styles.error} role="alert">{error}</p>}
      {hint && <p id={id + "-hint"} className={styles.fieldHint}>{hint}</p>}
    </div>
  );
}
