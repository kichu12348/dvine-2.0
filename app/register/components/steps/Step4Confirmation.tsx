"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Check,
  Mail,
  ArrowUpRight,
  RotateCcw,
  AlertCircle,
  RefreshCw,
  Home,
  ArrowLeft,
  Ticket,
} from "lucide-react";
import { motionTransitions } from "../../../lib/motion-tokens";
import { PaymentLifecycleStatus } from "../../../components/register/PaymentStatus";
import { PaidTeamDetails, TeamRegistrationData } from "../../types";
import { useRegistrationStore } from "../../store/useRegistrationStore";
import styles from "../../register.module.css";
import { getRegistrationAmount } from "../../utils/registration";

export interface Step4ConfirmationProps {
  formData: TeamRegistrationData;
  paymentStatus: "idle" | PaymentLifecycleStatus;
  txId: string;
  onSetPaymentStatus: (status: PaymentLifecycleStatus) => void;
  onRetryPayment: () => void;
  onChangePaymentMethod: () => void;
  amount?: number;
  errorMessage?: string | null;
  isPolling?: boolean;
  basePrice?: number;
  paidTeam?: PaidTeamDetails | null;
}

export function Step4Confirmation({
  formData,
  paymentStatus,
  txId,
  onRetryPayment,
  onChangePaymentMethod,
  basePrice,
  amount = getRegistrationAmount(formData, basePrice),
  errorMessage,
  isPolling,
  paidTeam,
}: Step4ConfirmationProps) {
  const storePaidTeam = useRegistrationStore((s) => s.paymentState.paidTeam);
  const effectivePaidTeam = paidTeam !== undefined ? paidTeam : storePaidTeam;
  const isSolo = formData.registrationType === "solo";

  const leadMember =
    effectivePaidTeam?.members?.find(
      (m) => m.role === "lead" || m.slot === 1,
    ) || effectivePaidTeam?.members?.[0];

  const teammateMember =
    effectivePaidTeam?.members?.find(
      (m) => m.role === "member" || m.slot === 2,
    ) ||
    (effectivePaidTeam?.members && effectivePaidTeam.members.length > 1
      ? effectivePaidTeam.members[1]
      : undefined);
  if (
    paymentStatus === "idle" ||
    paymentStatus === "processing" ||
    paymentStatus === "verifying"
  ) {
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
          You&apos;re officially registered for D&apos;VINE 2.0.
          <br />
          We can&apos;t wait to see what you create.
        </p>
      </div>
      <div className={styles.confirmationEmail}>
        <Mail size={17} aria-hidden="true" />
        <div>
          {isSolo
            ? "Your confirmation and event ticket will be sent to:"
            : "Confirmation emails with your event tickets will be sent to:"}
          <strong>{formData.member1.email}</strong>
          {!isSolo && formData.member2.email && (
            <strong>{formData.member2.email}</strong>
          )}
          <p className={styles.fieldHint}>
            Check your inbox and spam folder in the next few minutes.
          </p>
        </div>
      </div>
      <div className={styles.receipt}>
        <div className={styles.receiptHeader}>
          <span>D&apos;VINE 2.0 / {isSolo ? "SOLO PASS" : "TEAM PASS"}</span>
          <strong>₹{amount}.00 paid</strong>
        </div>
        <dl className={styles.reviewDetails}>
          <div>
            <dt>{isSolo ? "Name" : "Team name"}</dt>
            <dd>{formData.teamName?.trim()}</dd>
          </div>
          <div>
            <dt>College</dt>
            <dd>{formData.member1.collegeName || "Registered Institution"}</dd>
          </div>
          <div>
            <dt>{isSolo ? "Participant" : "Team leader"}</dt>
            <dd>
              <div>
                {formData.member1.firstName} {formData.member1.lastName}
              </div>
              {leadMember?.ticketHash && (
                <div style={{ marginTop: 6 }}>
                  <Link
                    href={`/ticket/${leadMember.ticketHash}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      color: "#a6dfff",
                      fontSize: 12,
                      fontWeight: 500,
                      textDecoration: "underline",
                      textUnderlineOffset: 3,
                    }}
                  >
                    View ticket <ArrowUpRight size={12} aria-hidden="true" />
                  </Link>
                </div>
              )}
            </dd>
          </div>
          {!isSolo && (
            <div>
              <dt>Teammate</dt>
              <dd>
                <div>
                  {formData.member2.firstName
                    ? formData.member2.firstName +
                      " " +
                      formData.member2.lastName
                    : "—"}
                </div>
                {teammateMember?.ticketHash && (
                  <div style={{ marginTop: 6 }}>
                    <Link
                      href={`/ticket/${teammateMember.ticketHash}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        color: "#a6dfff",
                        fontSize: 12,
                        fontWeight: 500,
                        textDecoration: "underline",
                        textUnderlineOffset: 3,
                      }}
                    >
                      View ticket <ArrowUpRight size={12} aria-hidden="true" />
                    </Link>
                  </div>
                )}
              </dd>
            </div>
          )}

          {txId && (
            <div className={styles.fullWidth}>
              <dt>Transaction reference</dt>
              <dd>{txId}</dd>
            </div>
          )}
        </dl>
      </div>
      {effectivePaidTeam?.members && effectivePaidTeam.members.length > 0 && (
        <div className={styles.receipt} style={{ marginTop: 20 }}>
          <div className={styles.receiptHeader}>
            <span>DIGITAL TICKETS</span>
            <strong>
              {effectivePaidTeam.members.length}{" "}
              {effectivePaidTeam.members.length === 1 ? "TICKET" : "TICKETS"}
            </strong>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {effectivePaidTeam.members.map((member, index) => (
              <div
                key={member.ticketHash || index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 12,
                  padding: "14px 16px",
                  borderRadius: 8,
                  background: "#141f2a",
                  border: "1px solid #283e50",
                }}
              >
                <div>
                  <strong
                    style={{
                      display: "block",
                      color: "#ecf2f7",
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                  >
                    {member.firstName} {member.lastName}
                  </strong>
                  <span style={{ fontSize: 11, color: "#8da5b8" }}>
                    {member.role === "lead"
                      ? isSolo
                        ? "Solo Attendee"
                        : "Team Leader"
                      : "Teammate"}{" "}
                    • {member.email}
                  </span>
                </div>
                <Link
                  href={`/ticket/${member.ticketHash}`}
                  className={styles.secondaryButton}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 14px",
                    minHeight: "unset",
                    fontSize: 12,
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  <Ticket size={14} aria-hidden="true" />
                  <span>View ticket</span>
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
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
