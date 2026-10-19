"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
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
  const [isBgLoaded, setIsBgLoaded] = useState(false);
  const ticket = result?.hash === hash ? result.ticket : undefined;
  const error = result?.hash === hash ? result.error : undefined;
  const loading = result?.hash !== hash;
  const isReady = !loading && !!ticket && isBgLoaded;
  const onQrReady = useCallback((value: string) => setReadyQr(value), []);

  useEffect(() => {
    const img = new window.Image();
    img.src = "/assets/ticket/cuppon.png";
    if (img.complete) {
      setIsBgLoaded(true);
    } else {
      img.onload = () => setIsBgLoaded(true);
      img.onerror = () => setIsBgLoaded(true);
    }
  }, []);

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

  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateScale = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      if (width > 0) {
        setScale(Math.min(1, width / 694));
      }
    };
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

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
        width: 694,
        height: 192,
        pixelRatio: 3,
        cacheBust: true,
        style: {
          transform: "none",
          transformOrigin: "top left",
        },
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

      {error || (!loading && !ticket) ? (
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
      ) : !isReady ? (
        <div className={styles.contentWrapper}>
          <div
            className={styles.content}
            aria-busy="true"
            aria-label="Loading your ticket"
          >
            <header className={styles.intro}>
              <p className={styles.eyebrow}>YOUR IDEAS HAVE A PLACE HERE</p>
              <h1>Consider this your way in.</h1>
              <p>
                Save your pass. Bring your curiosity. We&apos;ll see you there.
              </p>
            </header>

            <div ref={containerRef} className={styles.ticketContainer}>
              <div
                className={styles.ticketScaleWrapper}
                style={{
                  width: 694 * scale,
                  height: 192 * scale,
                }}
              >
                <div
                  className={`${styles.ticket} ${styles.ticketSkeleton}`}
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                  }}
                  aria-hidden="true"
                >
                  <div className={styles.mainSectionSkeleton}>
                    <div className={styles.ticketHeader}>
                      <div
                        className={`${styles.skeletonLogo} ${styles.boneDark}`}
                      />
                      <div
                        className={`${styles.skeletonEdition} ${styles.boneDark}`}
                      />
                    </div>

                    <div className={styles.attendee}>
                      <div
                        className={`${styles.skeletonPassLabel} ${styles.boneDark}`}
                      />
                      <div
                        className={`${styles.skeletonName} ${styles.boneDark}`}
                      />
                    </div>

                    <div className={styles.eventDetails}>
                      <div
                        className={`${styles.skeletonDate} ${styles.boneDark}`}
                      />
                      <div
                        className={`${styles.skeletonVenue} ${styles.boneDark}`}
                      />
                    </div>
                  </div>

                  <div className={styles.stubSkeleton}>
                    <div
                      className={`${styles.skeletonStubHeader} ${styles.boneLight}`}
                    />
                    <div
                      className={`${styles.skeletonQr} ${styles.boneLight}`}
                    />
                    <div
                      className={`${styles.skeletonHash} ${styles.boneLight}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <p>
                Keep this QR code handy.
                <br />
                <span>We&apos;ll scan it when you arrive.</span>
              </p>
              <div className={`${styles.skeletonButton} ${styles.boneDark}`} />
            </div>
            <p className={styles.footerNote}>
              FROM VISION TO CREATION. <span>D&apos;VINE 2.0.</span>
            </p>
          </div>
        </div>
      ) : (
        <div className={styles.contentWrapper}>
          <div className={`${styles.content} ${styles.ticketFadeIn}`}>
            <header className={styles.intro}>
              <p className={styles.eyebrow}>YOUR IDEAS HAVE A PLACE HERE</p>
              <h1>Consider this your way in.</h1>
              <p>
                Save your pass. Bring your curiosity. We&apos;ll see you there.
              </p>
            </header>

            <div ref={containerRef} className={styles.ticketContainer}>
              <div
                className={styles.ticketScaleWrapper}
                style={{
                  width: 694 * scale,
                  height: 192 * scale,
                }}
              >
                <article
                  ref={ticketRef}
                  className={styles.ticket}
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                  }}
                  aria-label="D’VINE attendee ticket"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/ticket/cuppon.png"
                    alt=""
                    className={styles.cupponBg}
                    aria-hidden="true"
                    draggable={false}
                  />

                  <div className={styles.mainSection}>
                    <header className={styles.ticketHeader}>
                      <Image
                        src="/dvine.svg"
                        alt="D’VINE 2.0"
                        width={116}
                        height={46}
                        className={styles.logo}
                        loading="eager"
                      />
                      <div className={styles.edition}>
                        <span>DESIGN HACKATHON</span>
                        <strong>2026 EDITION</strong>
                      </div>
                    </header>

                    <div className={styles.attendee}>
                      <span className={styles.passLabel}>PARTICIPANT PASS</span>
                      <h2>
                        {ticket.member.firstName} {ticket.member.lastName}
                      </h2>
                    </div>

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
                    </div>
                    <div className={styles.scanArea}>
                      <TicketQrCode
                        value={ticket.ticketHash}
                        size={100}
                        onReady={onQrReady}
                      />
                    </div>
                    <div className={styles.passId}>
                      <span>
                        {ticket.ticketHash.length > 16
                          ? ticket.ticketHash.slice(0, 16)
                          : ticket.ticketHash}
                      </span>
                      {ticket.ticketHash.length > 16 && (
                        <span>{ticket.ticketHash.slice(16)}</span>
                      )}
                    </div>
                  </aside>
                </article>
              </div>
            </div>

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
          </div>{" "}
        </div>
      )}
    </main>
  );
}
