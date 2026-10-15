import { User, Users } from "lucide-react";
import styles from "../register.module.css";

export function RegistrationIntro({ amount, isSolo }: { amount: number; isSolo: boolean }) {
  return (
    <div className={styles.intro}>
      <div>
        <p className={styles.eyebrow}>D&apos;VINE 2.0 / REGISTRATION</p>
        <h1 className={styles.introTitle}>Your ideas. <span>Your way.</span></h1>
        <p className={styles.introDescription}>Your 24-hour design adventure starts here.</p>
      </div>
      <div className={styles.feeSummary}>
        <span>{isSolo ? <User size={14} aria-hidden="true" /> : <Users size={14} aria-hidden="true" />} {isSolo ? "1 participant" : "2 participants"}</span>
        <strong>₹{amount}<small> / {isSolo ? "solo pass" : "team"}</small></strong>
      </div>
    </div>
  );
}
