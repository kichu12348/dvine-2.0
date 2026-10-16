"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const DitherVeil = dynamic(() => import("./ui/DitherVeil"), {
  ssr: false,
  loading: () => <div className="h-full w-full" />,
});

/** Keep in sync with the `aperture` transition in globals.css. */
const APERTURE_MS = 1000;

/**
 * Scroll-choreographed dither stage.
 * 1. Frame is clipped to a point at the centre.
 * 2. On scroll into view the aperture opens outward to full size.
 * 3. Once fully open, DitherVeil's own centre-out dither dissolve is released.
 */
export default function DitherStage() {
  const observerRef = useRef<HTMLDivElement>(null);
  const [loadVeil, setLoadVeil] = useState(false);
  // 0 = closed aperture, 1 = fully open, 2 = open and image dissolving in.
  const [phase, setPhase] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const target = observerRef.current;
    if (!target) return undefined;
    let disposed = false;

    // Hash navigation can open the stage immediately, before observer delivery.
    if (window.location.hash) {
      queueMicrotask(() => {
        if (!disposed) setLoadVeil(true);
      });
    }

    // Warm the image and WebGL code before the aperture reaches the viewport.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setLoadVeil(true);
      },
      { rootMargin: "1000px 0px" },
    );
    observer.observe(target);
    return () => {
      disposed = true;
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const target = observerRef.current;
    if (!target) return undefined;

    // Honour reduced motion: skip the aperture and show the finished state.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frame = requestAnimationFrame(() => setPhase(2));
      return () => cancelAnimationFrame(frame);
    }

    // Observe the outer wrapper, NOT the clipped frame. IntersectionObserver
    // clips its intersection rect by ancestor clip-paths, so observing the
    // clipped element would report isIntersecting=false forever.
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        // Wait a frame so the closed clip-path is committed before it changes.
        frame = requestAnimationFrame(() => setPhase(1));
      },
      // Trigger once the frame is genuinely on screen, not just peeking in.
      { threshold: 0.2 },
    );

    observer.observe(target);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  // Hold at full aperture for the transition, then release the dissolve.
  useEffect(() => {
    if (phase !== 1) return undefined;
    const timer = setTimeout(() => setPhase(2), APERTURE_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  return (
    <div
      ref={observerRef}
      className="relative h-[24rem] w-full sm:h-[30rem] lg:h-[36rem]"
    >
      <div
        className={`aperture ${phase > 0 ? "is-open" : ""} relative h-full w-full overflow-hidden border border-[var(--line)] shadow-2xl backdrop-blur-sm`}
      >
        {(loadVeil || phase > 0) && (
          <DitherVeil
            src="https://images.unsplash.com/photo-1737071371043-761e02b1ef95?q=80&w=1400&auto=format&fit=crop"
            fit="contain"
            pattern="floyd"
            palette="duotone"
            pixelSize={1}
            levels={2}
            inkColor="#120f17"
            paperColor="#69b0f0"
            contrast={1.15}
            brightness={0}
            revealRadius={150}
            softness={0.6}
            linger={1}
            rimColor="#a78bfa"
            rim={0}
            reverse={false}
            wander={true}
            clickBurst={true}
            playIntro={phase === 2}
          />
        )}
      </div>
    </div>
  );
}
