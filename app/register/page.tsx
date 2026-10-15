"use client";

import { AnimatePresence, MotionConfig } from "framer-motion";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { RegistrationIntro } from "./components/RegistrationIntro";
import styles from "./register.module.css";
import { useRegisterForm } from "./hooks/useRegisterForm";
import { usePaymentSimulation } from "./hooks/usePayment";
import { STEPS } from "./constants";
import type { MemberKey } from "./types";
import { getRegistrationAmount } from "./utils/registration";
import {
  RegisterHeader,
  RegisterStepper,
  Step1TeamDetails,
  Step2AcademicDetails,
  Step3ReviewSummary,
  Step4Confirmation,
} from "./components";

// Re-export domain types for backward compatibility
export type { MemberData, TeamRegistrationData } from "./types";

export default function RegisterPage() {
  const [editingMember, setEditingMember] = useState<MemberKey>("member1");
  const {
    currentStep,
    setCurrentStep,
    formData,
    errors,
    setErrors,
    updateMember,
    updateField,
    setRegistrationType,
    activeCollegeTarget,
    setActiveCollegeTarget,
    collegeSuggestions,
    handleCollegeInputChange,
    selectCollegeSuggestion,
    handleNext,
    handlePrev,
    goToStep,
    otpState,
    sendOtp,
    verifyOtp,
    recheckVerification,
    seatStatus,
    isSeatsLoading,
  } = useRegisterForm();

  const {
    paymentStatus,
    setPaymentStatus,
    txId,
    handleSlidePayment,
    retryPayment,
    paymentState,
  } = usePaymentSimulation(() => setCurrentStep(4));

  const isLeaderEmailVerified =
    Boolean(otpState.verifiedEmail) &&
    otpState.verifiedEmail?.toLowerCase() ===
    formData.member1.email.trim().toLowerCase();

  const isSoldOut = Boolean(seatStatus && seatStatus.available === 0);
  const registrationAmount = getRegistrationAmount(formData);

  const onSlidePayment = async () => {
    try {
      await handleSlidePayment(formData.confirmAccuracy);
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        terms:
          err?.message ||
          "Please check your details and verify your registration email.",
      }));
      throw err;
    }
  };

  const handleSetTermsError = (msg: string) => {
    setErrors((prev) => ({ ...prev, terms: msg }));
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className={styles.page}>
        <RegisterHeader seatStatus={seatStatus} isLoading={isSeatsLoading} />

        <main className={styles.shell}>
          <RegistrationIntro amount={registrationAmount} isSolo={formData.registrationType === "solo"} />
          <div className={styles.formSurface}>
            <RegisterStepper
              currentStep={currentStep}
              steps={STEPS}
              onStepClick={(step) => { setEditingMember("member1"); goToStep(step); }}
            />

            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <Step1TeamDetails
                  formData={formData}
                  errors={errors}
                  onUpdateField={updateField}
                  onUpdateMember={updateMember}
                  onNext={handleNext}
                  isSoldOut={isSoldOut}
                  initialMember={editingMember}
                  onRegistrationTypeChange={setRegistrationType}
                />
              )}

              {currentStep === 2 && (
                <Step2AcademicDetails
                  formData={formData}
                  errors={errors}
                  activeCollegeTarget={activeCollegeTarget}
                  collegeSuggestions={collegeSuggestions}
                  onCollegeChange={handleCollegeInputChange}
                  onCollegeSelect={selectCollegeSuggestion}
                  onCollegeFocus={setActiveCollegeTarget}
                  onUpdateMember={updateMember}
                  onPrev={handlePrev}
                  onNext={handleNext}
                  initialMember={editingMember}
                />
              )}

              {currentStep === 3 && (
                <Step3ReviewSummary
                  formData={formData}
                  errors={errors}
                  onEditStep={(step, member = "member1") => { setEditingMember(member); goToStep(step); }}
                  onUpdateField={updateField}
                  onSlidePayment={onSlidePayment}
                  onSetTermsError={handleSetTermsError}
                  amount={registrationAmount}
                  isLeaderEmailVerified={isLeaderEmailVerified}
                  otpState={otpState}
                  onSendOtp={sendOtp}
                  onVerifyOtp={verifyOtp}
                  onVerificationExpired={() =>
                    recheckVerification(formData.member1.email)
                  }
                />
              )}

              {currentStep === 4 && (
                <Step4Confirmation
                  formData={formData}
                  paymentStatus={paymentStatus}
                  txId={txId}
                  onSetPaymentStatus={setPaymentStatus}
                  onRetryPayment={retryPayment}
                  onChangePaymentMethod={() => goToStep(3)}
                  amount={paymentState.orderId ? paymentState.amount : registrationAmount}
                  errorMessage={paymentState.errorMessage}
                  isPolling={paymentState.isPolling}
                />
              )}
            </AnimatePresence>
          </div>
          <div className={styles.footer}><span>D&apos;VINE 2.0 · A space for good ideas.</span><span><ShieldCheck size={13} aria-hidden="true" /> Secured by Razorpay</span></div>
        </main>
      </div>
    </MotionConfig>
  );
}
