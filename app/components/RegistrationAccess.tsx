"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, LockKeyhole, X } from "lucide-react";
import { REGISTRATION_IS_OPEN, REGISTRATION_NOTICE } from "../lib/event-config";
import styles from "./RegistrationAccess.module.css";

const RegistrationNoticeContext = createContext<(() => void) | null>(null);

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setVisible(false);
  }, []);

  const notify = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(true);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setVisible(false);
    }, 6000);
  }, []);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return (
    <RegistrationNoticeContext.Provider value={notify}>
      {children}
      {!REGISTRATION_IS_OPEN && <span id="registration-availability" className="sr-only">{REGISTRATION_NOTICE.message}</span>}
      <div role="status" aria-live="polite" aria-atomic="true" className={styles.toastRegion}>
        {visible && (
          <div className={styles.toast}>
            <LockKeyhole size={19} className={styles.toastIcon} aria-hidden="true" />
            <div><p className={styles.toastTitle}>{REGISTRATION_NOTICE.title}</p><p className={styles.toastMessage}>{REGISTRATION_NOTICE.message}</p></div>
            <button type="button" onClick={dismiss} className={styles.dismiss} aria-label="Dismiss notification"><X size={16} aria-hidden="true" /></button>
          </div>
        )}
      </div>
    </RegistrationNoticeContext.Provider>
  );
}

interface RegistrationButtonProps {
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

export function RegistrationButton({ children, className, target, rel }: RegistrationButtonProps) {
  const notify = useContext(RegistrationNoticeContext);

  if (REGISTRATION_IS_OPEN) {
    return <Link href="/register" className={className} target={target} rel={rel}>{children}</Link>;
  }

  return (
    <button type="button" onClick={() => notify?.()} className={[styles.trigger, className].filter(Boolean).join(" ")}
      title="Registration hasn’t opened yet" aria-describedby="registration-availability" data-registration-locked="true">
      {children}
    </button>
  );
}

export function RegistrationIcon({ size = 18, strokeWidth = 1.8, className }: { size?: number; strokeWidth?: number; className?: string }) {
  const Icon = REGISTRATION_IS_OPEN ? ArrowUpRight : LockKeyhole;
  return <Icon size={size} strokeWidth={strokeWidth} className={className} aria-hidden="true" />;
}

export function RegistrationClosed() {
  return (
    <main className={styles.closedPage}>
      <div className={styles.closedPanel}>
        <Link href="/" aria-label="D'VINE home"><Image src="/dvine.svg" alt="D'VINE 2.0" width={831} height={322} className={styles.logo} /></Link>
        <span className={styles.closedIcon}><LockKeyhole size={24} aria-hidden="true" /></span>
        <h1>{REGISTRATION_NOTICE.title}.</h1>
        <p>{REGISTRATION_NOTICE.message}</p>
        <Link href="/" className={styles.backLink}><ArrowLeft size={16} aria-hidden="true" /> Back to event</Link>
      </div>
    </main>
  );
}
