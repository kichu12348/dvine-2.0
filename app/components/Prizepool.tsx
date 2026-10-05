"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, LockKeyhole } from "lucide-react";

const REVEAL_AT = Date.parse("2026-10-10T00:00:00+05:30");
const units = ["Days", "Hours", "Minutes", "Seconds"] as const;

function getCountdown(now: number) {
  const seconds = Math.max(0, Math.ceil((REVEAL_AT - now) / 1000));
  return {
    seconds,
    values: [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60],
  };
}

export default function Prizepool() {
  const rootRef = useRef<HTMLElement>(null);
  // A stable server placeholder avoids mismatched clock values during hydration.
  const [countdown, setCountdown] = useState<ReturnType<typeof getCountdown> | null>(null);
  const revealed = countdown?.seconds === 0;

  useEffect(() => {
    let timer: number;
    const update = () => {
      const next = getCountdown(Date.now());
      setCountdown(next);
      if (next.seconds > 0) timer = window.setTimeout(update, 1000 - Date.now() % 1000);
    };
    const resume = () => {
      if (document.visibilityState !== "visible") return;
      window.clearTimeout(timer);
      update();
    };
    timer = window.setTimeout(update, 0);
    document.addEventListener("visibilitychange", resume);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", resume);
    };
  }, []);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    if (!root) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(root.querySelectorAll("[data-prize-reveal]"),
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: .9, stagger: .12, ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 78%", once: true } },
      );
    }, root);
    return () => media.revert();
  }, []);

  return (
    <section ref={rootRef} id="prizepool" aria-labelledby="prizepool-title" className="relative overflow-clip bg-[var(--ink)] px-5 py-16 text-[var(--text)] sm:px-8 sm:py-24 lg:px-12 lg:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_65%,#1abaff0a,transparent_60%)]" />
      <div className="relative mx-auto max-w-[1240px]">
        {/* <div className="flex flex-wrap justify-between gap-3 font-mono text-[8px] tracking-[0.1em] text-[var(--muted)] sm:text-[10px]">
          <span className="text-[var(--blue-light)]">THE REWARD AWAITS</span>
          <span>ANNOUNCEMENT / 10.10.26</span>
        </div> */}

        <div className="grid gap-8 pt-10 pb-10 sm:pt-12 sm:pb-14 lg:grid-cols-[1.3fr_0.7fr] lg:items-end lg:gap-20">
          <h2 id="prizepool-title" data-prize-reveal className="m-0 font-[family-name:var(--font-heading)] font-semibold tracking-[-0.065em]">
            <span className="block text-[clamp(50px,8.5vw,116px)] leading-none">PRIZE POOL.</span>
            <span className="mt-3 block text-[clamp(29px,5.2vw,72px)] leading-[1.1] text-transparent [-webkit-text-stroke:1px_#9de4ffaa]">{revealed ? "REVEAL DAY IS HERE." : "REVEALING SOON."}</span>
          </h2>
          <div data-prize-reveal className="max-w-[330px] lg:pb-1">
            <div className="mb-4 flex items-center gap-2.5 font-mono text-[8px] tracking-[0.1em] text-[var(--blue-light)]">
              <LockKeyhole size={13} strokeWidth={1.4} aria-hidden="true" />
              {revealed ? "THE WAIT IS OVER" : "STILL UNDER WRAPS"}
            </div>
            <p className="m-0 text-[13px] leading-[1.85] text-[var(--muted)] sm:text-[15px]">{revealed ? "Watch this space for the prize pool announcement." : "Big ideas deserve something worth chasing. The prize pool drops on 10 October. Until then, let the anticipation build."}</p>
          </div>
        </div>

        <div data-prize-reveal className="relative border-y border-[var(--line)] pt-6 pb-7 sm:pt-8 sm:pb-10">
          <div className="mb-6 flex items-center justify-between gap-3 font-mono text-[7px] tracking-[0.12em] text-[var(--muted)] sm:mb-8 sm:text-[9px]">
            <span className="flex items-center gap-2"><span aria-hidden="true" className="size-1 rounded-full bg-[var(--blue)]" />{revealed ? "COUNTDOWN COMPLETE" : "THE REVEAL DROPS IN"}</span>
            <span>10 OCT / 00:00 IST</span>
          </div>
          <div role="timer" aria-label="Time until the prize pool announcement on 10 October 2026 at midnight India Standard Time" aria-live="off" className="grid grid-cols-4 gap-2 sm:gap-6">
            {units.map((unit, index) => (
              <div key={unit} className="relative min-w-0 text-center">
                {index > 0 && <span aria-hidden="true" className="absolute top-0 left-0 flex h-[clamp(44px,10.6vw,146px)] items-center -translate-x-[calc(50%+4px)] font-mono text-[clamp(20px,4vw,48px)] leading-none text-[#9de4ff45] sm:-translate-x-[calc(50%+12px)]">:</span>}
                <span className={`block font-[family-name:var(--font-heading)] text-[clamp(44px,10.6vw,146px)] leading-none font-medium tracking-[-0.055em] tabular-nums ${index === 3 ? "text-[var(--blue-light)]" : "text-[var(--text)]"}`}>
                  {countdown ? String(countdown.values[index]).padStart(2, "0") : "––"}
                </span>
                <span className="mt-3 block font-mono text-[7px] tracking-[0.14em] text-[var(--muted)] uppercase sm:mt-5 sm:text-[9px]">{unit}</span>
              </div>
            ))}
          </div>
        </div>

        <div data-prize-reveal className="flex flex-wrap items-center justify-between gap-4 pt-6 font-mono text-[8px] text-[var(--muted)] sm:pt-7 sm:text-[10px]">
          <span>24 HOURS OF DESIGN. A REWARD WORTH THE WAIT.</span>
          <a href="/register" className="group inline-flex items-center gap-2 py-1 text-[var(--blue-light)]! focus-visible:outline-offset-4">BE THERE FOR THE REVEAL<ArrowUpRight size={13} strokeWidth={1.4} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" aria-hidden="true" /></a>
        </div>
        <p role="status" className="sr-only">{revealed ? "The countdown has ended. Prize pool reveal day is here." : ""}</p>
      </div>
    </section>
  );
}
