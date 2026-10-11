"use client";

import { useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
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
    >
      <HeroBackground active={ready && inView} reducedMotion={reducedMotion} />

      <div className={styles.content}>
        <h1 id="hero-title" className={styles.title}>
          <Image
            src="/assets/dvine_sub.svg"
            alt="D'VINE 2.0 — From vision to creation"
            width={831}
            height={323}
            loading="eager"
            fetchPriority="high"
            unoptimized
            className={styles.logo}
          />
        </h1>

        <div className={styles.actions}>
          <Link href="/register" className={styles.register}>
            Register now <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          <a href="#about-event" className={styles.explore}>
            Explore event <ArrowDown size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
