"use client";

import { useEffect, useId, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export interface DvineLogoStrokeProps {
  className?: string;
  onComplete?: () => void;
}

const LOGO_PATHS = [
  {
    id: "D",
    d: "M169.201 128.087V241.575L136.645 265.878H7.10736V103.784H136.645L169.201 128.087ZM104.318 209.248V168.668H71.9907V209.248H104.318Z",
    stroke: "#2D86CE",
    fill: "#2D86CE",
  },
  {
    id: "Apostrophe",
    d: "M216.264 103.784C214.888 109.134 213.131 114.942 210.991 121.209C208.851 127.476 206.482 133.742 203.883 140.009C201.438 146.123 198.992 151.931 196.547 157.433H181.644C182.714 153.154 183.784 148.568 184.854 143.677C186.077 138.786 187.147 133.895 188.064 129.004C189.134 123.96 190.051 119.069 190.815 114.331C191.732 109.593 192.496 105.236 193.108 101.262H214.659L216.264 103.784Z",
    stroke: "#A3E0FC",
    fill: "url(#paint1_linear_logo)",
  },
  {
    id: "V",
    d: "M390.923 120.521V224.609L342.318 266.337H277.434L228.829 224.609V161.102V152.848V144.824V104.243H277.434H293.483V193.429L309.761 207.414L326.039 193.429V104.243H342.318H390.923V112.497V120.521Z",
    stroke: "#A3E0FC",
    fill: "url(#paint1_linear_logo)",
  },
  {
    id: "I",
    d: "M472.179 103.326V265.419H407.296V103.326H472.179Z",
    stroke: "#B8E5FC",
    fill: "url(#paint1_linear_logo)",
  },
  {
    id: "N",
    d: "M654.662 265.19H589.778L557.451 211.312V265.19H492.568V103.097H557.451L589.778 157.204V103.097H654.662V111.35V265.19Z",
    stroke: "#CDEBFC",
    fill: "url(#paint1_linear_logo)",
  },
  {
    id: "E",
    d: "M821.083 209.707V266.337H675.267V104.243H821.083V160.873H740.151V169.126H780.731V201.453H740.151V209.707H821.083Z",
    stroke: "#E0F4FD",
    fill: "url(#paint1_linear_logo)",
  },
  {
    id: "TwoPointZero",
    d: "M667.172 74.4291H718.686V83H662.886C661.696 83 660.684 82.5834 659.851 81.7501C659.018 80.9168 658.601 79.905 658.601 78.7146V68.4473C658.601 63.6262 660.297 59.8467 663.69 57.1088C666.458 54.9363 669.612 53.85 673.154 53.85H708.419C710.711 53.85 712.362 53.0763 713.374 51.5288C713.761 50.9336 714.044 50.264 714.222 49.52C714.341 48.9843 714.401 48.4188 714.401 47.8236C714.401 45.5321 713.627 43.8804 712.08 42.8686C711.514 42.5115 710.86 42.2436 710.116 42.0651C709.55 41.9163 708.985 41.8419 708.419 41.8419H662.886V33.271H708.419C711.99 33.271 715.145 34.3572 717.883 36.5297C721.276 39.2379 722.972 43.0025 722.972 47.8236C722.972 51.3948 721.886 54.5643 719.713 57.332C717.035 60.7544 713.27 62.4656 708.419 62.4656H673.198C672.603 62.4656 672.038 62.5251 671.502 62.6441C670.758 62.8227 670.088 63.1054 669.493 63.4923C667.946 64.5041 667.172 66.1558 667.172 68.4473V74.4291ZM731.945 83V74.4291H740.515V83H731.945ZM817.698 46.7076V69.5633C817.698 73.2833 816.389 76.4528 813.77 79.0717C811.151 81.6906 807.981 83 804.261 83H762.88C759.16 83 755.991 81.6906 753.372 79.0717C750.753 76.4528 749.443 73.2833 749.443 69.5633V46.7076C749.443 43.0174 750.753 39.8628 753.372 37.2439C755.991 34.5953 759.16 33.271 762.88 33.271H804.261C807.981 33.271 811.151 34.5953 813.77 37.2439C816.389 39.8628 817.698 43.0174 817.698 46.7076ZM809.127 69.5633V46.7076C809.127 45.3684 808.651 44.2227 807.699 43.2703C806.746 42.318 805.601 41.8419 804.261 41.8419H762.88C761.541 41.8419 760.395 42.318 759.443 43.2703C758.491 44.2227 758.014 45.3684 758.014 46.7076V69.5633C758.014 70.9025 758.491 72.0483 759.443 73.0006C760.395 73.9529 761.541 74.4291 762.88 74.4291H804.261C805.601 74.4291 806.746 73.9529 807.699 73.0006C808.651 72.0483 809.127 70.9025 809.127 69.5633Z",
    stroke: "#FFFFFF",
    fill: "#FFFFFF",
  },
];

export const DvineLogoStroke = ({
  className = "",
  onComplete,
}: DvineLogoStrokeProps) => {
  const rootSvgRef = useRef<SVGSVGElement | null>(null);
  const wipeRectRef = useRef<SVGRectElement | null>(null);
  const rawId = useId();
  const clipId = `dvine-logo-wipe-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  useIsomorphicLayoutEffect(() => {
    const svg = rootSvgRef.current;
    if (!svg) return undefined;

    const strokePaths = svg.querySelectorAll<SVGPathElement>("[data-logo-stroke]");
    const wipeRect = wipeRectRef.current;
    if (!strokePaths.length) return undefined;

    const prefersReducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    )?.matches;

    if (prefersReducedMotion) {
      if (wipeRect) gsap.set(wipeRect, { attr: { width: 850 } });
      onComplete?.();
      return undefined;
    }

    // Set initial dasharray & dashoffset based on real computed path length
    strokePaths.forEach((path) => {
      try {
        const len = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: len + 1,
          strokeDashoffset: len + 1,
        });
      } catch {
        gsap.set(path, {
          strokeDasharray: 1200,
          strokeDashoffset: 1200,
        });
      }
    });

    if (wipeRect) {
      gsap.set(wipeRect, { attr: { width: 0 } });
    }

    const tl = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: () => {
        onComplete?.();
      },
    });

    // 1. Draw outline paths with smooth stagger
    tl.to(
      strokePaths,
      {
        strokeDashoffset: 0,
        duration: 1.35,
        ease: "power2.out",
        stagger: 0.08,
      },
      0
    );

    // 2. Wipe the solid gradient fills across the letters
    if (wipeRect) {
      tl.to(
        wipeRect,
        {
          attr: { width: 850 },
          duration: 0.7,
          ease: "power2.inOut",
        },
        0.95
      );
    }

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <svg
      ref={rootSvgRef}
      viewBox="0 0 831 322"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`block w-full h-auto overflow-visible select-none ${className}`}
      aria-label="D'VINE 2.0"
      role="img"
    >
      <defs>
        <linearGradient
          id="paint1_linear_logo"
          x1="0"
          y1="207.461"
          x2="831"
          y2="207.461"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#A3E0FC" />
          <stop offset="1" stopColor="#ECF7FD" />
        </linearGradient>

        <clipPath id={clipId}>
          <rect ref={wipeRectRef} x="0" y="0" width="0" height="322" />
        </clipPath>
      </defs>

      {/* Filled layer clipped by the horizontal wipe */}
      <g clipPath={`url(#${clipId})`}>
        {LOGO_PATHS.map((item) => (
          <path
            key={`fill-${item.id}`}
            d={item.d}
            fill={item.fill}
            stroke="none"
          />
        ))}
      </g>

      {/* Outline stroke layer drawn by GSAP */}
      <g fill="none">
        {LOGO_PATHS.map((item) => (
          <path
            key={`stroke-${item.id}`}
            data-logo-stroke
            d={item.d}
            stroke={item.stroke}
            strokeWidth={2.4}
            strokeLinejoin="round"
            strokeLinecap="round"
            style={{
              strokeDasharray: 2000,
              strokeDashoffset: 2000,
            }}
          />
        ))}
      </g>
    </svg>
  );
};

export default DvineLogoStroke;
