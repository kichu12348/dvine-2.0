import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import styles from "../register.module.css";

export function RegisterHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <div className={styles.brand}>
          <Link href="/" aria-label="D'VINE home">
            <Image
              src="/dvine.svg"
              alt="D'VINE 2.0"
              width={831}
              height={322}
              className={styles.logo}
            />
          </Link>
          <span className={styles.brandLabel}>Registration</span>
        </div>
        <div className={styles.headerActions}>
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={13} aria-hidden="true" />
            <span>Back</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
