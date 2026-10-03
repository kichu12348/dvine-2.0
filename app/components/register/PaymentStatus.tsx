"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  AlertCircle,
  RotateCcw,
  Copy,
  Download,
  Receipt,
  CreditCard,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { cn, copyToClipboard } from "../../lib/utils";
import { motionTransitions } from "../../lib/motion-tokens";

export type PaymentLifecycleStatus =
  | "processing"
  | "verifying"
  | "success"
  | "failed"
  | "refunded";

export interface PaymentReceiptItem {
  name: string;
  quantity?: number;
  price: string | number;
}

export interface PaymentStatusProps {
  /** Current payment status */
  status?: PaymentLifecycleStatus;
  /** Formatted payment amount (e.g. "$128.00" or 128) */
  amount?: string | number;
  /** Currency code or symbol */
  currency?: string;
  /** Unique transaction reference ID */
  transactionId?: string;
  /** Transaction date */
  date?: string | Date;
  /** Payment method label */
  paymentMethod?: string;
  /** Card or account last 4 digits */
  last4?: string;
  /** Custom error message when status is 'failed' */
  errorMessage?: string;
  /** Refund reason or note when status is 'refunded' */
  refundReason?: string;
  /** Itemized summary items for receipt view */
  items?: PaymentReceiptItem[];
  /** Merchant or product title */
  merchantName?: string;
  /** URL for official WhatsApp group */
  whatsappGroupUrl?: string;
  /** Retry payment handler */
  onRetry?: () => void;
  /** Change payment method handler */
  onChangePaymentMethod?: () => void;
  /** Custom handler when downloading receipt */
  onDownloadReceipt?: () => void;
  /** Custom handler when viewing receipt */
  onViewReceipt?: () => void;
  /** Custom class name */
  className?: string;
}

export const PaymentStatus: React.FC<PaymentStatusProps> = ({
  status = "processing",
  amount = "₹698.00",
  currency = "₹",
  transactionId = "tx_9842a8d11c7f",
  date = "Today at 3:42 PM",
  paymentMethod = "UPI / Card",
  last4 = "4242",
  errorMessage = "Payment couldn't be completed. Your card issuer declined the request.",
  refundReason = "Refunded to original payment method within 3–5 business days.",
  items = [
    { name: "Leader Registration", quantity: 1, price: "₹349.00" },
    { name: "Teammate Registration", quantity: 1, price: "₹349.00" },
  ],
  merchantName = "D'VINE 2.0 Hackathon",
  whatsappGroupUrl = "https://chat.whatsapp.com/invite/dvine2026",
  onRetry,
  onChangePaymentMethod,
  onDownloadReceipt,
  onViewReceipt,
  className,
}) => {
  const [copied, setCopied] = useState(false);
  const [showReceiptDetails, setShowReceiptDetails] = useState(false);

  const formattedAmount =
    typeof amount === "number"
      ? `${currency}${amount.toFixed(2)}`
      : typeof amount === "string" && amount.startsWith(currency)
        ? amount
        : `${currency}${amount}`;

  const formattedDate =
    date instanceof Date
      ? date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : date;

  const handleCopyId = () => {
    copyToClipboard(transactionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (onDownloadReceipt) {
      onDownloadReceipt();
    } else {
      const receiptText = `RECEIPT - ${merchantName}
Transaction ID: ${transactionId}
Date: ${formattedDate}
Payment Method: ${paymentMethod} (•••• ${last4})
Amount: ${formattedAmount}
Status: ${status.toUpperCase()}
Items:
${items.map((i) => `- ${i.name} (${i.quantity || 1}x): ${i.price}`).join("\n")}
`;
      const blob = new Blob([receiptText], {
        type: "text/plain;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${transactionId}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div
      className={cn(
        "w-full max-w-md mx-auto rounded-2xl border border-[#1F1F1F] bg-[#0E0E0E] p-4 sm:p-6 md:p-7 text-left font-sans shadow-[0_12px_30px_-10px_rgba(0,0,0,0.6)] transition-all select-none overflow-hidden",
        className,
      )}
    >
      <div className="flex flex-col items-center text-center">
        {/* Status Indicator Badge */}
        <div className="relative mb-5">
          {status === "processing" && (
            <div className="w-14 h-14 rounded-full bg-[#141414] border border-[#1F1F1F] flex items-center justify-center relative">
              <motion.div
                className="absolute inset-0 rounded-full border border-white/30 border-t-white"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              />
              <CreditCard className="w-5 h-5 text-[#525252]" />
            </div>
          )}

          {status === "verifying" && (
            <div className="w-14 h-14 rounded-full bg-[#141414] border border-[#1F1F1F] flex items-center justify-center relative">
              <motion.div
                className="absolute inset-1 rounded-full border border-sky-400/40 border-t-sky-400"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <ShieldCheck className="w-6 h-6 text-sky-400" />
            </div>
          )}

          {status === "success" && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={motionTransitions.springSnappy}
              className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 relative"
            >
              <svg
                className="w-7 h-7"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <motion.path
                  d="M20 6L9 17l-5-5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
                />
              </svg>
            </motion.div>
          )}

          {status === "failed" && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={motionTransitions.springSnappy}
              className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400"
            >
              <AlertCircle className="w-7 h-7" />
            </motion.div>
          )}

          {status === "refunded" && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={motionTransitions.springSnappy}
              className="w-14 h-14 rounded-full bg-[#141414] border border-[#1F1F1F] flex items-center justify-center text-[#525252]"
            >
              <RotateCcw className="w-6 h-6" />
            </motion.div>
          )}
        </div>

        {/* Heading and Subtext */}
        <h3 className="text-lg sm:text-xl font-semibold text-[#FAFAFA] tracking-tight">
          {status === "processing" && "Processing Payment"}
          {status === "verifying" && "Verifying Transaction"}
          {status === "success" && "Payment Verified & Confirmed"}
          {status === "failed" && "Payment Couldn't Be Completed"}
          {status === "refunded" && "Payment Refunded"}
        </h3>

        <p className="text-xs sm:text-sm text-[#A1A1A1] mt-1 max-w-xs">
          {status === "processing" &&
            "Securely communicating with payment provider..."}
          {status === "verifying" &&
            "Confirming token authorization and anti-fraud checks..."}
          {status === "success" &&
            `Your team registration for ${merchantName} is confirmed.`}
          {status === "failed" && errorMessage}
          {status === "refunded" && refundReason}
        </p>

        {/* Amount Pill */}
        <div className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#141414] border border-[#1F1F1F]">
          <span className="text-[11px] font-mono text-[#6B6B6B]">Total</span>
          <span className="text-sm font-semibold font-mono text-[#FAFAFA]">
            {formattedAmount}
          </span>
        </div>
      </div>

      {/* Transaction Details Staggered Card */}
      <AnimatePresence mode="wait">
        {(status === "success" || status === "refunded") && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={motionTransitions.springGentle}
            className="mt-6 pt-5 border-t border-[#1F1F1F] space-y-2.5 text-xs"
          >
            <div className="flex items-center justify-between py-1">
              <span className="text-[#A1A1A1]">Transaction ID</span>
              <button
                type="button"
                onClick={handleCopyId}
                className="inline-flex items-center gap-1 font-mono text-[#A1A1A1] hover:text-[#FAFAFA] transition-colors focus-ring px-1.5 py-0.5 rounded bg-[#141414] border border-[#1F1F1F] cursor-pointer"
                title="Copy Transaction ID"
              >
                <span>{transactionId.slice(0, 14)}...</span>
                {copied ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3 text-[#6B6B6B]" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-[#A1A1A1]">Date & Time</span>
              <span className="font-mono text-[#FAFAFA]">{formattedDate}</span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-[#A1A1A1]">Payment Method</span>
              <span className="text-[#FAFAFA] flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#525252]" />
                {paymentMethod} {last4 ? `(•••• ${last4})` : ""}
              </span>
            </div>

            {/* Join WhatsApp Group Card upon Verified Payment */}
            {status === "success" && whatsappGroupUrl && (
              <div className="pt-2">
                <a
                  href={whatsappGroupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-between gap-3 w-full p-3 rounded-xl bg-gradient-to-r from-emerald-500/15 via-[#25D366]/15 to-teal-500/10 hover:from-emerald-500/25 hover:via-[#25D366]/25 hover:to-teal-500/20 border border-[#25D366]/40 hover:border-[#25D366]/70 transition-all duration-200 cursor-pointer shadow-[0_0_20px_rgba(37,211,102,0.15)] hover:shadow-[0_0_25px_rgba(37,211,102,0.25)]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#25D366] text-black shrink-0 shadow-[0_2px_10px_rgba(37,211,102,0.4)] group-hover:scale-105 transition-transform">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7.02 8.48 7.02 9.68C7.02 10.88 7.89 12.04 8.01 12.2C8.13 12.36 9.71 14.96 12.22 15.93C14.31 16.74 14.73 16.58 15.19 16.54C15.65 16.5 16.67 15.94 16.88 15.35C17.09 14.76 17.09 14.26 17.03 14.16C16.97 14.06 16.81 14 16.57 13.88C16.33 13.76 15.15 13.18 14.93 13.1C14.71 13.02 14.55 12.98 14.39 13.22C14.23 13.46 13.77 14 13.63 14.16C13.49 14.32 13.35 14.34 13.11 14.22C12.87 14.1 11.86 13.77 10.66 12.7C9.73 11.87 9.1 10.84 8.98 10.64C8.86 10.44 8.97 10.33 9.09 10.21C9.2 10.1 9.34 9.92 9.46 9.78C9.58 9.64 9.62 9.54 9.7 9.38C9.78 9.22 9.74 9.08 9.68 8.96C9.62 8.84 9.16 7.71 8.97 7.24C8.78 6.79 8.59 6.85 8.45 6.84C8.32 6.83 8.16 6.83 8.01 6.83L8.53 7.33Z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-semibold text-white truncate flex items-center gap-1.5">
                        <span>Join WhatsApp Group</span>
                      </div>
                      <p className="text-[11px] text-[#A1A1A1] truncate mt-0.5">
                        Team sync, problem statements & live updates
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-white group-hover:border-[#25D366]/50 group-hover:text-[#25D366] transition-colors shrink-0">
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </a>
              </div>
            )}

            {/* Receipt Actions */}
            <div className="pt-4 mt-2 border-t border-[#1F1F1F] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowReceiptDetails(!showReceiptDetails);
                  onViewReceipt?.();
                }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#141414] hover:bg-[#0E0E0E] border border-[#1F1F1F] hover:border-[#4A4A4A] text-xs font-medium text-[#A1A1A1] hover:text-[#FAFAFA] transition-colors focus-ring cursor-pointer"
              >
                <Receipt className="w-3.5 h-3.5 text-[#525252]" />
                <span>
                  {showReceiptDetails ? "Hide Details" : "View Receipt"}
                </span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#141414] hover:bg-[#0E0E0E] border border-[#1F1F1F] hover:border-[#4A4A4A] text-xs font-medium text-[#A1A1A1] hover:text-[#FAFAFA] transition-colors focus-ring cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#525252]" />
                <span>Download</span>
              </button>
            </div>

            {/* Unfolding Receipt Item Breakdown */}
            <AnimatePresence>
              {showReceiptDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={motionTransitions.springGentle}
                  className="overflow-hidden pt-2 space-y-1.5 bg-[#050505] p-3 rounded-lg border border-[#1F1F1F]"
                >
                  <p className="text-[10px] font-mono uppercase text-[#6B6B6B] tracking-wider mb-1">
                    Itemized Breakdown
                  </p>
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs text-[#A1A1A1]"
                    >
                      <span>
                        {item.quantity ? `${item.quantity}x ` : ""}
                        {item.name}
                      </span>
                      <span className="font-mono text-[#FAFAFA]">
                        {item.price}
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 mt-1 border-t border-[#1F1F1F] flex justify-between font-medium text-xs text-[#FAFAFA]">
                    <span>Total Paid</span>
                    <span className="font-mono">{formattedAmount}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {status === "failed" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={motionTransitions.springGentle}
            className="mt-6 pt-5 border-t border-[#1F1F1F] space-y-2"
          >
            <button
              type="button"
              onClick={onRetry}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#FAFAFA] hover:bg-white text-[#050505] font-medium text-xs sm:text-sm transition-all focus-ring shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>

            <button
              type="button"
              onClick={onChangePaymentMethod}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#141414] hover:bg-[#0E0E0E] border border-[#1F1F1F] hover:border-[#4A4A4A] text-[#A1A1A1] hover:text-[#FAFAFA] font-medium text-xs transition-colors focus-ring cursor-pointer"
            >
              <span>Change Payment Method</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#6B6B6B]" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentStatus;
