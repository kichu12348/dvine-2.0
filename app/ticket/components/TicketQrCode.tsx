"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import styles from "../ticket.module.css";

interface TicketQrCodeProps {
  value: string;
  size?: number;
  className?: string;
  onReady?: (value: string) => void;
}

export function TicketQrCode({
  value,
  size = 188,
  className = "",
  onReady,
}: TicketQrCodeProps) {
  const [result, setResult] = useState<{
    value: string;
    size: number;
    url?: string;
    error?: boolean;
  } | null>(null);
  const current =
    result?.value === value && result.size === size ? result : null;

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(value, {
      width: Math.max(size * 3, 480),
      margin: 4,
      errorCorrectionLevel: "M",
      color: { dark: "#071827", light: "#FFFFFF" },
    }).then(
      (url) => {
        if (active) {
          setResult({ value, size, url });
          onReady?.(value);
        }
      },
      () => {
        if (active) setResult({ value, size, error: true });
      },
    );
    return () => {
      active = false;
    };
  }, [value, size, onReady]);

  return (
    <div
      className={[styles.qrFrame, className].filter(Boolean).join(" ")}
      style={{ width: size }}
    >
      {current?.url ? (
        // Data URLs are generated locally for the ticket download.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={current.url}
          alt="Your ticket QR code for event check-in"
          width={size}
          height={size}
          className={styles.qrImage}
          draggable={false}
        />
      ) : (
        <div className={styles.qrPlaceholder} role="status">
          {current?.error
            ? "Unable to generate QR code. Please refresh."
            : "Preparing your QR code…"}
        </div>
      )}
    </div>
  );
}
