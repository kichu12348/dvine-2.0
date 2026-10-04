"use client";

import React from "react";

interface LiquidButtonProps {
  href?: string;
  onClick?: () => void;
  text?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  target?: string;
  rel?: string;
  ariaLabel?: string;
  /** Button shape: "pill" (default smooth rounded-full) | "rounded" (rounded-xl) | "chamfer" (cut edges) */
  shape?: "pill" | "rounded" | "chamfer";
  /** Cut edges configuration (only if shape="chamfer"): "1" = top-right cut, "2" = dual diagonal cuts */
  cutEdges?: "1" | "2";
  /** Visual theme: "primary" (vibrant electric cyan gradient) | "stealth" (dark cyber navy) */
  variant?: "primary" | "stealth";
}

export default function LiquidButton({
  href = "#schedule",
  onClick,
  text = "REGISTER NOW",
  className = "",
  size = "md",
  target,
  rel,
  ariaLabel,
  shape = "pill",
  cutEdges = "2",
  variant = "primary",
}: LiquidButtonProps) {
  const sizeStyles = {
    sm: "px-4 py-1.5 text-[0.72rem] gap-2",
    md: "px-6 py-2.5 text-xs sm:text-[0.82rem] gap-2.5",
    lg: "px-8 sm:px-9 py-3 sm:py-3.5 text-xs sm:text-sm gap-3",
  };

  const isChamfer = shape === "chamfer";
  const chamferPx = size === "sm" ? 8 : size === "md" ? 10 : 12;

  const chamferClip =
    cutEdges === "1"
      ? `polygon(0 0, calc(100% - ${chamferPx}px) 0, 100% ${chamferPx}px, 100% 100%, 0 100%)`
      : `polygon(0 0, calc(100% - ${chamferPx}px) 0, 100% ${chamferPx}px, 100% 100%, ${chamferPx}px 100%, 0 calc(100% - ${chamferPx}px))`;

  const roundedClass =
    shape === "pill"
      ? "rounded-full"
      : shape === "rounded"
      ? "rounded-xl"
      : "";

  const Component = href ? "a" : "button";

  const isPrimary = variant === "primary";

  return (
    <Component
      href={href}
      onClick={onClick}
      target={target}
      rel={rel}
      aria-label={ariaLabel || text}
      style={isChamfer ? { clipPath: chamferClip } : undefined}
      className={`group relative inline-flex items-center justify-center p-[1px] ${roundedClass} overflow-hidden cursor-pointer select-none transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] isolate ${
        isPrimary
          ? "bg-gradient-to-r from-cyan-300 via-white/50 to-sky-400 shadow-[0_0_24px_rgba(0,218,253,0.45)] hover:shadow-[0_0_36px_rgba(0,218,253,0.7)]"
          : "bg-gradient-to-r from-cyan-400/50 via-white/30 to-cyan-400/50 shadow-[0_4px_16px_rgba(0,0,0,0.5)] hover:shadow-[0_6px_22px_rgba(45,134,206,0.35)]"
      } ${className}`}
    >
      {/* Inner Button Body */}
      <div
        style={isChamfer ? { clipPath: chamferClip } : undefined}
        className={`relative z-10 w-full h-full flex items-center justify-center overflow-hidden transition-colors duration-300 ${roundedClass} ${
          isPrimary
            ? "bg-gradient-to-r from-[#00DAFD] via-[#1abaff] to-[#0080ff] text-[#020817]"
            : "bg-gradient-to-b from-[#091f42]/95 via-[#041228]/95 to-[#020817]/98 text-white backdrop-blur-xl"
        } ${sizeStyles[size]}`}
      >
        {/* Top-edge specular hairline light reflection */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"
        />

        {/* Base Layer (Idle): Crisp typography + directional badge */}
        <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-2.5 font-extrabold uppercase tracking-wider select-none">
          <span className="tracking-[0.14em] font-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]">
            {text}
          </span>
          <span
            className={`flex items-center justify-center px-1.5 py-0.5 rounded-full text-xs font-bold transition-transform duration-300 group-hover:translate-x-1 ${
              isPrimary
                ? "bg-[#020817]/15 border border-[#020817]/25 text-[#020817]"
                : "bg-cyan-400/15 border border-cyan-300/35 text-cyan-300"
            }`}
          >
            →
          </span>
        </span>

        {/* Wave 1: Leading liquid refraction crest sweeping from bottom-left corner */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-tr from-white/40 via-cyan-200/50 to-white/70 transition-[clip-path] duration-500 ease-out [clip-path:circle(0%_at_0%_100%)] group-hover:[clip-path:circle(220%_at_0%_100%)]"
        />

        {/* Wave 2: Liquid Surge with Color Flip & Specular Highlights */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 z-30 flex items-center justify-center gap-2 sm:gap-2.5 uppercase tracking-wider select-none transition-[clip-path] duration-500 ease-out [clip-path:circle(0%_at_0%_100%)] group-hover:[clip-path:circle(200%_at_0%_100%)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.9)] ${
            isPrimary
              ? "bg-gradient-to-r from-white via-[#b8edff] to-[#00DAFD] text-[#020817]"
              : "bg-gradient-to-tr from-[#2D86CE] via-[#38bdf8] to-[#e0f7ff] text-[#020817]"
          }`}
        >
          <span className="tracking-[0.14em] font-black">{text}</span>
          <span className="flex items-center justify-center px-1.5 py-0.5 rounded-full bg-[#020817]/15 border border-[#020817]/30 text-[#020817] text-xs font-bold transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </Component>
  );
}
