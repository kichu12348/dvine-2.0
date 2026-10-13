"use client";

import { useEffect, useRef } from "react";

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

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    // Animation classes do not affect content, so avoid rerendering the entire
    // revealed subtree just to arm and play its existing CSS transition.
    el.classList.add("is-armed");
    let frame = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        // Let the hidden state paint before transitioning in.
        frame = requestAnimationFrame(() => {
          el.classList.remove("is-armed");
          el.classList.add("is-shown");
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      el.classList.remove("is-armed", "is-shown");
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`curtain ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="curtain-inner">{children}</div>
    </div>
  );
}
