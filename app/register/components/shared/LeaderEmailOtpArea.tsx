"use client";

import React, { useEffect, useRef, useState } from "react";
import { Check, RefreshCw } from "lucide-react";
import { cn } from "../../../lib/utils";
import { OtpState } from "../../types";
import styles from "../../register.module.css";

/** Backend keeps an OTP-verified email valid for 5 minutes. */
export const VERIFIED_WINDOW_SECONDS = 5 * 60;

export interface LeaderEmailOtpAreaProps {
  email: string;
  isSolo?: boolean;
  isVerified: boolean;
  otpState: OtpState;
  onSendOtp: (email: string) => Promise<boolean>;
  onVerifyOtp: (email: string, code: string) => Promise<boolean>;
  onEditEmail?: () => void;
  /** Called when the 5-minute verified window ends so the caller can re-check. */
  onExpire?: () => void;
  className?: string;
}

export const LeaderEmailOtpArea: React.FC<LeaderEmailOtpAreaProps> = ({
  email,
  isSolo = false,
  isVerified,
  otpState,
  onSendOtp,
  onVerifyOtp,
  onExpire,
  className,
}) => {
  const [code, setCode] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);
  const expiredRef = useRef(false);
  const verifiedAt = otpState.verifiedAt;

  useEffect(() => {
    if (!isVerified || !verifiedAt) {
      setRemaining(null);
      return;
    }
    expiredRef.current = false;
    const tick = () => {
      const left = Math.max(
        0,
        VERIFIED_WINDOW_SECONDS - Math.floor((Date.now() - verifiedAt) / 1000),
      );
      setRemaining(left);
      if (left === 0 && !expiredRef.current) {
        expiredRef.current = true;
        onExpire?.();
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVerified, verifiedAt]);

  // Clear the typed code once a new OTP flow starts
  useEffect(() => {
    if (!otpState.otpSent) setCode("");
  }, [otpState.otpSent]);

  const handleVerify = () => {
    if (code.trim().length === 6) {
      onVerifyOtp(email, code.trim());
    }
  };

  const handleCodeChange = (val: string) => {
    const cleaned = val.replace(/[^0-9]/g, "").slice(0, 6);
    setCode(cleaned);
    if (cleaned.length === 6) {
      onVerifyOtp(email, cleaned);
    }
  };

  if (isVerified) {
    return (
      <div className={cn(styles.verification, styles.verified, className)} role="status">
        <span><Check size={14} aria-hidden="true" /> Email verified</span>
        {remaining !== null && <span>{Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")}</span>}
      </div>
    );
  }

  return (
    <div className={cn(styles.verification, className)}>
      <div className={styles.verificationHeader}>{isSolo ? "Verify your email" : "Verify your leader's email"}</div>
      <p className={styles.verificationEmail}>{email}</p>
      {!otpState.otpSent ? (
        <button type="button" onClick={() => onSendOtp(email)} disabled={otpState.isSending} className={styles.primaryButton}>
          {otpState.isSending && <RefreshCw size={12} className={styles.spinner} aria-hidden="true" />}
          {otpState.isSending ? "Sending code…" : "Send verification code"}
        </button>
      ) : (
        <>
          <label htmlFor="leader-otp" className={styles.fieldLabel}>Verification code</label>
          <div className={styles.otpRow}>
            <input id="leader-otp" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="000000"
              value={code} onChange={(e) => handleCodeChange(e.target.value)} className={styles.input}
              aria-invalid={Boolean(otpState.error)} aria-describedby={otpState.error ? "otp-error" : "otp-hint"} />
            <button type="button" onClick={handleVerify} disabled={code.length !== 6 || otpState.isVerifying} className={styles.primaryButton}>
              {otpState.isVerifying ? <RefreshCw size={13} className={styles.spinner} aria-label="Verifying" /> : "Verify"}
            </button>
          </div>
          <div className={styles.otpHelp}>
            <span id="otp-hint">Enter the 6-digit code</span>
            <button type="button" disabled={Boolean(otpState.cooldownSeconds && otpState.cooldownSeconds > 0) || otpState.isSending}
              onClick={() => onSendOtp(email)}>
              {otpState.cooldownSeconds && otpState.cooldownSeconds > 0 ? `Resend in ${otpState.cooldownSeconds}s` : "Resend code"}
            </button>
          </div>
        </>
      )}
      {otpState.error && <p id="otp-error" className={styles.error} role="alert">{otpState.error}</p>}
    </div>
  );
};
