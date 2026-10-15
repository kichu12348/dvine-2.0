"use client";

import { motion } from "framer-motion";
import {
  Check,
  Mail,
  ArrowUpRight,
  RotateCcw,
  AlertCircle,
  RefreshCw,
  Home,
  ArrowLeft,
} from "lucide-react";
import { motionTransitions } from "../../../lib/motion-tokens";
import { PaymentLifecycleStatus } from "../../../components/register/PaymentStatus";
import { TeamRegistrationData } from "../../types";
import styles from "../../register.module.css";

export interface Step4ConfirmationProps {
  formData: TeamRegistrationData;
  paymentStatus: PaymentLifecycleStatus;
  txId: string;
  onSetPaymentStatus: (status: PaymentLifecycleStatus) => void;
  onRetryPayment: () => void;
  onChangePaymentMethod: () => void;
  amount?: number;
  errorMessage?: string | null;
  isPolling?: boolean;
}

export function Step4Confirmation({
  formData,
  paymentStatus,
  txId,
  onRetryPayment,
  onChangePaymentMethod,
  amount = 698,
  errorMessage,
  isPolling,
}: Step4ConfirmationProps) {
  if (paymentStatus === "processing" || paymentStatus === "verifying") {
    return (
      <motion.div
        key="step-4-verifying"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={motionTransitions.springGentle}
        className={styles.confirmation}
        role="status"
      >
        <div className={styles.confirmationHero}>
          <div
            className={[styles.confirmationIcon, styles.processingIcon].join(
              " ",
            )}
          >
            <RefreshCw
              size={26}
              className={styles.spinner}
              aria-hidden="true"
            />
          </div>
          <h2>Making it official.</h2>
          <p>
            {isPolling
              ? "Confirming payment with the bank and reserving your seats. Please keep this tab open."
              : "Communicating securely with the payment gateway..."}
          </p>
        </div>
      </motion.div>
    );
  }

  if (paymentStatus === "failed") {
    return (
      <motion.div
        key="step-4-failed"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={motionTransitions.springGentle}
        className={styles.confirmation}
      >
        <div className={styles.confirmationHero} role="alert">
          <div
            className={[styles.confirmationIcon, styles.failureIcon].join(" ")}
          >
            <AlertCircle size={28} aria-hidden="true" />
          </div>
          <h2>Let&apos;s give that another try.</h2>
          <p>
            {errorMessage ||
              "Your payment could not be completed. If money was debited, it will be refunded automatically by your bank within 3–5 working days."}
          </p>
        </div>
        <div className={styles.confirmationActions}>
          <button
            type="button"
            onClick={onRetryPayment}
            className={styles.primaryButton}
          >
            <RotateCcw size={14} aria-hidden="true" /> Try again
          </button>
          <button
            type="button"
            onClick={onChangePaymentMethod}
            className={styles.secondaryButton}
          >
            <ArrowLeft size={14} aria-hidden="true" /> Back to review
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="step-4-success"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={motionTransitions.springGentle}
      className={styles.confirmation}
    >
      <div className={styles.confirmationHero}>
        <div className={styles.confirmationIcon}>
          <Check size={28} aria-hidden="true" />
        </div>
        <h2>You&apos;re on the list.</h2>
        <p>
          Your team is officially registered for D&apos;VINE 2.0.
          <br />
          We can&apos;t wait to see what you create.
        </p>
      </div>
      <div className={styles.confirmationEmail}>
        <Mail size={17} aria-hidden="true" />
        <div>
          Confirmation emails with your event tickets will be sent to:
          <strong>{formData.member1.email}</strong>
          {formData.member2.email && <strong>{formData.member2.email}</strong>}
          <p className={styles.fieldHint}>
            Check your inbox and spam folder in the next few minutes.
          </p>
        </div>
      </div>
      <div className={styles.receipt}>
        <div className={styles.receiptHeader}>
          <span>D&apos;VINE 2.0 / TEAM PASS</span>
          <strong>₹{amount}.00 paid</strong>
        </div>
        <dl className={styles.reviewDetails}>
          <div>
            <dt>Team name</dt>
            <dd>{formData.teamName || "D'VINE Team"}</dd>
          </div>
          <div>
            <dt>College</dt>
            <dd>{formData.member1.collegeName || "Registered Institution"}</dd>
          </div>
          <div>
            <dt>Team leader</dt>
            <dd>
              {formData.member1.firstName} {formData.member1.lastName}
            </dd>
          </div>
          <div>
            <dt>Teammate</dt>
            <dd>
              {formData.member2.firstName
                ? formData.member2.firstName + " " + formData.member2.lastName
                : "—"}
            </dd>
          </div>
          {txId && (
            <div className={styles.fullWidth}>
              <dt>Transaction reference</dt>
              <dd>{txId}</dd>
            </div>
          )}
        </dl>
      </div>
      <a
        href="https://chat.whatsapp.com/invite/dvine2026"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.communityLink}
      >
        <div>
          <strong>Meet the D&apos;VINE community</strong>
          <span>
            Join the official WhatsApp group for event and mentor updates.
          </span>
        </div>
        <ArrowUpRight size={19} aria-hidden="true" />
      </a>
      <div className={styles.confirmationActions}>
        <a href="/" className={styles.secondaryButton}>
          <Home size={13} aria-hidden="true" /> Back to the event
        </a>
      </div>
    </motion.div>
  );
}
