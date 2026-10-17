import { useEffect } from "react";
import { useRegistrationStore } from "../store/useRegistrationStore";

export function useRegisterForm() {
  const store = useRegistrationStore();

  // Load live seat availability and pricing on initial mount
  useEffect(() => {
    store.fetchSeats();
    store.fetchPricing();
  }, []);

  return {
    // Stepper & Navigation
    currentStep: store.currentStep,
    setCurrentStep: store.setCurrentStep,
    handleNext: store.handleNext,
    handlePrev: store.handlePrev,
    goToStep: store.goToStep,

    // Form Data & Validation Errors
    formData: store.formData,
    errors: store.errors,
    setErrors: store.setErrors,
    updateMember: store.updateMember,
    updateField: store.updateField,
    setRegistrationType: store.setRegistrationType,

    // Autocomplete for Colleges
    activeCollegeTarget: store.activeCollegeTarget,
    setActiveCollegeTarget: store.setActiveCollegeTarget,
    collegeSuggestions: store.collegeSuggestions,
    handleCollegeInputChange: store.handleCollegeInputChange,
    selectCollegeSuggestion: store.selectCollegeSuggestion,

    // OTP Verification
    otpState: store.otpState,
    sendOtp: store.sendOtp,
    verifyOtp: store.verifyOtp,
    resetOtp: store.resetOtp,
    recheckVerification: store.recheckVerification,

    // Seat Availability & Pricing
    seatStatus: store.seatStatus,
    isSeatsLoading: store.isSeatsLoading,
    seatError: store.seatError,
    fetchSeats: store.fetchSeats,
    basePrice: store.basePrice,
    fetchPricing: store.fetchPricing,

    // Discount
    discountState: store.discountState,
    discountPerMember: store.discountPerMember,
    setDiscountCode: store.setDiscountCode,
    applyDiscount: store.applyDiscount,
    clearDiscount: store.clearDiscount,
  };
}
