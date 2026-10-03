"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Pencil,
  User,
  Users,
  School,
  Mail,
  Phone,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Crown,
  UserCheck,
} from "lucide-react";
import { cn } from "../lib/utils";
import { motionTransitions } from "../lib/motion-tokens";
import PaymentStatus, {
  PaymentLifecycleStatus,
} from "../components/register/PaymentStatus";
import SlideCommit from "../components/ui/SlideCommit";

export interface MemberData {
  firstName: string;
  lastName: string;
  gender: string;
  phone: string;
  email: string;
  collegeName: string;
  yearOfStudy: string;
  department: string;
}

export interface TeamRegistrationData {
  teamName: string;
  member1: MemberData;
  member2: MemberData;
  confirmAccuracy: boolean;
}

const INITIAL_MEMBER: MemberData = {
  firstName: "",
  lastName: "",
  gender: "",
  phone: "",
  email: "",
  collegeName: "",
  yearOfStudy: "",
  department: "",
};

const INITIAL_DATA: TeamRegistrationData = {
  teamName: "",
  member1: { ...INITIAL_MEMBER },
  member2: { ...INITIAL_MEMBER },
  confirmAccuracy: true,
};

const STEPS = [
  { id: 1, label: "Team & Members", shortLabel: "Team" },
  { id: 2, label: "Academic Details", shortLabel: "College" },
  { id: 3, label: "Review & Summary", shortLabel: "Review" },
  { id: 4, label: "Confirmation", shortLabel: "Receipt" },
];

const GENDER_OPTIONS = ["Male", "Female"];
const YEAR_OPTIONS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "Postgraduate",
  "Other",
];

const COMMON_COLLEGES = [
  "Govt. Model Engineering College, Thrikkakara",
  "College of Engineering Trivandrum (CET)",
  "TKM College of Engineering, Kollam",
  "National Institute of Technology Calicut (NITC)",
  "Government Engineering College, Barton Hill",
  "Government Engineering College, Thrissur (GECT)",
  "SCMS School of Engineering and Technology",
  "Rajagiri School of Engineering & Technology (RSET)",
  "Muthoot Institute of Technology and Science (MITS)",
  "Federal Institute of Science and Technology (FISAT)",
  "College Of Engineering Chengannur (CEC)",
];

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<TeamRegistrationData>(INITIAL_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentStatus, setPaymentStatus] =
    useState<PaymentLifecycleStatus>("processing");
  const [txId, setTxId] = useState<string>("tx_rzp_9842a8d11c7f");

  // Autocomplete state for college search
  const [activeCollegeTarget, setActiveCollegeTarget] = useState<
    "member1" | "member2" | null
  >(null);
  const [collegeSuggestions, setCollegeSuggestions] = useState<string[]>([]);

  const updateMember = (
    memberKey: "member1" | "member2",
    field: keyof MemberData,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [memberKey]: { ...prev[memberKey], [field]: value },
    }));

    const errorKey = `${memberKey}.${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[errorKey];
        return next;
      });
    }
  };

  const updateField = (
    field: "teamName" | "confirmAccuracy",
    value: string | boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      if (field === "confirmAccuracy") {
        delete next.terms;
      }
      return next;
    });
  };

  const handleCollegeInputChange = (
    memberKey: "member1" | "member2",
    val: string,
  ) => {
    updateMember(memberKey, "collegeName", val);
    if (val.trim().length > 1) {
      const filtered = COMMON_COLLEGES.filter((col) =>
        col.toLowerCase().includes(val.toLowerCase()),
      );
      setCollegeSuggestions(filtered);
      setActiveCollegeTarget(memberKey);
    } else {
      setCollegeSuggestions([]);
      setActiveCollegeTarget(null);
    }
  };

  // Step 1 Validation (Team Name & Both Members' Basic Details)
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.teamName.trim()) {
      newErrors.teamName = "Team name is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate Member 1 (Leader)
    if (!formData.member1.firstName.trim())
      newErrors["member1.firstName"] = "First name is required";
    if (!formData.member1.lastName.trim())
      newErrors["member1.lastName"] = "Last name is required";
    if (!formData.member1.gender)
      newErrors["member1.gender"] = "Please select gender";
    if (!formData.member1.email.trim()) {
      newErrors["member1.email"] = "Email address is required";
    } else if (!emailRegex.test(formData.member1.email.trim())) {
      newErrors["member1.email"] = "Please enter a valid email address";
    }
    const cleanPhone1 = formData.member1.phone.replace(/[^0-9]/g, "");
    if (!formData.member1.phone.trim()) {
      newErrors["member1.phone"] = "Phone number is required";
    } else if (cleanPhone1.length < 10) {
      newErrors["member1.phone"] = "Must be at least 10 digits";
    }

    // Validate Member 2
    if (!formData.member2.firstName.trim())
      newErrors["member2.firstName"] = "First name is required";
    if (!formData.member2.lastName.trim())
      newErrors["member2.lastName"] = "Last name is required";
    if (!formData.member2.gender)
      newErrors["member2.gender"] = "Please select gender";
    if (!formData.member2.email.trim()) {
      newErrors["member2.email"] = "Email address is required";
    } else if (!emailRegex.test(formData.member2.email.trim())) {
      newErrors["member2.email"] = "Please enter a valid email address";
    } else if (
      formData.member2.email.trim().toLowerCase() ===
      formData.member1.email.trim().toLowerCase()
    ) {
      newErrors["member2.email"] = "Teammate must have a different email";
    }

    const cleanPhone2 = formData.member2.phone.replace(/[^0-9]/g, "");
    if (!formData.member2.phone.trim()) {
      newErrors["member2.phone"] = "Phone number is required";
    } else if (cleanPhone2.length < 10) {
      newErrors["member2.phone"] = "Must be at least 10 digits";
    } else if (cleanPhone1 && cleanPhone2 === cleanPhone1) {
      newErrors["member2.phone"] =
        "Teammate must have a different phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 2 Validation (Both Members' College Details)
  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    // Member 1
    if (!formData.member1.collegeName.trim())
      newErrors["member1.collegeName"] = "College name is required";
    if (!formData.member1.yearOfStudy)
      newErrors["member1.yearOfStudy"] = "Year of study is required";
    if (!formData.member1.department.trim())
      newErrors["member1.department"] = "Department is required";

    // Member 2
    if (!formData.member2.collegeName.trim())
      newErrors["member2.collegeName"] = "College name is required";
    if (!formData.member2.yearOfStudy)
      newErrors["member2.yearOfStudy"] = "Year of study is required";
    if (!formData.member2.department.trim())
      newErrors["member2.department"] = "Department is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        setCurrentStep(3);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1 && currentStep < 4) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSlidePayment = () => {
    if (!formData.confirmAccuracy) {
      setErrors({
        terms: "Please confirm that the information above is accurate.",
      });
      throw new Error("Confirmation required");
    }

    return new Promise<void>((resolve) => {
      // Generate random mock transaction id
      const randomHex = Math.random().toString(36).substring(2, 10);
      const newTx = `rzp_live_${randomHex}`;
      setTxId(newTx);

      setTimeout(() => {
        resolve();
        // Give smooth delay so user sees "Processing..." state with animated spinner
        setTimeout(() => {
          setCurrentStep(4);
          window.scrollTo({ top: 0, behavior: "smooth" });
          setPaymentStatus("processing");
          setTimeout(() => setPaymentStatus("verifying"), 1200);
          setTimeout(() => setPaymentStatus("success"), 2500);
        }, 1100);
      }, 150);
    });
  };

  const retryPayment = () => {
    setPaymentStatus("processing");
    setTimeout(() => setPaymentStatus("verifying"), 1000);
    setTimeout(() => setPaymentStatus("success"), 2200);
  };

  return (
    <div className="min-h-[100dvh] bg-[#020817] text-[#FAFAFA] antialiased selection:bg-cyan-500/30 selection:text-white flex flex-col justify-between overflow-x-hidden w-full max-w-full">
      {/* Background Decorative Gradients */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[720px] h-[400px] bg-gradient-to-b from-sky-500/10 via-cyan-400/5 to-transparent blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[400px] bg-blue-600/5 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-25" />
      </div>

      {/* Top Header / Navigation Bar */}
      <header className="relative z-20 border-b border-white/[0.07] bg-[#020817]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-400 hover:text-white transition-colors shrink-0"
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 border border-white/10 group-hover:border-white/20 group-hover:bg-white/10 transition-all">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </span>
            <span className="truncate">Back to D&apos;VINE</span>
          </Link>

          <Link
            href="/"
            className="flex items-center transition-transform hover:scale-[1.03] select-none shrink-0"
            aria-label="Go to D'VINE Home"
          >
            <Image
              src="/dvine.svg"
              alt="D'VINE 2.0"
              width={831}
              height={322}
              className="h-6 sm:h-7 md:h-8 w-auto max-w-[120px] sm:max-w-none object-contain drop-shadow-[0_2px_12px_rgba(26,186,255,0.4)]"
              priority
            />
          </Link>
        </div>
      </header>

      {/* Main Body */}
      <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Stepper Progress Bar */}
        <div className="w-full mb-6 sm:mb-12 px-0.5">
          <div className="flex items-center justify-between relative max-w-3xl mx-auto">
            {STEPS.map((step, idx) => {
              const isCompleted = currentStep > step.id;
              const isActive = currentStep === step.id;
              const isLast = idx === STEPS.length - 1;

              return (
                <React.Fragment key={step.id}>
                  {/* Step Item */}
                  <div
                    onClick={() => {
                      if (isCompleted && currentStep !== 4) {
                        setCurrentStep(step.id);
                      }
                    }}
                    className={cn(
                      "flex items-center gap-1.5 sm:gap-3 group select-none transition-all shrink-0",
                      isCompleted && currentStep !== 4
                        ? "cursor-pointer"
                        : "cursor-default",
                    )}
                  >
                    {/* Circle Indicator */}
                    <div
                      className={cn(
                        "w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-all duration-300",
                        isCompleted
                          ? "bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                          : isActive
                            ? "bg-transparent border-2 border-white text-white shadow-[0_0_10px_rgba(255,255,255,0.25)]"
                            : "bg-white/5 border border-white/20 text-neutral-500",
                      )}
                    >
                      {isCompleted ? (
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                      ) : (
                        <span>{step.id}</span>
                      )}
                    </div>

                    {/* Step Label */}
                    <span
                      className={cn(
                        "text-xs sm:text-sm font-medium tracking-tight hidden sm:inline-block transition-colors",
                        isActive
                          ? "text-white font-semibold"
                          : isCompleted
                            ? "text-neutral-300 group-hover:text-white"
                            : "text-neutral-500",
                      )}
                    >
                      {step.label}
                    </span>
                  </div>

                  {/* Connecting Line */}
                  {!isLast && (
                    <div className="flex-1 mx-1.5 sm:mx-4 h-[1.5px] bg-neutral-800 relative overflow-hidden rounded-full min-w-[8px]">
                      <div
                        className={cn(
                          "h-full bg-white transition-all duration-500",
                          currentStep > step.id ? "w-full" : "w-0",
                        )}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Mobile Step Title */}
          <div className="sm:hidden text-center mt-3">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
              Step {currentStep} of 4:{" "}
              <span className="text-white font-medium">
                {STEPS.find((s) => s.id === currentStep)?.label}
              </span>
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={motionTransitions.springGentle}
              className="max-w-2xl mx-auto space-y-6"
            >
              <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D14]/90 backdrop-blur-xl p-4 sm:p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                {/* Header */}
                <div className="mb-5 sm:mb-8 border-b border-white/[0.07] pb-4 sm:pb-5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                      <Users className="w-5 h-5 text-cyan-400 shrink-0" />
                      <span>Team & Member Details</span>
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                    Enter your team name and contact details for both members to
                    register.
                  </p>
                </div>

                <div className="space-y-6 sm:space-y-8">
                  {/* Team Identity Card */}
                  <div className="p-4 sm:p-5 rounded-xl bg-white/[0.02] border border-cyan-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                    <label className="block text-xs font-mono uppercase tracking-wider text-cyan-300 mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span>Team Name</span>{" "}
                        <span className="text-rose-400">*</span>
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your Team Name"
                      value={formData.teamName}
                      onChange={(e) => updateField("teamName", e.target.value)}
                      className={cn(
                        "w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 transition-all",
                        errors.teamName
                          ? "border-rose-500/80 focus:ring-rose-400 focus:border-rose-400"
                          : "border-white/10 hover:border-white/20 focus:ring-cyan-400 focus:border-cyan-400",
                      )}
                    />
                    {errors.teamName && (
                      <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.teamName}</span>
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-4 border-b border-white/[0.06] pb-2.5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                          Team Leader
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Name */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                            First Name <span className="text-rose-400">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Alex"
                            value={formData.member1.firstName}
                            onChange={(e) =>
                              updateMember(
                                "member1",
                                "firstName",
                                e.target.value,
                              )
                            }
                            className={cn(
                              "w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 transition-all",
                              errors["member1.firstName"]
                                ? "border-rose-500/80 focus:ring-rose-400 focus:border-rose-400"
                                : "border-white/10 hover:border-white/20 focus:ring-cyan-400 focus:border-cyan-400",
                            )}
                          />
                          {errors["member1.firstName"] && (
                            <p className="text-[11px] text-rose-400 mt-1">
                              {errors["member1.firstName"]}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                            Last Name <span className="text-rose-400">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Rivera"
                            value={formData.member1.lastName}
                            onChange={(e) =>
                              updateMember(
                                "member1",
                                "lastName",
                                e.target.value,
                              )
                            }
                            className={cn(
                              "w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 transition-all",
                              errors["member1.lastName"]
                                ? "border-rose-500/80 focus:ring-rose-400 focus:border-rose-400"
                                : "border-white/10 hover:border-white/20 focus:ring-cyan-400 focus:border-cyan-400",
                            )}
                          />
                          {errors["member1.lastName"] && (
                            <p className="text-[11px] text-rose-400 mt-1">
                              {errors["member1.lastName"]}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                          Gender <span className="text-rose-400">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {GENDER_OPTIONS.map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() =>
                                updateMember("member1", "gender", opt)
                              }
                              className={cn(
                                "px-2.5 sm:px-3 py-2 rounded-xl text-[11px] sm:text-xs font-medium border text-center transition-all cursor-pointer truncate",
                                formData.member1.gender === opt
                                  ? "bg-white text-black border-white font-semibold shadow-[0_2px_12px_rgba(255,255,255,0.2)]"
                                  : "bg-white/[0.03] border-white/10 text-neutral-400 hover:text-white hover:border-white/20",
                              )}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                        {errors["member1.gender"] && (
                          <p className="text-[11px] text-rose-400 mt-1">
                            {errors["member1.gender"]}
                          </p>
                        )}
                      </div>

                      {/* Email & Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center justify-between">
                            <span>
                              Email <span className="text-rose-400">*</span>
                            </span>
                            <span className="text-[10px] text-neutral-500">
                              Receipt sent here
                            </span>
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                            <input
                              type="email"
                              placeholder="leader@example.com"
                              value={formData.member1.email}
                              onChange={(e) =>
                                updateMember("member1", "email", e.target.value)
                              }
                              className={cn(
                                "w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/[0.03] border text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 transition-all",
                                errors["member1.email"]
                                  ? "border-rose-500/80 focus:ring-rose-400 focus:border-rose-400"
                                  : "border-white/10 hover:border-white/20 focus:ring-cyan-400 focus:border-cyan-400",
                              )}
                            />
                          </div>
                          {errors["member1.email"] && (
                            <p className="text-[11px] text-rose-400 mt-1">
                              {errors["member1.email"]}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                            Phone Number{" "}
                            <span className="text-rose-400">*</span>
                          </label>
                          <div className="relative flex">
                            <div className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-white/10 bg-white/[0.05] text-xs font-mono text-neutral-400 select-none">
                              +91
                            </div>
                            <div className="relative flex-1">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                              <input
                                type="tel"
                                placeholder="98765 43210"
                                value={formData.member1.phone}
                                onChange={(e) =>
                                  updateMember(
                                    "member1",
                                    "phone",
                                    e.target.value,
                                  )
                                }
                                className={cn(
                                  "w-full pl-9 pr-3.5 py-2.5 rounded-r-xl bg-white/[0.03] border text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 transition-all",
                                  errors["member1.phone"]
                                    ? "border-rose-500/80 focus:ring-rose-400 focus:border-rose-400"
                                    : "border-white/10 hover:border-white/20 focus:ring-cyan-400 focus:border-cyan-400",
                                )}
                              />
                            </div>
                          </div>
                          {errors["member1.phone"] && (
                            <p className="text-[11px] text-rose-400 mt-1">
                              {errors["member1.phone"]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* MEMBER 2 (TEAMMATE) */}
                  <div className="pt-4 border-t border-white/[0.08]">
                    <div className="flex items-center justify-between mb-4 border-b border-white/[0.06] pb-2.5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                          Teammate
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Name */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                            First Name <span className="text-rose-400">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Jordan"
                            value={formData.member2.firstName}
                            onChange={(e) =>
                              updateMember(
                                "member2",
                                "firstName",
                                e.target.value,
                              )
                            }
                            className={cn(
                              "w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 transition-all",
                              errors["member2.firstName"]
                                ? "border-rose-500/80 focus:ring-rose-400 focus:border-rose-400"
                                : "border-white/10 hover:border-white/20 focus:ring-cyan-400 focus:border-cyan-400",
                            )}
                          />
                          {errors["member2.firstName"] && (
                            <p className="text-[11px] text-rose-400 mt-1">
                              {errors["member2.firstName"]}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                            Last Name <span className="text-rose-400">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Lee"
                            value={formData.member2.lastName}
                            onChange={(e) =>
                              updateMember(
                                "member2",
                                "lastName",
                                e.target.value,
                              )
                            }
                            className={cn(
                              "w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 transition-all",
                              errors["member2.lastName"]
                                ? "border-rose-500/80 focus:ring-rose-400 focus:border-rose-400"
                                : "border-white/10 hover:border-white/20 focus:ring-cyan-400 focus:border-cyan-400",
                            )}
                          />
                          {errors["member2.lastName"] && (
                            <p className="text-[11px] text-rose-400 mt-1">
                              {errors["member2.lastName"]}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                          Gender <span className="text-rose-400">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {GENDER_OPTIONS.map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() =>
                                updateMember("member2", "gender", opt)
                              }
                              className={cn(
                                "px-2.5 sm:px-3 py-2 rounded-xl text-[11px] sm:text-xs font-medium border text-center transition-all cursor-pointer truncate",
                                formData.member2.gender === opt
                                  ? "bg-white text-black border-white font-semibold shadow-[0_2px_12px_rgba(255,255,255,0.2)]"
                                  : "bg-white/[0.03] border-white/10 text-neutral-400 hover:text-white hover:border-white/20",
                              )}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                        {errors["member2.gender"] && (
                          <p className="text-[11px] text-rose-400 mt-1">
                            {errors["member2.gender"]}
                          </p>
                        )}
                      </div>

                      {/* Email & Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center justify-between">
                            <span>
                              Email <span className="text-rose-400">*</span>
                            </span>
                            <span className="text-[10px] text-neutral-500">
                              Event confirmation
                            </span>
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                            <input
                              type="email"
                              placeholder="member2@example.com"
                              value={formData.member2.email}
                              onChange={(e) =>
                                updateMember("member2", "email", e.target.value)
                              }
                              className={cn(
                                "w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/[0.03] border text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 transition-all",
                                errors["member2.email"]
                                  ? "border-rose-500/80 focus:ring-rose-400 focus:border-rose-400"
                                  : "border-white/10 hover:border-white/20 focus:ring-cyan-400 focus:border-cyan-400",
                              )}
                            />
                          </div>
                          {errors["member2.email"] && (
                            <p className="text-[11px] text-rose-400 mt-1">
                              {errors["member2.email"]}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                            Phone Number{" "}
                            <span className="text-rose-400">*</span>
                          </label>
                          <div className="relative flex">
                            <div className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-white/10 bg-white/[0.05] text-xs font-mono text-neutral-400 select-none">
                              +91
                            </div>
                            <div className="relative flex-1">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                              <input
                                type="tel"
                                placeholder="98765 43210"
                                value={formData.member2.phone}
                                onChange={(e) =>
                                  updateMember(
                                    "member2",
                                    "phone",
                                    e.target.value,
                                  )
                                }
                                className={cn(
                                  "w-full pl-9 pr-3.5 py-2.5 rounded-r-xl bg-white/[0.03] border text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 transition-all",
                                  errors["member2.phone"]
                                    ? "border-rose-500/80 focus:ring-rose-400 focus:border-rose-400"
                                    : "border-white/10 hover:border-white/20 focus:ring-cyan-400 focus:border-cyan-400",
                                )}
                              />
                            </div>
                          </div>
                          {errors["member2.phone"] && (
                            <p className="text-[11px] text-rose-400 mt-1">
                              {errors["member2.phone"]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Continue CTA */}
                <div className="mt-8 pt-5 sm:pt-6 border-t border-white/[0.07] flex items-center justify-end">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 sm:py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs sm:text-sm transition-all duration-200 shadow-[0_4px_16px_rgba(255,255,255,0.15)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.25)] active:scale-98 cursor-pointer"
                  >
                    <span>Continue to Academic Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: COLLEGE DETAILS (BOTH MEMBERS) */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={motionTransitions.springGentle}
              className="max-w-2xl mx-auto space-y-6"
            >
              <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D14]/90 backdrop-blur-xl p-4 sm:p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                {/* Header */}
                <div className="mb-5 sm:mb-8 border-b border-white/[0.07] pb-4 sm:pb-5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                      <School className="w-5 h-5 text-cyan-400 shrink-0" />
                      <span>Academic & College Details</span>
                    </h2>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/5 text-neutral-300 border border-white/10">
                      Team: {formData.teamName || "2 Members"}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                    Enter academic credentials and college information for both
                    teammates.
                  </p>
                </div>

                <div className="space-y-6 sm:space-y-8">
                  {/* MEMBER 1 (LEADER) COLLEGE */}
                  <div>
                    <div className="flex items-center gap-2 mb-4 border-b border-white/[0.06] pb-2.5">
                      <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                        Team Leader:{" "}
                        <span className="text-cyan-300">
                          {formData.member1.firstName || "Leader"}
                        </span>
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {/* College Name */}
                      <div className="relative">
                        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                          College / Institution Name{" "}
                          <span className="text-rose-400">*</span>
                        </label>
                        <div className="relative">
                          <School className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                          <input
                            type="text"
                            placeholder="Type to search or enter college name..."
                            value={formData.member1.collegeName}
                            onChange={(e) =>
                              handleCollegeInputChange(
                                "member1",
                                e.target.value,
                              )
                            }
                            onFocus={() => {
                              if (collegeSuggestions.length > 0)
                                setActiveCollegeTarget("member1");
                            }}
                            className={cn(
                              "w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/[0.03] border text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 transition-all",
                              errors["member1.collegeName"]
                                ? "border-rose-500/80 focus:ring-rose-400 focus:border-rose-400"
                                : "border-white/10 hover:border-white/20 focus:ring-cyan-400 focus:border-cyan-400",
                            )}
                          />
                        </div>
                        {errors["member1.collegeName"] && (
                          <p className="text-[11px] text-rose-400 mt-1">
                            {errors["member1.collegeName"]}
                          </p>
                        )}

                        {/* Suggestions Dropdown for Member 1 */}
                        {activeCollegeTarget === "member1" &&
                          collegeSuggestions.length > 0 && (
                            <div className="absolute z-30 left-0 right-0 mt-1 bg-[#10141f] border border-white/15 rounded-xl shadow-2xl overflow-hidden max-h-52 overflow-y-auto">
                              {collegeSuggestions.map((col, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    updateMember("member1", "collegeName", col);
                                    setActiveCollegeTarget(null);
                                  }}
                                  className="w-full text-left px-3.5 py-2.5 text-xs text-neutral-300 hover:text-white hover:bg-white/10 border-b border-white/[0.04] last:border-none transition-colors"
                                >
                                  {col}
                                </button>
                              ))}
                            </div>
                          )}
                      </div>

                      {/* Year & Branch */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                            Year of Study{" "}
                            <span className="text-rose-400">*</span>
                          </label>
                          <div className="grid grid-cols-3 gap-1.5">
                            {YEAR_OPTIONS.map((yr) => (
                              <button
                                key={yr}
                                type="button"
                                onClick={() =>
                                  updateMember("member1", "yearOfStudy", yr)
                                }
                                className={cn(
                                  "px-2 py-2 rounded-xl text-[11px] font-medium border text-center transition-all cursor-pointer truncate",
                                  formData.member1.yearOfStudy === yr
                                    ? "bg-white text-black border-white font-semibold shadow-[0_2px_12px_rgba(255,255,255,0.2)]"
                                    : "bg-white/[0.03] border-white/10 text-neutral-400 hover:text-white hover:border-white/20",
                                )}
                              >
                                {yr}
                              </button>
                            ))}
                          </div>
                          {errors["member1.yearOfStudy"] && (
                            <p className="text-[11px] text-rose-400 mt-1">
                              {errors["member1.yearOfStudy"]}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                            Branch / Department{" "}
                            <span className="text-rose-400">*</span>
                          </label>
                          <div className="relative">
                            <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                            <input
                              type="text"
                              placeholder="e.g. Computer Science, Design"
                              value={formData.member1.department}
                              onChange={(e) =>
                                updateMember(
                                  "member1",
                                  "department",
                                  e.target.value,
                                )
                              }
                              className={cn(
                                "w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/[0.03] border text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 transition-all",
                                errors["member1.department"]
                                  ? "border-rose-500/80 focus:ring-rose-400 focus:border-rose-400"
                                  : "border-white/10 hover:border-white/20 focus:ring-cyan-400 focus:border-cyan-400",
                              )}
                            />
                          </div>
                          {errors["member1.department"] && (
                            <p className="text-[11px] text-rose-400 mt-1">
                              {errors["member1.department"]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* MEMBER 2 COLLEGE */}
                  <div className="pt-4 border-t border-white/[0.08]">
                    <div className="flex items-center gap-2 mb-4 border-b border-white/[0.06] pb-2.5">
                      <UserCheck className="w-4 h-4 text-sky-400" />
                      <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                        Member 2:{" "}
                        <span className="text-sky-300">
                          {formData.member2.firstName || "Teammate"}
                        </span>
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {/* College Name */}
                      <div className="relative">
                        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center justify-between">
                          <span>
                            College / Institution Name{" "}
                            <span className="text-rose-400">*</span>
                          </span>
                        </label>
                        <div className="relative">
                          <School className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                          <input
                            type="text"
                            placeholder="Type to search or enter college name..."
                            value={formData.member2.collegeName}
                            onChange={(e) =>
                              handleCollegeInputChange(
                                "member2",
                                e.target.value,
                              )
                            }
                            onFocus={() => {
                              if (collegeSuggestions.length > 0)
                                setActiveCollegeTarget("member2");
                            }}
                            className={cn(
                              "w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/[0.03] border text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 transition-all",
                              errors["member2.collegeName"]
                                ? "border-rose-500/80 focus:ring-rose-400 focus:border-rose-400"
                                : "border-white/10 hover:border-white/20 focus:ring-cyan-400 focus:border-cyan-400",
                            )}
                          />
                        </div>
                        {errors["member2.collegeName"] && (
                          <p className="text-[11px] text-rose-400 mt-1">
                            {errors["member2.collegeName"]}
                          </p>
                        )}

                        {/* Suggestions Dropdown for Member 2 */}
                        {activeCollegeTarget === "member2" &&
                          collegeSuggestions.length > 0 && (
                            <div className="absolute z-30 left-0 right-0 mt-1 bg-[#10141f] border border-white/15 rounded-xl shadow-2xl overflow-hidden max-h-52 overflow-y-auto">
                              {collegeSuggestions.map((col, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    updateMember("member2", "collegeName", col);
                                    setActiveCollegeTarget(null);
                                  }}
                                  className="w-full text-left px-3.5 py-2.5 text-xs text-neutral-300 hover:text-white hover:bg-white/10 border-b border-white/[0.04] last:border-none transition-colors"
                                >
                                  {col}
                                </button>
                              ))}
                            </div>
                          )}
                      </div>

                      {/* Year & Branch */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                            Year of Study{" "}
                            <span className="text-rose-400">*</span>
                          </label>
                          <div className="grid grid-cols-3 gap-1.5">
                            {YEAR_OPTIONS.map((yr) => (
                              <button
                                key={yr}
                                type="button"
                                onClick={() =>
                                  updateMember("member2", "yearOfStudy", yr)
                                }
                                className={cn(
                                  "px-2 py-2 rounded-xl text-[11px] font-medium border text-center transition-all cursor-pointer truncate",
                                  formData.member2.yearOfStudy === yr
                                    ? "bg-white text-black border-white font-semibold shadow-[0_2px_12px_rgba(255,255,255,0.2)]"
                                    : "bg-white/[0.03] border-white/10 text-neutral-400 hover:text-white hover:border-white/20",
                                )}
                              >
                                {yr}
                              </button>
                            ))}
                          </div>
                          {errors["member2.yearOfStudy"] && (
                            <p className="text-[11px] text-rose-400 mt-1">
                              {errors["member2.yearOfStudy"]}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                            Branch / Department{" "}
                            <span className="text-rose-400">*</span>
                          </label>
                          <div className="relative">
                            <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                            <input
                              type="text"
                              placeholder="e.g. Electronics, Mech, CS"
                              value={formData.member2.department}
                              onChange={(e) =>
                                updateMember(
                                  "member2",
                                  "department",
                                  e.target.value,
                                )
                              }
                              className={cn(
                                "w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/[0.03] border text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 transition-all",
                                errors["member2.department"]
                                  ? "border-rose-500/80 focus:ring-rose-400 focus:border-rose-400"
                                  : "border-white/10 hover:border-white/20 focus:ring-cyan-400 focus:border-cyan-400",
                              )}
                            />
                          </div>
                          {errors["member2.department"] && (
                            <p className="text-[11px] text-rose-400 mt-1">
                              {errors["member2.department"]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation CTA Buttons */}
                <div className="mt-8 pt-5 sm:pt-6 border-t border-white/[0.07] flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white font-medium text-xs sm:text-sm transition-colors cursor-pointer shrink-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs sm:text-sm transition-all duration-200 shadow-[0_4px_16px_rgba(255,255,255,0.15)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.25)] active:scale-98 cursor-pointer"
                  >
                    <span>Proceed to Review</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: REVIEW & SUMMARY (TEAM & 2 MEMBERS) */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={motionTransitions.springGentle}
              className="w-full"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 items-start">
                {/* Left Area (2 cols): Team & Member Review Cards */}
                <div className="lg:col-span-2 space-y-3.5 sm:space-y-4">
                  {/* Team Identity Banner */}
                  <div className="rounded-2xl border border-cyan-500/25 bg-gradient-to-r from-[#0c192c] to-[#0A0D14] p-4 sm:p-5 backdrop-blur-md flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                          Team Name
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                          {formData.teamName || "D'VINE 2.0 Team"}
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-neutral-300 hover:text-white transition-colors"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>

                  {/* Card 1: Member 1 (Team Leader) */}
                  <div className="rounded-2xl border border-white/[0.08] bg-[#0E1118]/95 p-4 sm:p-6 backdrop-blur-md transition-all">
                    <div className="flex items-center justify-between mb-3.5 sm:mb-4 border-b border-white/[0.06] pb-3">
                      <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight flex items-center gap-2">
                        <Crown className="w-4 h-4 text-cyan-400" />
                        <span>Team Leader</span>
                      </h4>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-white/[0.05] hover:bg-white/10 border border-white/10 text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer shrink-0"
                      >
                        <Pencil className="w-3 h-3 text-neutral-400" />
                        <span>Edit</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-2.5 sm:gap-y-4 text-xs sm:text-sm">
                      <div className="text-[11px] sm:text-xs text-neutral-400">
                        Full Name
                      </div>
                      <div className="sm:col-span-2 font-medium text-white break-words">
                        {formData.member1.firstName} {formData.member1.lastName}
                      </div>

                      <div className="text-[11px] sm:text-xs text-neutral-400">
                        Gender
                      </div>
                      <div className="sm:col-span-2 font-medium text-white">
                        {formData.member1.gender}
                      </div>

                      <div className="text-[11px] sm:text-xs text-neutral-400">
                        Email Address
                      </div>
                      <div className="sm:col-span-2 font-mono text-cyan-300 break-all">
                        {formData.member1.email}
                      </div>

                      <div className="text-[11px] sm:text-xs text-neutral-400">
                        Phone Number
                      </div>
                      <div className="sm:col-span-2 font-mono text-white">
                        +91 {formData.member1.phone}
                      </div>

                      <div className="text-[11px] sm:text-xs text-neutral-400">
                        Institution
                      </div>
                      <div className="sm:col-span-2 font-medium text-white break-words">
                        {formData.member1.collegeName}
                      </div>

                      <div className="text-[11px] sm:text-xs text-neutral-400">
                        Year & Dept
                      </div>
                      <div className="sm:col-span-2 font-medium text-white break-words">
                        {formData.member1.yearOfStudy} •{" "}
                        {formData.member1.department}
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Member 2 (Teammate) */}
                  <div className="rounded-2xl border border-white/[0.08] bg-[#0E1118]/95 p-4 sm:p-6 backdrop-blur-md transition-all">
                    <div className="flex items-center justify-between mb-3.5 sm:mb-4 border-b border-white/[0.06] pb-3">
                      <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-sky-400" />
                        <span>Teammate</span>
                      </h4>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-white/[0.05] hover:bg-white/10 border border-white/10 text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer shrink-0"
                      >
                        <Pencil className="w-3 h-3 text-neutral-400" />
                        <span>Edit</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-2.5 sm:gap-y-4 text-xs sm:text-sm">
                      <div className="text-[11px] sm:text-xs text-neutral-400">
                        Full Name
                      </div>
                      <div className="sm:col-span-2 font-medium text-white break-words">
                        {formData.member2.firstName} {formData.member2.lastName}
                      </div>

                      <div className="text-[11px] sm:text-xs text-neutral-400">
                        Gender
                      </div>
                      <div className="sm:col-span-2 font-medium text-white">
                        {formData.member2.gender}
                      </div>

                      <div className="text-[11px] sm:text-xs text-neutral-400">
                        Email Address
                      </div>
                      <div className="sm:col-span-2 font-mono text-cyan-300 break-all">
                        {formData.member2.email}
                      </div>

                      <div className="text-[11px] sm:text-xs text-neutral-400">
                        Phone Number
                      </div>
                      <div className="sm:col-span-2 font-mono text-white">
                        +91 {formData.member2.phone}
                      </div>

                      <div className="text-[11px] sm:text-xs text-neutral-400">
                        Institution
                      </div>
                      <div className="sm:col-span-2 font-medium text-white break-words">
                        {formData.member2.collegeName}
                      </div>

                      <div className="text-[11px] sm:text-xs text-neutral-400">
                        Year & Dept
                      </div>
                      <div className="sm:col-span-2 font-medium text-white break-words">
                        {formData.member2.yearOfStudy} •{" "}
                        {formData.member2.department}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Area (1 col): Summary / Checkout Card */}
                <div className="lg:col-span-1 space-y-4 lg:sticky lg:top-24">
                  <div className="rounded-2xl border border-white/[0.08] bg-[#0E1118]/95 p-4 sm:p-6 backdrop-blur-md shadow-2xl">
                    <div className="mb-4">
                      <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">
                        Registration Fee
                      </h3>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        ₹349 per head (2 members).
                      </p>
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-2.5 py-3 border-y border-white/[0.07] text-xs">
                      <div className="flex items-center justify-between text-neutral-300">
                        <span>Team Leader</span>
                        <span className="font-mono text-neutral-200">
                          ₹349.00
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-neutral-300">
                        <span>Teammate</span>
                        <span className="font-mono text-neutral-200">
                          ₹349.00
                        </span>
                      </div>

                      {/* Total */}
                      <div className="pt-3 border-t border-white/[0.07] flex items-baseline justify-between">
                        <span className="font-semibold text-sm text-white">
                          Total Payable
                        </span>
                        <div className="text-right">
                          <span className="text-xl font-bold font-mono text-white">
                            ₹698.00
                          </span>
                          <span className="block text-[10px] text-neutral-500 font-mono">
                            INR (incl. GST)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Consent Checkboxes */}
                    <div className="mt-4 sm:mt-5 space-y-3">
                      <label className="flex items-start gap-2.5 cursor-pointer group select-none">
                        <input
                          type="checkbox"
                          checked={formData.confirmAccuracy}
                          onChange={(e) =>
                            updateField("confirmAccuracy", e.target.checked)
                          }
                          className="mt-0.5 w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-cyan-500 focus:ring-cyan-500 cursor-pointer accent-white shrink-0"
                        />
                        <span className="text-xs text-neutral-300 group-hover:text-white transition-colors leading-relaxed">
                          I confirm that the team and member details entered
                          above are accurate to the best of my knowledge.
                        </span>
                      </label>
                    </div>

                    {errors.terms && (
                      <p className="text-[11px] text-rose-400 mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.terms}</span>
                      </p>
                    )}

                    {/* Slide to Pay Slider */}
                    <div className="mt-5 w-full flex flex-col items-center overflow-hidden">
                      <SlideCommit
                        label="Slide to Pay ₹698"
                        doneLabel="Processing..."
                        errorLabel="Confirm info to slide"
                        height={54}
                        trackColor="#070c18"
                        handleColor="#FFFFFF"
                        successColor="#0284c7"
                        dangerColor="#f43f5e"
                        disabled={!formData.confirmAccuracy}
                        onConfirm={handleSlidePayment}
                        onError={(msg) => {
                          setErrors({
                            terms:
                              typeof msg === "string"
                                ? msg
                                : "Please check the confirmation above",
                          });
                        }}
                        className="w-full shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
                      />
                    </div>

                    {/* Razorpay Gateway Badge Note */}
                    <div className="mt-4 pt-3 border-t border-white/[0.06] text-center">
                      <div className="inline-flex items-center gap-1.5 text-[11px] text-neutral-400 font-mono">
                        <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                        <span>Razorpay Checkout</span>
                      </div>
                      <p className="text-[10px] text-neutral-500 mt-1">
                        Supports UPI (GPay, PhonePe, Paytm), Credit/Debit Cards,
                        & NetBanking.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: PAYMENT STATUS & RECEIPT (TEAM PASS) */}
          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={motionTransitions.springGentle}
              className="max-w-xl mx-auto space-y-6"
            >
              {/* Dev state toggle helper to test user component states easily */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 bg-white/[0.03] border border-white/10 rounded-xl p-3 sm:px-4 sm:py-2 text-xs">
                <span className="text-neutral-400 font-mono text-[11px] shrink-0">
                  Payment Status Preview:
                </span>
                <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                  {(
                    [
                      "success",
                      "processing",
                      "verifying",
                      "failed",
                    ] as PaymentLifecycleStatus[]
                  ).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setPaymentStatus(st)}
                      className={cn(
                        "flex-1 sm:flex-initial px-2.5 py-1 rounded text-[10px] font-mono capitalize transition-all cursor-pointer text-center",
                        paymentStatus === st
                          ? "bg-white text-black font-bold"
                          : "bg-white/5 text-neutral-400 hover:text-white",
                      )}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* The User-Provided PaymentStatus Component */}
              <PaymentStatus
                status={paymentStatus}
                amount="₹698.00"
                currency="₹"
                transactionId={txId}
                date={new Date()}
                paymentMethod="Razorpay (UPI / Card)"
                last4="7890"
                merchantName="D'VINE 2.0 Hackathon"
                whatsappGroupUrl="https://chat.whatsapp.com/invite/dvine2026"
                errorMessage="Payment could not be completed with Razorpay gateway. Please retry or choose a different payment method."
                refundReason="Refund initiated back to your original payment method within 3–5 working days."
                items={[
                  {
                    name: `Leader: ${formData.member1.firstName || "Member 1"} ${formData.member1.lastName}`,
                    quantity: 1,
                    price: "₹349.00",
                  },
                  {
                    name: `Teammate: ${formData.member2.firstName || "Member 2"} ${formData.member2.lastName}`,
                    quantity: 1,
                    price: "₹349.00",
                  },
                ]}
                onRetry={retryPayment}
                onChangePaymentMethod={() => setCurrentStep(3)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
