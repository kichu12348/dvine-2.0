import { Users } from "lucide-react";
import styles from "../register.module.css";

export function RegistrationIntro({ amount }: { amount: number }) {
  return (
    <div className={styles.intro}>
      <div>
        <p className={styles.eyebrow}>D&apos;VINE 2.0 / TEAM REGISTRATION</p>
        <h1 className={styles.introTitle}>Two minds. <span>One team.</span></h1>
        <p className={styles.introDescription}>Your 24-hour design adventure starts here.</p>
      </div>
      <div className={styles.feeSummary}>
        <span><Users size={14} aria-hidden="true" /> 2 members</span>
        <strong>₹{amount}<small> / team</small></strong>
      </div>
    </div>
  );
}
