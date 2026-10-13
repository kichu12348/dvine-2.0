import { ScrollTrigger } from "gsap/ScrollTrigger";

let refreshFrame: number | undefined;

/** Coalesce measurements requested by sections after the same font load. */
export function scheduleScrollTriggerRefresh() {
  if (refreshFrame !== undefined) return;
  refreshFrame = window.requestAnimationFrame(() => {
    refreshFrame = undefined;
    ScrollTrigger.refresh();
  });
}
