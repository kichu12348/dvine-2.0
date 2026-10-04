"use client";

import { useMemo } from "react";
import { cn } from "../../lib/utils";

interface RandomLetterSwapProps {
  /** Text to display and animate. */
  label: string;
  /**
   * Roll direction. `true` (default) rolls the letters downward — they enter
   * from above; `false` rolls them upward.
   */
  reverse?: boolean;
  /** Delay between one letter's transition start and the next, in ms. */
  staggerDuration?: number;
  /** Duration of a single letter's roll, in ms. */
  duration?: number;
  className?: string;
}

/** Fisher–Yates shuffle, memoised per label so the order never flickers on re-render. */
function shuffledOrder(length: number) {
  const indices = Array.from({ length }, (_, i) => i);

  for (let i = indices.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  return indices;
}

/**
 * Random Letter Swap — ported from
 * https://www.fancycomponents.dev/docs/components/text/random-letter-swap
 *
 * Every letter is stacked twice inside its own clipped slot. On hover (or
 * keyboard focus of the parent `group`) the pair rolls vertically — like a
 * slot-machine cylinder — with each letter starting at a random point in the
 * stagger order, then rolls back on hover-out.
 *
 * The port is CSS-driven on purpose: it rides the parent's `group-hover` so the
 * whole link area triggers it, it inherits the site easing, and the global
 * `prefers-reduced-motion` override in `globals.css` neutralises it for free
 * (the upstream `motion` + `lodash` implementation needs extra handling for
 * both of those).
 */
export default function RandomLetterSwap({
  label,
  reverse = true,
  staggerDuration = 30,
  duration = 700,
  className,
}: RandomLetterSwapProps) {
  const order = useMemo(() => shuffledOrder(label.length), [label]);

  const rollOut = reverse
    ? "group-hover:translate-y-full group-focus-visible:translate-y-full"
    : "group-hover:-translate-y-full group-focus-visible:-translate-y-full";

  const startAbove = reverse ? "-top-full" : "top-full";

  return (
    <span className={cn("inline-flex items-center", className)}>
      {/* Accessible text — the visible letters are decorative duplicates */}
      <span className="sr-only">{label}</span>

      {label.split("").map((letter, i) => (
        <span
          key={`${letter}-${i}`}
          aria-hidden="true"
          className="relative inline-flex shrink-0 overflow-hidden whitespace-pre"
        >
          {/* Primary letter: rolls out of the slot */}
          <span
            className={cn(
              "transition-transform ease-[cubic-bezier(0.16,1,0.3,1)]",
              rollOut
            )}
            style={{
              transitionDuration: `${duration}ms`,
              transitionDelay: `${order[i] * staggerDuration}ms`,
            }}
          >
            {letter}
          </span>

          {/* Twin letter: waits above (or below) the slot, then rolls in */}
          <span
            className={cn(
              "absolute left-0 transition-[top] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:top-0 group-focus-visible:top-0",
              startAbove
            )}
            style={{
              transitionDuration: `${duration}ms`,
              transitionDelay: `${order[i] * staggerDuration}ms`,
            }}
          >
            {letter}
          </span>
        </span>
      ))}
    </span>
  );
}
