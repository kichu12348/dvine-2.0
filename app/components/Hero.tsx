"use client";

import { useRef, useSyncExternalStore, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Component,
  Frame,
  Layers3,
  MousePointer2,
  PenTool,
  Sparkles,
} from "lucide-react";
import { useInView } from "motion/react";
import HeroBackground from "./ui/HeroBackground";
import styles from "./Hero.module.css";

const motionPreference = "(prefers-reduced-motion: reduce)";

function subscribeToMotionPreference(onChange: () => void) {
  const query = window.matchMedia(motionPreference);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const getMotionPreference = () => window.matchMedia(motionPreference).matches;
const getServerMotionPreference = () => false;

function DesignMark({ strokeWidth = 1.2 }: { strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
    >
      <rect x="4" y="2" width="8" height="7" rx="3.5" />
      <rect x="12" y="2" width="8" height="7" rx="3.5" />
      <rect x="4" y="9" width="8" height="7" rx="3.5" />
      <circle cx="16" cy="12.5" r="3.5" />
      <path d="M12 16H8a4 4 0 1 0 4 4v-4Z" />
    </svg>
  );
}

const designTools = [
  { Icon: DesignMark, className: "figmaTile", label: "Imagine", delay: "-1s" },
  { Icon: Frame, className: "frameTile", label: "Frame", delay: "-3.5s" },
  { Icon: PenTool, className: "penTile", label: "Create", delay: "-2s" },
  { Icon: Layers3, className: "layersTile", label: "Build", delay: "-4s" },
  {
    Icon: Component,
    className: "componentTile",
    label: "Connect",
    delay: "-.5s",
  },
  {
    Icon: Sparkles,
    className: "sparkTile",
    label: "Make it yours",
    delay: "-2.5s",
  },
];

export default function Hero({ ready = true }: { ready?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.1 });
  const reducedMotion = useSyncExternalStore(
    subscribeToMotionPreference,
    getMotionPreference,
    getServerMotionPreference,
  );

  return (
    <section
      ref={sectionRef}
      id="hero"
      className={styles.hero}
      aria-labelledby="hero-title"
      data-ready={ready}
      data-active={ready && inView && !reducedMotion}
    >
      <HeroBackground active={ready && inView} reducedMotion={reducedMotion} />
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.heroMain}>
        <div className={styles.content}>
          <Image
            src="/dvine.svg"
            alt="D'VINE 2.0"
            width={831}
            height={322}
            loading="eager"
            fetchPriority="high"
            className={styles.brandMark}
          />
          <h1 id="hero-title" className={styles.title}>
            <span className={styles.titleLine}>From vision</span>
            <span className={styles.titleLine}>
              to{" "}
              <span className={styles.selection}>
                creation.
                <span className={styles.handles} aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
                <span className={styles.collaborator} aria-hidden="true">
                  <MousePointer2
                    size={24}
                    fill="currentColor"
                    strokeWidth={1.5}
                  />
                  <span>You, next.</span>
                </span>
              </span>
            </span>
          </h1>
          <p className={styles.description}>
            Turn your boldest ideas into
            experiences people love.
          </p>
          <div className={styles.actions}>
            <Link href="/register" className={styles.register}>
              Register now <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
            <a href="#about-event" className={styles.explore}>
              Explore event <ArrowDown size={16} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className={styles.art} aria-hidden="true">
          <div className={styles.artGlow} />
          <svg className={styles.orbit} viewBox="0 0 600 640" fill="none">
            <ellipse
              cx="300"
              cy="305"
              rx="262"
              ry="180"
              transform="rotate(-29 300 305)"
              stroke="url(#hero-orbit)"
              strokeWidth="1"
              strokeDasharray="4 8"
            />
            <ellipse
              cx="300"
              cy="320"
              rx="220"
              ry="280"
              transform="rotate(30 300 320)"
              stroke="#8edcff"
              strokeOpacity=".1"
            />
            <path
              d="M65 450C110 480 480 120 540 130"
              stroke="#74cfff"
              strokeOpacity=".18"
            />
            <path
              d="M55 450h20M65 440v20M530 130h20M540 120v20"
              stroke="#b8ebff"
              strokeOpacity=".5"
            />
            <defs>
              <linearGradient
                id="hero-orbit"
                x1="70"
                y1="100"
                x2="500"
                y2="560"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#97dfff" stopOpacity=".02" />
                <stop offset=".45" stopColor="#97dfff" stopOpacity=".55" />
                <stop offset="1" stopColor="#2585ff" stopOpacity=".08" />
              </linearGradient>
            </defs>
          </svg>
          <div className={styles.sculpture}>
            <Image
              src="/assets/hero/pen.webp"
              alt=""
              width={1024}
              height={1024}
              sizes="(max-width: 650px) 92vw, (max-width: 1000px) 70vw, 540px"
              loading="eager"
              className={styles.nib}
            />
          </div>
          {designTools.map(({ Icon, className, label, delay }) => (
            <div
              key={className}
              className={[styles.toolPosition, styles[className]].join(" ")}
            >
              <div
                className={styles.toolFloat}
                style={{ "--float-delay": delay } as CSSProperties}
              >
                <div className={styles.toolCard}>
                  <Icon strokeWidth={1.2} />
                  <span>{label}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
