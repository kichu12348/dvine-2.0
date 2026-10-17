"use client";

import React, { use, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Download, AlertCircle, Home } from "lucide-react";
import { toPng } from "html-to-image";
import { registrationApi } from "../../register/services/registrationApi";
import { TicketDetailsResponse } from "../../register/types";
import { TicketQrCode } from "../components/TicketQrCode";

interface TicketPageProps {
  params: Promise<{ hash: string }>;
}

export default function TicketPage({ params }: TicketPageProps) {
  const { hash } = use(params);
  const ticketRef = useRef<HTMLDivElement>(null);
  const [ticket, setTicket] = useState<TicketDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadTicket() {
      try {
        setLoading(true);
        setError(null);
        const data = await registrationApi.getTicket(hash);
        if (isMounted) setTicket(data);
      } catch (err: any) {
        if (isMounted)
          setError(
            err?.message ||
              "Ticket not found or registration payment is pending.",
          );
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    if (hash) loadTicket();
    return () => {
      isMounted = false;
    };
  }, [hash]);

  const handleDownload = async () => {
    if (!ticketRef.current) return;
    try {
      setIsDownloading(true);
      const dataUrl = await toPng(ticketRef.current, {
        cacheBust: true,
        pixelRatio: 3,
      });
      const link = document.createElement("a");
      const name = ticket?.member?.firstName
        ? `${ticket.member.firstName}-${ticket.member.lastName || ""}`
        : "ticket";
      link.download = `dvine-${name.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate ticket image", err);
    } finally {
      setIsDownloading(false);
    }
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-[#020817] flex items-center justify-center">
        <div className="w-[260px] rounded-2xl border border-white/8 bg-[#0B0F17] p-8 flex flex-col items-center gap-5">
          <div className="w-20 h-5 rounded bg-white/5 animate-pulse" />
          <div className="w-36 h-4 rounded bg-white/5 animate-pulse" />
          <div className="w-[160px] h-[160px] rounded-xl bg-white/5 animate-pulse" />
          <div className="w-32 h-2.5 rounded bg-white/5 animate-pulse" />
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-[#020817] text-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-xs p-8 rounded-2xl border border-rose-500/20 bg-[#0B0F17] text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-base font-semibold text-white">
              Ticket Not Available
            </h2>
            <p className="text-xs text-neutral-500 leading-relaxed">
              {error ||
                "This ticket could not be found or registration payment is pending."}
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-neutral-200 text-black text-xs font-semibold transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            Homepage
          </Link>
        </div>
      </div>
    );
  }

  const { member } = ticket;

  return (
    <div className="min-h-screen bg-[#020817] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-[260px] flex flex-col items-center gap-4">
        {/* ── Ticket Card ── */}
        <motion.div
          ref={ticketRef}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full rounded-2xl border border-white/8 bg-[#0B0F17] p-[0.5rem] flex flex-col items-center gap-5"
        >
          {/* Logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/dvine.svg"
            alt="D'VINE"
            className="h-6 w-auto object-contain select-none"
            style={{
              height: "60px",
            }}
          />

          {/* Name */}
          <p className="text-sm font-semibold text-white tracking-tight">
            {member.firstName} {member.lastName}
          </p>

          {/* QR Code */}
          <TicketQrCode value={ticket.ticketHash} size={160} />

          {/* Hash */}
          <p className="font-mono text-[9px] text-neutral-600 tracking-widest break-all select-all text-center leading-relaxed">
            {ticket.ticketHash}
          </p>
        </motion.div>

        {/* ── Download ── */}
        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-black font-semibold text-xs transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" />
          {isDownloading ? "Generating…" : "Download"}
        </button>
      </div>
    </div>
  );
}
