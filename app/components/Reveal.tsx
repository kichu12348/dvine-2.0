"use client";

import { useEffect, useRef, useState } from "react";

type RevealProps = {
  /** Stagger offset in ms. */
  delay?: number;
  className?: string;
  children: React.ReactNode;
};

/**
 * Curtain reveal: the block wipes upward from behind a clipped edge.
 * Renders visible until mounted so no-JS and crawlers always get the content,
 * then hides and animates in once the IntersectionObserver fires.
 */
export default function Reveal({ delay = 0, className = "", children }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    setArmed(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        // Let the hidden state paint before transitioning in.
        requestAnimationFrame(() => setShown(true));
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`curtain ${armed && !shown ? "is-armed" : ""} ${
        shown ? "is-shown" : ""
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="curtain-inner">{children}</div>
    </div>
  );
}