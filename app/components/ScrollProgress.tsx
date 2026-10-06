"use client";

import { useEffect, useRef } from "react";

export default function ScrollProgress({ menuOpen = false }: { menuOpen?: boolean }) {
  const indicatorRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const indicator = indicatorRef.current;
    if (!indicator) return;
    let frame = 0;
    let previousPercent = -1;

    const update = () => {
      frame = 0;
      const scroller = document.scrollingElement ?? document.documentElement;
      const distance = scroller.scrollHeight - scroller.clientHeight;
      // Browsers can stop a fraction of a pixel short of the bottom.
      const progress = distance <= 0 || scroller.scrollTop < 1 ? 0
        : distance - scroller.scrollTop <= 1 ? 1
        : Math.min(1, Math.max(0, scroller.scrollTop / distance));
      const percent = Math.round(progress * 100);

      indicator.hidden = distance <= 0;
      indicator.style.setProperty("--scroll-progress", String(progress));
      if (percent !== previousPercent) {
        indicator.setAttribute("aria-valuenow", String(percent));
        indicator.setAttribute("aria-valuetext", `${percent}% of page explored`);
        if (percentRef.current) percentRef.current.textContent = `${percent}%`;
        previousPercent = percent;
      }
    };
    const requestUpdate = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(requestUpdate);
    observer.observe(document.body);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    document.addEventListener("load", requestUpdate, true);
    requestUpdate();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      document.removeEventListener("load", requestUpdate, true);
    };
  }, []);

  return (
    <div
      ref={indicatorRef}
      className="pointer-events-none fixed top-1/2 right-1.5 z-30 h-[144px] w-2 -translate-y-1/2 select-none [--scroll-progress:0] data-[menu-open=true]:invisible sm:right-4 sm:h-[192px] sm:w-6 lg:right-6"
      data-menu-open={menuOpen}
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      aria-valuetext="0% of page explored"
    >
      <div aria-hidden="true" className="absolute inset-y-0 left-0 w-2 sm:left-2">
        <span className="absolute inset-y-0 left-0 w-px bg-[#9de4ff24]" />
        <span className="absolute inset-y-0 left-0 w-px origin-top bg-[var(--blue-light)] [transform:scaleY(var(--scroll-progress))]" />
        {/* Twenty-four intervals echo the sprint; the fill tracks page position. */}
        <div className="absolute inset-0 flex flex-col justify-between text-[#9de4ff38]">
          {Array.from({ length: 25 }, (_, index) => <span key={index} className={`h-px shrink-0 bg-current ${index % 6 === 0 ? "w-2" : "w-[3px]"}`} />)}
        </div>
        <div className="absolute inset-0 flex flex-col justify-between text-[var(--blue)] [clip-path:inset(0_0_calc((1_-_var(--scroll-progress))*100%)_0)]">
          {Array.from({ length: 25 }, (_, index) => <span key={index} className={`h-px shrink-0 bg-current ${index % 6 === 0 ? "w-2" : "w-[3px]"}`} />)}
        </div>
        <span className="absolute left-0 size-[5px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[var(--blue-light)] shadow-[0_0_7px_#1abaff55] [top:calc(var(--scroll-progress)*100%)]" />
      </div>
      <span ref={percentRef} aria-hidden="true" className="absolute top-[calc(100%+14px)] right-0 left-0 hidden text-center font-mono text-[7px] leading-none text-[var(--blue-light)]/80 tabular-nums sm:block">0%</span>
    </div>
  );
}

