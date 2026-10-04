"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import Galaxy from "./ui/Galaxy";
import AnatomyButton from "./ui/AnatomyButton";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 480], [1, 0]);
  const y = useTransform(scrollY, [0, 480], [0, -80]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-[100dvh] flex-col justify-center items-center overflow-hidden bg-[#020817]"
      aria-labelledby="hero-title"
    >
      {/* Interactive WebGL Galaxy Background (Layer 0) */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <Galaxy
          density={1.2}
          glowIntensity={0.5}
          twinkleIntensity={0.4}
          starSpeed={0.5}
          speed={0.8}
          rotationSpeed={0.06}
          mouseRepulsion={true}
          repulsionStrength={2.5}
          transparent={true}
          className="w-full h-full"
        />
      </div>

      {/* Subtle blueprint grid overlay (Layer 0) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(26,186,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26,186,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
        }}
      />

      {/* Vignette depth (Layer 0) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 35%, rgba(2,8,23,0.72) 100%)",
        }}
      />

      {/* Bottom section blend fade (Layer 0, behind content) */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-36 sm:h-44 z-0 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, #020817)",
        }}
      />

      {/* Hero Foreground Content — High z-index Layer */}
      <motion.div
        style={{ opacity, y }}
        className="relative z-20 flex flex-col items-center text-center px-5 sm:px-8 max-w-5xl mx-auto w-full pointer-events-auto"
      >
        <motion.h1
          id="hero-title"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
          className="relative z-30 w-full flex justify-center items-center select-none"
        >
          <Image
            src="/assets/dvine_sub.svg"
            alt="D'VINE 2.0 - From Vision to Creation"
            width={831}
            height={323}
            priority
            className="relative z-30 w-full h-auto max-w-[420px] xs:max-w-[520px] sm:max-w-[640px] md:max-w-[760px] lg:max-w-[831px] object-contain drop-shadow-[0_0_35px_rgba(0,141,254,0.25)]"
          />
          <span className="sr-only">D&apos;VINE 2.0 - From Vision to Creation</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.26 }}
          className="relative z-20 mt-6 max-w-xl text-[1rem] sm:text-[1.1rem] leading-relaxed text-[#9cbad1]"
        >
          The ultimate 2-member UI/UX hackathon by IEDC BOOTCAMP CEC &amp; IEEE
          SB CEC.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="relative z-30 mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <AnatomyButton href="/register">REGISTER NOW</AnatomyButton>
          <a
            href="#about-event"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#c2d7e9] backdrop-blur-sm transition-all duration-200 hover:bg-white/10 hover:border-cyan-400/40 hover:text-white active:scale-95"
          >
            Explore Event
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="mt-0.5"
            >
              <path
                d="M6 2v8M2 8l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
