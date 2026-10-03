"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import DvineLogoStroke from "./ui/dvine-logo-stroke";

export interface LoadingScreenProps {
  /** Callback fired when the transition to hero finishes */
  onComplete?: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const zoomTargetRef = useRef<HTMLDivElement | null>(null);
  const blueFloodRef = useRef<HTMLDivElement | null>(null);

  const [isComplete, setIsComplete] = useState(false);

  // Lock scroll while the loading intro is running
  useEffect(() => {
    if (isComplete) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isComplete]);

  // Handle immediate skip / finish
  const finishLoading = useCallback(() => {
    setIsComplete(true);
    document.body.style.overflow = "";
    onComplete?.();
  }, [onComplete]);

  // Safety fallback: ensure loading screen dismisses even if an error or delay occurs
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      if (!isComplete) {
        finishLoading();
      }
    }, 5500);

    return () => clearTimeout(safetyTimer);
  }, [isComplete, finishLoading]);

  // Trigger the zoom into the blue fill screen once the logo is revealed
  const handleStrokeComplete = useCallback(() => {
    if (!containerRef.current || !zoomTargetRef.current || !blueFloodRef.current) {
      finishLoading();
      return;
    }

    const prefersReducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    )?.matches;

    if (prefersReducedMotion) {
      finishLoading();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        finishLoading();
      },
    });

    // 1. Zoom deeply into the blue "D" of the D'VINE logo (center of D is at ~11% X, 57% Y)
    tl.to(zoomTargetRef.current, {
      scale: 45,
      duration: 0.75,
      ease: "power3.in",
      transformOrigin: "11% 57%",
    });

    // 2. Luminous blue flood matching the exact logo blue expands to fill the viewport
    tl.to(
      blueFloodRef.current,
      {
        opacity: 1,
        duration: 0.4,
        ease: "power2.in",
      },
      "-=0.38"
    );

    // 3. Brief hold on the solid blue screen
    tl.to({}, { duration: 0.06 });

    // 4. Reveal the Hero: smooth cinematic fade-out of the blue curtain
    tl.to(containerRef.current, {
      opacity: 0,
      scale: 1.04,
      duration: 0.65,
      ease: "power2.out",
    });
  }, [finishLoading]);

  if (isComplete) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-label="Loading D'VINE 2.0"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#020817] select-none overflow-hidden isolate"
      style={{ willChange: "opacity, transform" }}
    >


      {/* Blue flood overlay that covers the entire screen during the zoom */}
      <div
        ref={blueFloodRef}
        className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-tr from-[#1B5E9C] via-[#2D86CE] to-[#A3E0FC] opacity-0"
        aria-hidden="true"
        style={{ willChange: "opacity" }}
      />

      {/* Main animated logo container that zooms into the blue "D" fill */}
      <div
        ref={zoomTargetRef}
        className="relative z-10 flex flex-col items-center justify-center px-4 w-full max-w-[85vw] sm:max-w-[70vw] md:max-w-2xl lg:max-w-3xl"
        style={{ willChange: "transform" }}
      >
        <DvineLogoStroke
          onComplete={handleStrokeComplete}
          className="drop-shadow-[0_0_32px_rgba(45,134,206,0.45)]"
        />
      </div>
    </div>
  );
}
