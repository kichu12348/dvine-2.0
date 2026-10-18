"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  Check,
  Download,
  LoaderCircle,
} from "lucide-react";
import { toPng } from "html-to-image";
import { registrationApi } from "../../register/services/registrationApi";
import type { TicketDetailsResponse } from "../../register/types";
import { TicketQrCode } from "../components/TicketQrCode";
import styles from "../ticket.module.css";

interface TicketPageProps {
  params: Promise<{ hash: string }>;
}

type TicketResult = {
  hash: string;
  ticket?: TicketDetailsResponse;
  error?: string;
};

export default function TicketPage({ params }: TicketPageProps) {
  const { hash } = use(params);
  const ticketRef = useRef<HTMLElement>(null);
  const [result, setResult] = useState<TicketResult | null>(null);
  const [readyQr, setReadyQr] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const ticket = result?.hash === hash ? result.ticket : undefined;
  const error = result?.hash === hash ? result.error : undefined;
  const loading = result?.hash !== hash;
  const onQrReady = useCallback((value: string) => setReadyQr(value), []);

  useEffect(() => {
    let active = true;
    registrationApi.getTicket(hash).then(
      (data) => {
        if (active) setResult({ hash, ticket: data });
      },
      (reason: unknown) => {
        if (active)
          setResult({
            hash,
            error:
              reason instanceof Error
                ? reason.message
                : "Ticket not found or registration payment is pending.",
          });
      },
    );
    return () => {
      active = false;
    };
  }, [hash]);

  const handleDownload = async () => {
    if (!ticketRef.current || !ticket || readyQr !== ticket.ticketHash) return;
    setIsDownloading(true);
    setDownloadError(null);
    try {
      await document.fonts.ready;
      await Promise.all(
        Array.from(ticketRef.current.querySelectorAll("img"), (image) =>
          image.decode(),
        ),
      );
      const dataUrl = await toPng(ticketRef.current, {
        pixelRatio: 3,
        cacheBust: true,
      });
      const name =
        `${ticket.member.firstName}-${ticket.member.lastName}`
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") || "ticket";
      const link = document.createElement("a");
      link.download = `dvine-${name}.png`;
      link.href = dataUrl;
      link.click();
    } catch (reason) {
      console.error("Failed to save ticket", reason);
      setDownloadError("We couldn’t save your ticket. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main className={styles.page}>
      <nav className={styles.navigation} aria-label="Ticket navigation">
        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={15} aria-hidden="true" /> Back to event
        </Link>
        <span className={styles.navigationLabel}>
          D&apos;VINE 2.0 / EVENT ACCESS
        </span>
      </nav>

      {loading ? (
        <div className={styles.statePanel} role="status">
          <LoaderCircle
            className={styles.spinner}
            size={28}
            aria-hidden="true"
          />
          <h1>Getting your pass ready.</h1>
          <p>Your next great idea is one step closer.</p>
        </div>
      ) : error || !ticket ? (
        <div className={styles.statePanel} role="alert">
          <AlertCircle size={30} aria-hidden="true" />
          <h1>Ticket unavailable.</h1>
          <p>
            {error ||
              "This ticket could not be found or registration payment is pending."}
          </p>
          <Link href="/" className={styles.homeLink}>
            Back to D&apos;VINE <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <div className={styles.content}>
          <header className={styles.intro}>
            <p className={styles.eyebrow}>YOUR IDEAS HAVE A PLACE HERE</p>
            <h1>Consider this your way in.</h1>
            <p>
              Save your pass. Bring your curiosity. We&apos;ll see you there.
            </p>
          </header>

          <article
            ref={ticketRef}
            className={styles.ticket}
            aria-label="D’VINE attendee ticket"
          >
            <div className={styles.mainSection}>
              <header className={styles.ticketHeader}>
                <Image
                  src="/dvine.svg"
                  alt="D’VINE 2.0"
                  width={164}
                  height={64}
                  className={styles.logo}
                  loading="eager"
                />
                <span className={styles.edition}>
                  DESIGN HACKATHON
                  <br />
                  <strong>2026 EDITION</strong>
                </span>
              </header>

              <div className={styles.passHeading}>
                <span className={styles.passLabel}>PARTICIPANT PASS</span>
                <span className={styles.status}>
                  <Check size={12} aria-hidden="true" />{" "}
                  {ticket.checkedIn || ticket.status === "checked_in"
                    ? "CHECKED IN"
                    : "CONFIRMED"}
                </span>
              </div>

              <div className={styles.attendee}>
                <span className={styles.fieldLabel}>ISSUED TO</span>
                <h2>
                  {ticket.member.firstName} {ticket.member.lastName}
                </h2>
              </div>

              <dl className={styles.details}>
                <div>
                  <dt>COLLEGE / INSTITUTION</dt>
                  <dd>{ticket.member.collegeName || "Not provided"}</dd>
                </div>
                <div>
                  <dt>EMAIL ADDRESS</dt>
                  <dd>{ticket.member.email}</dd>
                </div>
              </dl>

              <footer className={styles.eventDetails}>
                <div className={styles.eventDate}>
                  <span>31 OCT — 01 NOV</span>
                  <small>2026</small>
                </div>
                <div className={styles.venue}>
                  <span>THE VENUE</span>
                  <strong>
                    {ticket.event.venue || "Jain University, Kochi"}
                  </strong>
                </div>
              </footer>
            </div>

            <aside className={styles.stub} aria-label="Entry QR code">
              <div className={styles.stubHeader}>
                <span>ADMIT ONE</span>
                <ArrowUpRight size={20} strokeWidth={1.5} aria-hidden="true" />
              </div>
              <div className={styles.scanArea}>
                <p className={styles.scanLabel}>SCAN TO CHECK IN</p>
                <TicketQrCode
                  value={ticket.ticketHash}
                  size={188}
                  onReady={onQrReady}
                />
                <p className={styles.scanHint}>Your ideas. Your entry.</p>
              </div>
              <div className={styles.passId}>
                <span>PASS ID</span>
                <strong>
                  DV / {ticket.ticketHash.slice(0, 8).toUpperCase()}
                </strong>
              </div>
            </aside>
          </article>

          <div className={styles.actions}>
            <p>
              Keep this QR code handy.
              <br />
              <span>We&apos;ll scan it when you arrive.</span>
            </p>
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading || readyQr !== ticket.ticketHash}
              className={styles.downloadButton}
            >
              {isDownloading ? (
                <LoaderCircle
                  size={17}
                  className={styles.spinner}
                  aria-hidden="true"
                />
              ) : (
                <Download size={17} aria-hidden="true" />
              )}
              {isDownloading ? "Saving your ticket…" : "Download ticket"}
            </button>
          </div>
          {downloadError && (
            <p className={styles.downloadError} role="alert">
              {downloadError}
            </p>
          )}
          <p className={styles.footerNote}>
            FROM VISION TO CREATION. <span>D&apos;VINE 2.0.</span>
          </p>
        </div>
      )}
    </main>
  );
}
