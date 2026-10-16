"use client";

import React from "react";
import { motion } from "framer-motion";
import { Pencil, Crown, UserCheck, ShieldCheck, ArrowLeft } from "lucide-react";
import { motionTransitions } from "../../../lib/motion-tokens";
import SlideCommit from "../../../components/ui/SlideCommit";
import {
  FormErrors,
  MemberKey,
  OtpState,
  TeamRegistrationData,
} from "../../types";
import { MemberReviewCard } from "../shared/MemberReviewCard";
import { LeaderEmailOtpArea } from "../shared/LeaderEmailOtpArea";
import { loadRazorpayScript } from "../../utils/loadRazorpay";
import { getMemberKeys, getRegistrationAmount } from "../../utils/registration";
import { PRICING_CONFIG } from "../../constants";
import styles from "../../register.module.css";

export interface Step3ReviewSummaryProps {
  formData: TeamRegistrationData;
  errors: FormErrors;
  onEditStep: (step: number, member?: MemberKey) => void;
  onUpdateField: (
    field: "teamName" | "confirmAccuracy",
    value: string | boolean,
  ) => void;
  onSlidePayment: () => Promise<void>;
  onSetTermsError: (msg: string) => void;
  amount?: number;
  basePrice?: number;
  isLeaderEmailVerified: boolean;
  otpState: OtpState;
  onSendOtp: (email: string) => Promise<boolean>;
  onVerifyOtp: (email: string, code: string) => Promise<boolean>;
  onVerificationExpired?: () => void;
}

export function Step3ReviewSummary({
  formData,
  errors,
  onEditStep,
  onUpdateField,
  onSlidePayment,
  onSetTermsError,
  basePrice = PRICING_CONFIG.feePerMember,
  amount = getRegistrationAmount(formData, basePrice),
  isLeaderEmailVerified,
  otpState,
  onSendOtp,
  onVerifyOtp,
  onVerificationExpired,
}: Step3ReviewSummaryProps) {
  const isSolo = formData.registrationType === "solo";
  const memberCount = getMemberKeys(formData).length;
  const isSlideEnabled = formData.confirmAccuracy && isLeaderEmailVerified;

  React.useEffect(() => {
    loadRazorpayScript();
  }, []);

  return (
    <motion.div
      key="step-3"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={motionTransitions.springGentle}
      className={styles.stepContent}
    >
      <div className={styles.sectionHeading}>
        <div>
          <h2>Looks good? Make it official.</h2>
          <p>
            Review your details and verify {isSolo ? "your" : "the leader's"}{" "}
            email to pay.
          </p>
        </div>
        <span className={styles.stepCounter}>
          03 <span>/ 04</span>
        </span>
      </div>
      <div className={styles.reviewTeam}>
        <div>
          <small>TEAM NAME</small>
          <h3>{formData.teamName?.trim()}</h3>
        </div>
        <button
          type="button"
          onClick={() => onEditStep(1)}
          className={styles.editButton}
        >
          <Pencil size={11} aria-hidden="true" /> Edit name
        </button>
      </div>
      <div
        className={[styles.memberGrid, isSolo ? styles.singleMember : ""].join(
          " ",
        )}
      >
        <MemberReviewCard
          title={isSolo ? "Participant" : "Team leader"}
          icon={<Crown size={15} />}
          memberData={formData.member1}
          onEdit={() => onEditStep(1, "member1")}
        />
        {!isSolo && (
          <MemberReviewCard
            title="Teammate"
            icon={<UserCheck size={15} />}
            memberData={formData.member2}
            onEdit={() => onEditStep(1, "member2")}
          />
        )}
      </div>
      <div className={styles.checkout}>
        <div>
          <h3>{isSolo ? "Your solo pass" : "Your team pass"}</h3>
          <div className={styles.priceRow}>
            <span>{isSolo ? "Participant" : "Team leader"}</span>
            <span>₹{basePrice}.00</span>
          </div>
          {!isSolo && (
            <div className={styles.priceRow}>
              <span>Teammate</span>
              <span>₹{basePrice}.00</span>
            </div>
          )}

          <div className={styles.priceTotal}>
            <span>Total payable (estimate)</span>
            <strong>₹{amount}</strong>
          </div>
          <p className={styles.fieldHint}>
            Estimated amount; final amount comes from the server · Includes GST
          </p>
        </div>
        <div className={styles.checkoutAction}>
          <LeaderEmailOtpArea
            email={formData.member1.email}
            isSolo={isSolo}
            isVerified={isLeaderEmailVerified}
            otpState={otpState}
            onSendOtp={onSendOtp}
            onVerifyOtp={onVerifyOtp}
            onEditEmail={() => onEditStep(1)}
            onExpire={onVerificationExpired}
          />
          <label className={styles.consent}>
            <input
              type="checkbox"
              checked={formData.confirmAccuracy}
              onChange={(e) =>
                onUpdateField("confirmAccuracy", e.target.checked)
              }
            />
            <span>
              I confirm that the registration details above are accurate to the
              best of my knowledge.
            </span>
          </label>
          {errors.terms && (
            <p className={styles.error} role="alert">
              {errors.terms}
            </p>
          )}
          <SlideCommit
            label={
              !isLeaderEmailVerified
                ? "Verify email to unlock payment"
                : "Slide to pay ₹" + amount
            }
            doneLabel="Launching Gateway..."
            errorLabel="Verify email & confirm info"
            height={54}
            trackColor="#172c40"
            handleColor="#9ee4ff"
            successColor="#0284c7"
            dangerColor="#f43f5e"
            disabled={!isSlideEnabled}
            disabledReason={
              !formData.confirmAccuracy
                ? "Please confirm that the information above is accurate."
                : !isLeaderEmailVerified
                  ? "Please verify your registration email before proceeding."
                  : undefined
            }
            onConfirm={onSlidePayment}
            onError={(reason) => {
              const errorMsg =
                reason instanceof Error
                  ? reason.message
                  : typeof reason === "string"
                    ? reason
                    : "";
              if (!formData.confirmAccuracy) {
                onSetTermsError(
                  "Please confirm that the information above is accurate.",
                );
              } else if (!isLeaderEmailVerified) {
                onSetTermsError(
                  "Please verify your registration email before proceeding.",
                );
              } else if (errorMsg) {
                onSetTermsError(errorMsg);
              } else {
                onSetTermsError(
                  "Unable to initiate payment. Please try again.",
                );
              }
            }}
            className="w-full"
          />
          <div className={styles.gateway}>
            <ShieldCheck size={12} aria-hidden="true" /> Secured by Razorpay
          </div>
          <p className={styles.gatewayNote}>
            UPI, credit / debit cards & netbanking
          </p>
        </div>
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          onClick={() => onEditStep(2)}
          className={styles.secondaryButton}
        >
          <ArrowLeft size={14} aria-hidden="true" /> Academic details
        </button>
        <span className={styles.actionNote}>
          ₹{amount} for {memberCount}{" "}
          {memberCount === 1 ? "participant" : "participants"}
        </span>
      </div>
    </motion.div>
  );
}
