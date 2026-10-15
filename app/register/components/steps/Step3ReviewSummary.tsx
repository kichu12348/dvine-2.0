"use client";

import React from "react";
import { motion } from "framer-motion";
import { Pencil, Crown, UserCheck, ShieldCheck, ArrowLeft } from "lucide-react";
import { motionTransitions } from "../../../lib/motion-tokens";
import SlideCommit from "../../../components/ui/SlideCommit";
import { FormErrors, MemberKey, OtpState, TeamRegistrationData } from "../../types";
import { MemberReviewCard } from "../shared/MemberReviewCard";
import { LeaderEmailOtpArea } from "../shared/LeaderEmailOtpArea";
import { loadRazorpayScript } from "../../utils/loadRazorpay";
import styles from "../../register.module.css";

export interface Step3ReviewSummaryProps {
  formData: TeamRegistrationData;
  errors: FormErrors;
  onEditStep: (step: number, member?: MemberKey) => void;
  onUpdateField: (field: "teamName" | "confirmAccuracy", value: string | boolean) => void;
  onSlidePayment: () => Promise<void>;
  onSetTermsError: (msg: string) => void;
  amount?: number;
  isLeaderEmailVerified: boolean;
  otpState: OtpState;
  onSendOtp: (email: string) => Promise<boolean>;
  onVerifyOtp: (email: string, code: string) => Promise<boolean>;
  onVerificationExpired?: () => void;
}

export function Step3ReviewSummary({ formData, errors, onEditStep, onUpdateField, onSlidePayment, onSetTermsError,
  amount = 600, isLeaderEmailVerified, otpState, onSendOtp, onVerifyOtp, onVerificationExpired }: Step3ReviewSummaryProps) {
  const perHead = Math.round(amount / 2);
  const isSlideEnabled = formData.confirmAccuracy && isLeaderEmailVerified;

  React.useEffect(() => {
    loadRazorpayScript();
  }, []);

  return (
    <motion.div key="step-3" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
      transition={motionTransitions.springGentle} className={styles.stepContent}>
      <div className={styles.sectionHeading}>
        <div><h2>Looks good? Make it official.</h2>
        <p>Review your details and verify the leader&apos;s email to pay.</p></div>
        <span className={styles.stepCounter}>03 <span>/ 04</span></span>
      </div>
      <div className={styles.reviewTeam}>
        <div><small>YOUR TEAM</small><h3>{formData.teamName || "D'VINE 2.0 Team"}</h3></div>
        <button type="button" onClick={() => onEditStep(1)} className={styles.editButton}><Pencil size={11} aria-hidden="true" /> Edit team</button>
      </div>
      <div className={styles.memberGrid}>
        <MemberReviewCard title="Team leader" icon={<Crown size={15} />} memberData={formData.member1} onEdit={() => onEditStep(1, "member1")} />
        <MemberReviewCard title="Teammate" icon={<UserCheck size={15} />} memberData={formData.member2} onEdit={() => onEditStep(1, "member2")} />
      </div>
      <div className={styles.checkout}>
        <div>
          <h3>Your team pass</h3>
          <div className={styles.priceRow}><span>Team leader</span><span>₹{perHead}.00</span></div>
          <div className={styles.priceRow}><span>Teammate</span><span>₹{perHead}.00</span></div>
          <div className={styles.priceTotal}><span>Total payable</span><strong>₹{amount}</strong></div>
          <p className={styles.fieldHint}>INR · Includes GST</p>
        </div>
        <div className={styles.checkoutAction}>
          <LeaderEmailOtpArea email={formData.member1.email} isVerified={isLeaderEmailVerified} otpState={otpState}
            onSendOtp={onSendOtp} onVerifyOtp={onVerifyOtp} onEditEmail={() => onEditStep(1)} onExpire={onVerificationExpired} />
          <label className={styles.consent}>
            <input type="checkbox" checked={formData.confirmAccuracy} onChange={(e) => onUpdateField("confirmAccuracy", e.target.checked)} />
            <span>I confirm that the team and member details above are accurate to the best of my knowledge.</span>
          </label>
          {errors.terms && <p className={styles.error} role="alert">{errors.terms}</p>}
          <SlideCommit
            label={!isLeaderEmailVerified ? "Verify email to unlock payment" : "Slide to pay ₹" + amount}
            doneLabel="Launching Gateway..." errorLabel="Verify email & confirm info" height={54}
            trackColor="#172c40" handleColor="#9ee4ff" successColor="#0284c7" dangerColor="#f43f5e"
            disabled={!isSlideEnabled}
            disabledReason={!formData.confirmAccuracy ? "Please confirm that the information above is accurate."
              : !isLeaderEmailVerified ? "Please verify the leader's email before proceeding." : undefined}
            onConfirm={onSlidePayment}
            onError={(reason) => {
              const errorMsg = reason instanceof Error ? reason.message : typeof reason === "string" ? reason : "";
              if (!formData.confirmAccuracy) {
                onSetTermsError("Please confirm that the information above is accurate.");
              } else if (!isLeaderEmailVerified) {
                onSetTermsError("Please verify the leader's email before proceeding.");
              } else if (errorMsg) {
                onSetTermsError(errorMsg);
              } else {
                onSetTermsError("Unable to initiate payment. Please try again.");
              }
            }}
            className="w-full"
          />
          <div className={styles.gateway}><ShieldCheck size={12} aria-hidden="true" /> Secured by Razorpay</div>
          <p className={styles.gatewayNote}>UPI, credit / debit cards & netbanking</p>
        </div>
      </div>
      <div className={styles.actions}>
        <button type="button" onClick={() => onEditStep(2)} className={styles.secondaryButton}><ArrowLeft size={14} aria-hidden="true" /> Academic details</button>
        <span className={styles.actionNote}>₹{amount} for both members</span>
      </div>
    </motion.div>
  );
}
