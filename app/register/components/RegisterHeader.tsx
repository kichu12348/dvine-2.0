import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { SeatStatusResponse } from "../types";
import styles from "../register.module.css";

export interface RegisterHeaderProps {
  seatStatus?: SeatStatusResponse | null;
  isLoading?: boolean;
}

export function RegisterHeader({ seatStatus, isLoading }: RegisterHeaderProps) {
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
          {/* <div className={styles.availability} role="status">
            {isLoading ? (
              <span>Checking…</span>
            ) : seatStatus ? (
              seatStatus.available === 0 ? (
                <span className={styles.soldOut}>Sold out</span>
              ) : (
                <>
                  <span className={styles.statusDot} aria-hidden="true" />
                  <span>
                    <strong>{seatStatus.available}</strong>
                    <span className={styles.availabilityTotal}> / {seatStatus.total}</span>
                    {" "}seats
                    <span className={styles.availabilitySuffix}> left</span>
                  </span>
                </>
              )
            ) : null}
          </div> */}
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={13} aria-hidden="true" />
            <span>Back</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
