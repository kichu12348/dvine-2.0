"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowDownRight, ArrowUpRight, Coffee, Flag, Moon } from "lucide-react";

// Tailwind utilities keep the original 600 / 900 / 1100px layout boundaries.
const scheduleClasses = {
  section: "relative bg-[var(--ink)] px-5 pt-[70px] pb-[60px] text-[var(--text)] min-[37.5625rem]:px-6 min-[56.3125rem]:px-8 min-[56.3125rem]:pt-20 min-[56.3125rem]:pb-[70px] min-[68.8125rem]:px-12 min-[68.8125rem]:pt-[100px] min-[68.8125rem]:pb-[90px]",
  container: "mx-auto w-full max-w-[1240px]",
  kicker: "flex justify-between gap-[18px] font-mono text-[7px] tracking-[0.04em] text-[var(--muted)] min-[37.5625rem]:text-[10px] min-[37.5625rem]:tracking-[0.12em] [&>span:first-child]:text-[var(--blue-light)] [&>span:first-child]:before:mr-1.5 [&>span:first-child]:before:inline-block [&>span:first-child]:before:size-1 [&>span:first-child]:before:rounded-full [&>span:first-child]:before:bg-[var(--blue)] [&>span:first-child]:before:shadow-[0_0_12px_#1abaff80] [&>span:first-child]:before:content-[''] min-[37.5625rem]:[&>span:first-child]:before:mr-2.5 min-[37.5625rem]:[&>span:first-child]:before:size-[5px]",
  introGrid: "block pt-[30px] pb-[35px] min-[37.5625rem]:grid min-[37.5625rem]:grid-cols-[1fr_220px] min-[37.5625rem]:items-end min-[37.5625rem]:gap-[30px] min-[56.3125rem]:grid-cols-[1fr_230px] min-[56.3125rem]:gap-10 min-[56.3125rem]:pt-[45px] min-[56.3125rem]:pb-[50px] min-[68.8125rem]:grid-cols-[1fr_270px] min-[68.8125rem]:gap-16",
  heroTitle: "m-0 font-[family-name:var(--font-heading)] text-[clamp(53px,12.7vw,75px)] leading-[0.96] font-semibold tracking-[-0.07em] min-[37.5625rem]:text-[clamp(48px,8.5vw,72px)] min-[56.3125rem]:text-[clamp(65px,8vw,94px)] min-[68.8125rem]:text-[clamp(72px,8vw,116px)]",
  heroLine: "mb-[-0.1em] block overflow-clip pt-[0.06em] pb-[0.13em]",
  heroOutline: "text-transparent [-webkit-text-stroke:1px_#a9cfdf99]",
  heroAccent: "text-[var(--blue-light)]",
  letterGroup: "whitespace-nowrap",
  letter: "inline-block",
  introAside: "grid grid-cols-[30px_1fr] gap-x-[17px] gap-y-2.5 pt-[26px] pb-2 [&>svg]:mt-0.5 [&>svg]:size-[30px] [&>svg]:text-[var(--blue-light)] [&>p]:m-0 [&>p]:max-w-[290px] [&>p]:text-[13px] [&>p]:leading-[1.8] [&>p]:text-[var(--muted)] min-[37.5625rem]:block min-[37.5625rem]:pt-0 min-[37.5625rem]:[&>svg]:mt-0 min-[37.5625rem]:[&>svg]:mb-3 min-[37.5625rem]:[&>p]:mb-[18px] min-[37.5625rem]:[&>p]:max-w-[250px] min-[56.3125rem]:[&>svg]:mb-5 min-[56.3125rem]:[&>svg]:size-10 min-[56.3125rem]:[&>p]:mb-9 min-[56.3125rem]:[&>p]:text-[15px] min-[68.8125rem]:[&>p]:text-[17px]",
  scrollCue: "col-start-2 mt-[5px] flex max-w-[290px] items-center justify-between gap-3.5 border-b border-[var(--line-strong)] py-3.5 font-mono text-[8px] tracking-[0.06em] text-[var(--blue-light)]! focus-visible:outline-2 focus-visible:outline-offset-[5px] focus-visible:outline-[var(--blue-light)]! [&>svg]:transition-transform [&>svg]:duration-300 hover:[&>svg]:translate-y-1 motion-reduce:[&>svg]:transition-none min-[37.5625rem]:mt-0 min-[37.5625rem]:max-w-none min-[37.5625rem]:text-[7px] min-[56.3125rem]:text-[9px]",
  introRule: "flex flex-wrap items-center justify-between gap-3 border-y border-[var(--line)] py-[17px] font-mono text-[7px] tracking-[0.06em] text-[var(--muted)] [&>span:nth-child(2)]:hidden [&>span:nth-child(2)]:text-[var(--blue-light)] min-[37.5625rem]:flex-nowrap min-[37.5625rem]:gap-[18px] min-[37.5625rem]:py-[22px] min-[37.5625rem]:[&>span:nth-child(2)]:inline min-[56.3125rem]:text-[13px]",
  mobileNav: "sticky top-[60px] z-20 mt-5 grid grid-cols-4 gap-2 bg-[#020817e8] py-[15px] font-mono backdrop-blur-[14px] min-[37.5625rem]:top-[65px] min-[37.5625rem]:gap-3 min-[56.3125rem]:hidden [&>a]:flex [&>a]:items-center [&>a]:gap-[5px] [&>a]:border-b [&>a]:border-[var(--line)] [&>a]:py-2.5 [&>a]:text-[9px] [&>a]:whitespace-nowrap [&>a]:text-[var(--muted)]! [&>a]:transition-[color,border-color] [&>a]:duration-[250ms] [&>a>span]:text-[7px] [&>a>span]:opacity-50 [&>a[aria-current]]:border-[var(--blue)] [&>a[aria-current]]:text-[var(--blue-light)]! [&>a:focus-visible]:outline-2 [&>a:focus-visible]:outline-offset-[5px] [&>a:focus-visible]:outline-[var(--blue-light)]! motion-reduce:[&>a]:transition-none min-[37.5625rem]:[&>a]:gap-[7px] min-[37.5625rem]:[&>a]:text-[10px]",
  journey: "relative block pt-7 min-[56.3125rem]:grid min-[56.3125rem]:grid-cols-[42%_minmax(0,1fr)] min-[56.3125rem]:items-start min-[56.3125rem]:gap-[45px] min-[56.3125rem]:pt-16 min-[68.8125rem]:grid-cols-[43%_minmax(0,1fr)] min-[68.8125rem]:gap-20",
  stickyStage: "group/stage sticky top-[100px] hidden h-[calc(100svh-150px)] min-h-[510px] max-h-[740px] flex-col min-[56.3125rem]:flex",
  stageTop: "flex justify-between gap-4 text-[11px] tracking-[0.08em] text-[var(--muted)] [&>span:last-child]:text-[var(--blue-light)]",
  sculpture: "relative min-h-[300px] flex-1 text-[var(--blue-light)] transition-colors duration-[800ms] group-data-[phase=2]/stage:text-[#c2bcd9] group-data-[phase=3]/stage:text-[#c2f5ff] motion-reduce:transition-none",
  sculptureGlow: "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_52%,#1abaff12,transparent_65%)]",
  mesh: "absolute inset-0 h-full w-full overflow-visible stroke-[0.8]",
  meshRim: "stroke-[1.4]",
  meshParticles: "fill-[var(--blue-light)] [filter:drop-shadow(0_0_5px_#1abaffcc)]",
  meshGuides: "fill-none stroke-[#9de4ff33] stroke-[0.6]",
  sculptureNumber: "pointer-events-none absolute inset-0 flex flex-col items-center justify-center [&>span:first-child]:pr-[0.07em] [&>span:first-child]:font-[family-name:var(--font-heading)] [&>span:first-child]:text-[clamp(130px,15vw,210px)] [&>span:first-child]:leading-[0.95] [&>span:first-child]:font-medium [&>span:first-child]:tracking-[-0.095em] [&>span:first-child]:text-[#020817d9] [&>span:first-child]:[-webkit-text-stroke:1px_#1abaff] [&>span:first-child]:[text-shadow:0_0_45px_#020817] [&>span:last-child]:mt-5 [&>span:last-child]:font-mono [&>span:last-child]:text-[8px] [&>span:last-child]:leading-normal [&>span:last-child]:tracking-[0.2em] [&>span:last-child]:text-[var(--blue-light)]",
  sculptureAnnotation: "absolute font-mono text-[8px] tracking-[0.08em] text-[var(--muted)]",
  annotationTop: "top-[15%] left-[6%]",
  annotationBottom: "right-[4%] bottom-[16%]",
  stageCaption: "mt-2.5 flex flex-wrap justify-between gap-2.5 border-b border-[var(--line)] pb-5 text-[8px] text-[var(--blue-light)] [&>span:last-child]:text-[var(--muted)] min-[68.8125rem]:text-[12px]",
  chapterLinks: "relative mt-[22px] grid grid-cols-4 gap-[9px] min-[68.8125rem]:gap-[13px] [&>a]:relative [&>a]:flex [&>a]:flex-col [&>a]:gap-2 [&>a]:border-b [&>a]:border-transparent [&>a]:pb-2.5 [&>a]:text-[9px] [&>a]:text-[var(--muted)]! [&>a]:transition-colors [&>a]:duration-[250ms] min-[68.8125rem]:[&>a]:text-[16px] [&>a>span]:text-[13px] [&>a>span]:opacity-55 [&>a>svg]:absolute [&>a>svg]:top-0 [&>a>svg]:right-[3px] [&>a>svg]:opacity-0 [&>a>svg]:transition-opacity [&>a>svg]:duration-[250ms] [&>a:hover]:text-[var(--blue-light)]! [&>a[aria-current]]:text-[var(--blue-light)]! [&>a:hover>svg]:opacity-100 [&>a[aria-current]>svg]:opacity-100 [&>a[aria-current]>span]:opacity-100 [&>a:focus-visible]:outline-2 [&>a:focus-visible]:outline-offset-[5px] [&>a:focus-visible]:outline-[var(--blue-light)]! motion-reduce:[&>a]:transition-none",
  stageNote: "mt-[23px] mb-0 font-mono text-[9px] leading-[1.8] text-[var(--muted)] opacity-70",
  chapterStream: "relative min-w-0",
  journeyTrack: "absolute top-[43px] bottom-[95px] left-0 w-px bg-[var(--line)] [&>span]:block [&>span]:h-full [&>span]:w-full [&>span]:origin-top [&>span]:bg-[var(--line-strong)] min-[56.3125rem]:top-8 min-[56.3125rem]:bottom-[65px] min-[56.3125rem]:[&>span]:bg-[linear-gradient(var(--blue),var(--blue-light))]",
  chapter: "relative min-h-0 scroll-mt-[150px]! pt-[45px] pb-[75px] pl-[23px] before:absolute before:top-[45px] before:left-[-5px] before:size-[11px] before:rounded-full before:border before:border-[var(--blue-light)] before:bg-[var(--ink)] before:shadow-[0_0_18px_#1abaff22] before:content-[''] min-[37.5625rem]:pb-[100px] min-[37.5625rem]:pl-8 min-[56.3125rem]:min-h-[85svh] min-[56.3125rem]:scroll-mt-[100px]! min-[56.3125rem]:pt-[38px] min-[56.3125rem]:pb-[110px] min-[56.3125rem]:pl-[27px] min-[56.3125rem]:first-of-type:min-h-[80svh] min-[56.3125rem]:before:top-[38px] min-[68.8125rem]:pl-9",
  chapterMeta: "flex flex-col gap-[7px] text-[9px] leading-[1.7] tracking-[0.045em] text-[var(--muted)] uppercase [&>span:first-child]:text-[var(--blue-light)] [&_span_span]:mx-1 [&_span_span]:opacity-40 min-[37.5625rem]:gap-2.5 min-[37.5625rem]:text-[18px] min-[37.5625rem]:[&_span_span]:mx-[7px] min-[56.3125rem]:text-[10px]",
  chapterTitle: "mt-[23px] mb-[18px] overflow-clip pt-1.5 pb-2 font-[family-name:var(--font-heading)] text-[clamp(48px,12vw,72px)] leading-[1.03] font-medium tracking-[-0.075em] whitespace-nowrap min-[37.5625rem]:mt-7 min-[37.5625rem]:text-[clamp(58px,11vw,88px)] min-[56.3125rem]:text-[clamp(52px,6vw,72px)] min-[68.8125rem]:text-[clamp(54px,6.1vw,90px)]",
  chapterOutline: "text-transparent [-webkit-text-stroke:1px_#c4d7e4cc]",
  titleDot: "text-[var(--blue)] [-webkit-text-stroke:0]",
  chapterCopy: "mt-0 mb-[25px] max-w-[480px] text-[12px] leading-[1.9] text-[var(--muted)] min-[37.5625rem]:mb-[35px] min-[37.5625rem]:text-[14px] min-[56.3125rem]:max-w-[440px]",
  milestones: "m-0 list-none p-0",
  milestone: "relative p-0 before:absolute before:top-[26px] before:left-[-25px] before:size-[5px] before:rounded-full before:bg-[var(--blue)] before:shadow-[0_0_9px_#1abaff66] before:content-[''] min-[37.5625rem]:before:top-[30px] min-[37.5625rem]:before:left-[-34px] min-[56.3125rem]:before:top-[27px] min-[56.3125rem]:before:left-[-29px] min-[68.8125rem]:before:left-[-38px] data-[kind=break]:before:border data-[kind=break]:before:border-[#9cbad177] data-[kind=break]:before:bg-[var(--ink)] data-[kind=break]:before:shadow-none data-[kind=red]:before:top-16 data-[kind=black]:before:top-16 data-[kind=red]:before:bg-[#ff9caa] data-[kind=black]:before:bg-[#ff9caa] data-[kind=red]:before:shadow-[0_0_13px_#ff7b9944] data-[kind=black]:before:shadow-[0_0_13px_#ff7b9944] min-[37.5625rem]:data-[kind=red]:before:top-[72px] min-[37.5625rem]:data-[kind=black]:before:top-[72px] min-[56.3125rem]:data-[kind=red]:before:top-[61px] min-[56.3125rem]:data-[kind=black]:before:top-[61px] data-[kind=finish]:before:size-[7px] data-[kind=finish]:before:left-[-26px] data-[kind=finish]:before:bg-[var(--blue-light)] min-[37.5625rem]:data-[kind=finish]:before:left-[-35px] min-[56.3125rem]:data-[kind=finish]:before:left-[-30px] min-[68.8125rem]:data-[kind=finish]:before:left-[-39px]",
  event: "grid grid-cols-[1fr_18px] gap-x-3 gap-y-[5px] py-[19px] min-[37.5625rem]:gap-x-[15px] min-[37.5625rem]:py-[23px] min-[56.3125rem]:py-5 group-data-[kind=break]/point:py-[15px] group-data-[kind=finish]/point:mt-2.5 [&>svg]:col-start-2 [&>svg]:row-span-2 [&>svg]:row-start-1 [&>svg]:self-center [&>svg]:text-[var(--muted)] group-data-[kind=finish]/point:[&>svg]:text-[var(--blue-light)]",
  eventTime: "col-start-1 block text-[12px] leading-[1.6] text-[var(--blue-light)] min-[37.5625rem]:text-[13px] min-[56.3125rem]:text-[18px] group-data-[kind=break]/point:text-[11px] group-data-[kind=break]/point:text-[#9cbad1b3]",
  eventName: "col-start-1 block font-[family-name:var(--font-heading)] text-[18px] leading-[1.45] tracking-[-0.02em] min-[37.5625rem]:text-[20px] min-[56.3125rem]:text-[19px] group-data-[kind=break]/point:font-[family-name:var(--font-body)] group-data-[kind=break]/point:text-[12px] group-data-[kind=break]/point:font-normal group-data-[kind=break]/point:tracking-normal group-data-[kind=break]/point:text-[var(--muted)] group-data-[kind=finish]/point:text-[var(--blue-light)]",
  dayChange: "mt-3 mb-1 flex items-center gap-2 border-t border-dashed border-[var(--line)] pt-3.5 font-mono text-[9px] tracking-[0.03em] text-[var(--blue-light)] uppercase min-[37.5625rem]:text-[10px]",
  envelopeMoment: "group/envelope relative mt-1 mb-2.5 grid grid-cols-[83px_minmax(0,1fr)] items-center gap-[17px] pt-5 pb-[34px] after:absolute after:right-0 after:bottom-2.5 after:left-0 after:h-px after:bg-[linear-gradient(90deg,#ef6e8f66,transparent_85%)] after:content-[''] data-[black=true]:after:bg-[linear-gradient(90deg,#a0b1ca66,transparent_85%)] min-[37.5625rem]:grid-cols-[125px_minmax(0,1fr)] min-[37.5625rem]:gap-[25px] min-[37.5625rem]:pt-[26px] min-[56.3125rem]:grid-cols-[100px_minmax(0,1fr)] min-[56.3125rem]:gap-3.5 min-[68.8125rem]:grid-cols-[120px_minmax(0,1fr)] min-[68.8125rem]:gap-[22px]",
  envelopeCopy: "flex flex-col gap-[7px] min-[37.5625rem]:gap-[9px] [&>[data-event-time]]:text-[#ff9caa] group-data-[black=true]/envelope:[&>[data-event-time]]:text-[#c0cddd] [&>[data-event-name]]:text-[19px] [&>[data-event-name]]:leading-[1.3] min-[37.5625rem]:[&>[data-event-name]]:text-[25px] min-[56.3125rem]:[&>[data-event-name]]:text-[20px] min-[68.8125rem]:[&>[data-event-name]]:text-[23px]",
  envelopeEyebrow: "font-mono text-[6px] tracking-[0.08em] text-[#ff9caa] group-data-[black=true]/envelope:text-[#c0cddd] min-[37.5625rem]:text-[8px] min-[37.5625rem]:tracking-[0.12em] min-[56.3125rem]:text-[7px]",
  envelope: "relative h-[140px] w-[83px] origin-left scale-[0.7] [--envelope-edge:#f18b9f] [--envelope-back:#451326] [--envelope-flap:#a43b59] [--envelope-light:#b74963] [--envelope-dark:#58192d] [--envelope-paper:#ffe9e6] [--envelope-paper-ink:#6c263b] data-[black=true]:[--envelope-edge:#7e8797] data-[black=true]:[--envelope-back:#090d14] data-[black=true]:[--envelope-flap:#292f3a] data-[black=true]:[--envelope-light:#343b47] data-[black=true]:[--envelope-dark:#10151e] data-[black=true]:[--envelope-paper:#e1e5ed] data-[black=true]:[--envelope-paper-ink:#202735] min-[37.5625rem]:w-[120px] min-[37.5625rem]:scale-100 min-[56.3125rem]:w-[100px] min-[56.3125rem]:scale-[0.85] min-[68.8125rem]:w-[120px] min-[68.8125rem]:scale-100",
  envelopeHalo: "pointer-events-none absolute -inset-10 bg-[radial-gradient(ellipse,#bd2f5e25,transparent_65%)] group-data-[black=true]/envelope:bg-[radial-gradient(ellipse,#7e9cc22b,transparent_65%)]",
  envelopeObject: "absolute top-0 left-0 h-[140px] w-[116px] origin-[50%_70%] overflow-visible [transform:rotate(-6deg)]",
  envelopeGradientLight: "[stop-color:var(--envelope-light)]",
  envelopeGradientDark: "[stop-color:var(--envelope-dark)]",
  envelopeBack: "fill-[var(--envelope-back)] stroke-[var(--envelope-edge)] stroke-[0.8]",
  envelopeLetter: "fill-[var(--envelope-paper)] stroke-[var(--envelope-edge)] stroke-[0.5]",
  envelopeLetterNumber: "fill-[var(--envelope-paper-ink)] font-[family-name:var(--font-heading)] text-[23px] leading-normal",
  envelopeLetterLabel: "fill-[var(--envelope-paper-ink)] font-mono text-[7px] leading-normal tracking-[0.6px]",
  envelopeFlapBack: "fill-[var(--envelope-flap)] stroke-[var(--envelope-edge)] stroke-[0.8] [stroke-linejoin:round]",
  envelopeFlap: "fill-[var(--envelope-flap)] stroke-[var(--envelope-edge)] stroke-[0.8] [stroke-linejoin:round]",
  envelopeFront: "stroke-[var(--envelope-edge)] stroke-[0.8] [stroke-linejoin:round]",
  envelopeCreases: "fill-none stroke-[var(--envelope-edge)] stroke-[0.5] opacity-45",
  envelopeSeal: "fill-[var(--envelope-dark)] stroke-[var(--envelope-edge)] stroke-[0.5]",
  envelopeMonogram: "fill-[var(--envelope-paper)] stroke-none font-mono text-[5px] leading-normal",
  chapterEnd: "relative mt-[35px] pt-[17px] font-sans text-[6px] tracking-[0.02em] text-white [&>span]:absolute [&>span]:inset-x-0 [&>span]:top-0 [&>span]:h-px [&>span]:bg-[var(--line-strong)] [&>p]:m-0 [&>p]:flex [&>p]:items-center [&>p]:justify-between [&>p]:gap-5 [&_svg]:shrink-0 [&_svg]:text-[var(--blue-light)] min-[37.5625rem]:text-[10px] min-[37.5625rem]:tracking-[0.06em]",
  outro: "border-t border-[var(--line)] pt-10 pb-[15px] text-center min-[56.3125rem]:pt-[60px] [&>p]:my-[26px] [&>p]:font-[family-name:var(--font-heading)] [&>p]:text-[clamp(20px,5vw,30px)] [&>p]:leading-[1.25] [&>p]:font-medium [&>p]:tracking-[-0.06em] min-[37.5625rem]:[&>p]:text-[clamp(23px,4.4vw,58px)] [&>span:last-child]:font-mono [&>span:last-child]:text-[6px] [&>span:last-child]:leading-[1.8] [&>span:last-child]:tracking-[0.06em] [&>span:last-child]:text-[var(--muted)] min-[37.5625rem]:[&>span:last-child]:text-[8px] min-[37.5625rem]:[&>span:last-child]:leading-normal",
  outroLabel: "font-mono text-[8px] tracking-[0.1em] text-[var(--blue-light)] min-[37.5625rem]:text-[10px]",
  outroAccent: "text-[var(--blue-light)]",
} as const;

type Checkpoint = {
  time: string;
  title: string;
  kind?: "red" | "black" | "break" | "finish";
  date?: string;
};

type Chapter = {
  name: string;
  eyebrow: string;
  title: string;
  description: string;
  date: string;
  hours: string;
  from: number;
  to: number;
  checkpoints: Checkpoint[];
};

const chapters: Chapter[] = [
  {
    name: "Check in",
    eyebrow: "Before the first pixel",
    title: "Meet your blank canvas.",
    description: "Find your team. Settle in. Get ready to turn a fresh brief into something worth feeling.",
    date: "10 October 2026",
    hours: "PRE-SPRINT / 9–11 AM",
    from: 0,
    to: 0,
    checkpoints: [
      { time: "9:00–10:00 AM", title: "Registration & team confirmation" },
      { time: "10:00–11:00 AM", title: "Inauguration & briefing" },
    ],
  },
  {
    name: "Create",
    eyebrow: "From question to prototype",
    title: "Make the first move.",
    description: "Unpack the problem. Connect the dots. Give your ideas an interface, one intentional decision at a time.",
    date: "10 October 2026",
    hours: "HOUR 00–11 / THE BUILD",
    from: 0,
    to: 11,
    checkpoints: [
      { time: "11:00 AM", title: "Hackathon begins & Red Envelope distribution", kind: "red" },
      { time: "11:00 AM–1:00 PM", title: "Discover & define" },
      { time: "1:00–2:00 PM", title: "Lunch", kind: "break" },
      { time: "2:00–4:00 PM", title: "Ideation & user flow" },
      { time: "4:00–8:30 PM", title: "UI design & prototyping" },
      { time: "8:30–9:30 PM", title: "Dinner break", kind: "break" },
      { time: "9:30–10:00 PM", title: "Initial design review" },
    ],
  },
  {
    name: "Rethink",
    eyebrow: "A new turn after dark",
    title: "The plot gets a twist.",
    description: "The Black Envelope enters the story. Revisit your decisions and find the next version of your idea.",
    date: "10–11 October 2026",
    hours: "HOUR 11–17.5 / THE SHIFT",
    from: 11,
    to: 17.5,
    checkpoints: [
      { time: "10:00 PM", title: "Black Envelope reveal", kind: "black" },
      { time: "10:15 PM onwards", title: "Adaptation & redesign" },
      { time: "1:00–1:30 AM", title: "Refreshment break", kind: "break", date: "11 October · After midnight" },
      { time: "1:30–4:00 AM", title: "UI/UX redesign" },
      { time: "4:00–4:30 AM", title: "Refreshment break", kind: "break" },
    ],
  },
  {
    name: "Deliver",
    eyebrow: "From prototype to possibility",
    title: "Make every pixel count.",
    description: "Refine the details. Put the experience to the test. Then let your design do the talking.",
    date: "11 October 2026",
    hours: "HOUR 17.5–24 / THE FINISH",
    from: 17.5,
    to: 24,
    checkpoints: [
      { time: "4:30–7:00 AM", title: "High-fidelity design & interaction" },
      { time: "7:00–8:00 AM", title: "Testing & refinement" },
      { time: "8:00–11:00 AM", title: "Breakfast / Final presentation (parallel)" },
      { time: "11:00 AM", title: "Conclusion", kind: "finish" },
    ],
  },
];



const phaseTimes = ["9 AM — 11 AM", "11 AM — 10 PM", "10 PM — 4:30 AM", "4:30 AM — 11 AM"];
const phaseNotes = ["Before the clock starts", "The first eleven hours", "A new direction after dark", "The final stretch"];
const heroLines = ["24 HOURS.", "ONE WILD", "JOURNEY."];

function FloatLetters({ text }: { text: string }) {
  // Inspired by React Bits Scroll Float: keep real text accessible and animate
  // separate glyphs without modifying React's DOM or using a split-text plugin.
  return (
    <span aria-label={text}>
      <span aria-hidden="true" className={scheduleClasses.letterGroup}>
        {Array.from(text).map((letter, index) => (
          <span key={index} data-letter className={scheduleClasses.letter}>{letter === " " ? "\u00a0" : letter}</span>
        ))}
      </span>
    </span>
  );
}

function DesignContinuum() {
  const gradient = useId().replace(/:/g, "");
  return (
    <div className={scheduleClasses.sculpture} aria-hidden="true">
      <div className={scheduleClasses.sculptureGlow} />
      <svg viewBox="0 0 560 560" className={scheduleClasses.mesh}>
        <defs>
          <linearGradient id={gradient} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity=".12" />
            <stop offset=".4" stopColor="currentColor" stopOpacity=".9" />
            <stop offset="1" stopColor="currentColor" stopOpacity=".18" />
          </linearGradient>
        </defs>
        <g data-sculpture-turn stroke={`url(#${gradient})`} fill="none">
          {Array.from({ length: 32 }, (_, index) => {
            const angle = index / 32 * Math.PI * 2;
            const topX = 280 + 175 * Math.cos(angle);
            const topY = 90 + 51 * Math.sin(angle);
            const waistX = 280 + 45 * Math.cos(angle);
            const waistY = 280 + 13 * Math.sin(angle);
            const bottomX = 280 + 175 * Math.cos(angle);
            const bottomY = 465 + 51 * Math.sin(angle);
            return <path key={index} data-mesh-line pathLength="1" d={`M${topX} ${topY} C${topX} ${topY + 98},${waistX} 217,${waistX} ${waistY} C${waistX} 343,${bottomX} ${bottomY - 98},${bottomX} ${bottomY}`} />;
          })}
          {Array.from({ length: 17 }, (_, index) => {
            const y = 90 + index / 16 * 375;
            const radius = 45 + 130 * Math.pow(Math.abs((y - 277.5) / 187.5), 1.4);
            return <ellipse key={index} data-mesh-line pathLength="1" cx="280" cy={y} rx={radius} ry={radius * .29} />;
          })}
          <ellipse cx="280" cy="90" rx="175" ry="51" className={scheduleClasses.meshRim} />
          <ellipse cx="280" cy="465" rx="175" ry="51" className={scheduleClasses.meshRim} />
        </g>
        <g className={scheduleClasses.meshParticles}>
          <circle data-particle cx="126" cy="173" r="3" />
          <circle data-particle cx="428" cy="396" r="3" />
          <circle data-particle cx="191" cy="420" r="2" />
          <circle data-particle cx="389" cy="115" r="2" />
        </g>
        <path d="M64 280h43M453 280h43M280 25v25M280 510v25" className={scheduleClasses.meshGuides} />
      </svg>
      <div className={scheduleClasses.sculptureNumber}><span>24</span><span>HOURS TO MAKE IT COUNT</span></div>
      </div>
  );
}

function Envelope({ black = false }: { black?: boolean }) {
  const gradient = useId().replace(/:/g, "");
  return (
    <div className={scheduleClasses.envelope} data-black={black} aria-hidden="true">
      <div className={scheduleClasses.envelopeHalo} />
      <svg className={scheduleClasses.envelopeObject} data-envelope-object viewBox="0 0 132 160">
        <defs>
          <linearGradient id={gradient} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" className={scheduleClasses.envelopeGradientLight} />
            <stop offset="1" className={scheduleClasses.envelopeGradientDark} />
          </linearGradient>
        </defs>
        {/* SVG paint order keeps the opened flap behind the letter and the
            pocket in front of it throughout both directions of the scroll. */}
        <g transform="translate(66 72)">
          <path className={scheduleClasses.envelopeFlapBack} data-envelope-flap-back transform="scale(1 0)" d="M-56 0 0-43 56 0Z" />
        </g>
        <rect className={scheduleClasses.envelopeBack} x="10" y="72" width="112" height="76" rx="3" />
        <g data-envelope-letter>
          <rect className={scheduleClasses.envelopeLetter} x="20" y="80" width="92" height="60" rx="2" />
          <text className={scheduleClasses.envelopeLetterNumber} x="30" y="104">0{black ? "2" : "1"}</text>
          <text className={scheduleClasses.envelopeLetterLabel} x="30" y="119">{black ? "RETHINK." : "BEGIN."}</text>
        </g>
        <path className={scheduleClasses.envelopeFront} fill={`url(#${gradient})`} d="M10 72 66 113 122 72V145Q122 148 119 148H13Q10 148 10 145Z" />
        <path className={scheduleClasses.envelopeCreases} d="M10 148 47 111M122 148 85 111" />
        <g transform="translate(66 72)">
          <g className={scheduleClasses.envelopeFlap} data-envelope-flap>
            <path d="M-56 0H56L0 43Z" />
            <circle className={scheduleClasses.envelopeSeal} cx="0" cy="31" r="8" />
            <text className={scheduleClasses.envelopeMonogram} x="0" y="33" textAnchor="middle">D&apos;V</text>
          </g>
        </g>
      </svg>
    </div>
  );
}

export default function Schedule() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const activeRef = useRef(0);
  const chapterLinksRef = useRef<HTMLElement>(null);
  const activeLineRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const nav = chapterLinksRef.current;
    const line = activeLineRef.current;
    const link = nav?.querySelector<HTMLAnchorElement>(
      `a[href="#schedule-chapter-${active}"]`,
    );
    if (!nav || !line || !link) return;

    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    gsap.to(line, {
      x: linkRect.left - navRect.left,
      width: linkRect.width,
      duration: 0.45,
      ease: "power3.out",
      overwrite: true,
    });

    const handleResize = () => {
      const nextNavRect = nav.getBoundingClientRect();
      const nextLinkRect = link.getBoundingClientRect();
      gsap.set(line, {
        x: nextLinkRect.left - nextNavRect.left,
        width: nextLinkRect.width,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      gsap.killTweensOf(line);
    };
  }, [active]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = sectionRef.current;
    if (!root) return;
    const media = gsap.matchMedia();
    const articles = Array.from(root.querySelectorAll<HTMLElement>("[data-chapter]"));

    // Track the section in every motion mode. No tabs hide schedule content.
    const stateContext = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root.querySelector("[data-journey]"),
        start: "top 55%",
        end: "bottom 55%",
        onUpdate: () => {
          let next = 0;
          articles.forEach((article, index) => {
            if (article.getBoundingClientRect().top < window.innerHeight * .55) next = index;
          });
          if (activeRef.current !== next) {
            activeRef.current = next;
            setActive(next);
          }
        },
      });
    }, root);

    media.add("(prefers-reduced-motion: no-preference)", () => {
      // Scroll Float / Scroll Reveal ideas, scoped to this section so cleanup
      // never kills animations belonging to the rest of the site.
      root.querySelectorAll<HTMLElement>("[data-float-heading]").forEach((heading) => {
        gsap.fromTo(heading.querySelectorAll("[data-letter]"),
          { yPercent: 75, scaleY: 1.35, scaleX: .85, opacity: .12, transformOrigin: "50% 100%" },
          { yPercent: 0, scaleY: 1, scaleX: 1, opacity: 1, stagger: .028, ease: "power2.out",
            scrollTrigger: { trigger: heading, start: "top 95%", end: "top 52%", scrub: .8 } },
        );
      });

      root.querySelectorAll<HTMLElement>("[data-scroll-copy]").forEach((copy) => {
        gsap.fromTo(copy.querySelectorAll("[data-word]"), { opacity: .2 },
          { opacity: 1, stagger: .06, ease: "none",
            scrollTrigger: { trigger: copy, start: "top 90%", end: "top 67%", scrub: .5 } },
        );
      });

      root.querySelectorAll<HTMLElement>("[data-milestone]").forEach((point) => {
        gsap.fromTo(point, { y: 24, opacity: .15 },
          { y: 0, opacity: 1, ease: "power2.out",
            scrollTrigger: { trigger: point, start: "top 96%", end: "top 76%", scrub: .5 } },
        );
      });

      root.querySelectorAll<HTMLElement>("[data-envelope-reveal]").forEach((point) => {
        gsap.timeline({ scrollTrigger: { trigger: point, start: "top 88%", end: "top 48%", scrub: 1 } })
          .fromTo(point.querySelector("[data-envelope-object]"), { rotation: -12, y: 12 }, { rotation: -6, y: 0, duration: 1.3, ease: "none" }, 0)
          // Two faces share the exact hinge. Fold the front to the edge, then
          // unfold the reverse face behind the pocket before lifting the paper.
          .fromTo(point.querySelector("[data-envelope-flap]"),
            { scaleY: 1, svgOrigin: "0 0", smoothOrigin: false }, { scaleY: 0, duration: .3, ease: "sine.in" }, .1)
          .fromTo(point.querySelector("[data-envelope-flap-back]"),
            { scaleY: 0, svgOrigin: "0 0", smoothOrigin: false }, { scaleY: 1, duration: .3, ease: "sine.out" }, .4)
          .fromTo(point.querySelector("[data-envelope-letter]"),
            { y: 0 }, { y: -36, duration: .55, ease: "power2.out" }, .75);
      });

      root.querySelectorAll<HTMLElement>("[data-chapter-line]").forEach((line) => {
        gsap.fromTo(line, { scaleX: 0 },
          { scaleX: 1, transformOrigin: "left", ease: "none",
            scrollTrigger: { trigger: line.parentElement, start: "top 80%", end: "bottom 70%", scrub: .5 } },
        );
      });
    }, root);

    media.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
      const journey = root.querySelector("[data-journey]");
      gsap.fromTo("[data-sculpture-turn]", { rotation: 16, scale: .92, svgOrigin: "280 280" },
        { rotation: -22, scale: 1.08, ease: "none",
          scrollTrigger: { trigger: journey, start: "top 60%", end: "bottom bottom", scrub: 1.2 } },
      );
      gsap.fromTo("[data-mesh-line]", { strokeDasharray: 1, strokeDashoffset: 1 },
        { strokeDashoffset: 0, stagger: .015, ease: "none",
          scrollTrigger: { trigger: journey, start: "top 92%", end: "top 30%", scrub: 1 } },
      );
      gsap.to("[data-particle]", {
        y: (index) => index % 2 ? -65 : 65, x: (index) => index % 2 ? 24 : -24, stagger: .05, ease: "none",
        scrollTrigger: { trigger: journey, start: "top bottom", end: "bottom top", scrub: 1.5 },
      });
      gsap.fromTo("[data-journey-progress]", { scaleY: 0 },
        { scaleY: 1, ease: "none",
          scrollTrigger: { trigger: journey, start: "top 55%", end: "bottom 55%", scrub: .5 } },
      );
    }, root);

    // Font loading and the site's intro can change initial measurements.
    let cancelled = false;
    document.fonts.ready.then(() => { if (!cancelled) ScrollTrigger.refresh(); });
    return () => {
      cancelled = true;
      media.revert();
      stateContext.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="schedule" aria-labelledby="schedule-title" className={scheduleClasses.section}>
      <div className={scheduleClasses.container}>
        <header>
          {/* <div className={scheduleClasses.kicker}><span>THE EVENT STRUCTURE</span><span>10 — 11 OCTOBER 2026 / IST</span></div> */}
          <div className={scheduleClasses.introGrid}>
            <h2 id="schedule-title" className={scheduleClasses.heroTitle}>
              {heroLines.map((line, index) => (
                <span key={line} data-float-heading className={`${scheduleClasses.heroLine} ${index === 0 ? scheduleClasses.heroOutline : ""} ${index === 2 ? scheduleClasses.heroAccent : ""}`}><FloatLetters text={line} /></span>
              ))}
            </h2>
            <div className={scheduleClasses.introAside}>
              <ArrowDownRight size={40} strokeWidth={1} aria-hidden="true" />
              <p data-scroll-copy>{"A blank canvas. Two envelopes. A whole new perspective by morning.".split(" ").map((word, index) => <span data-word key={index}>{word} </span>)}</p>
              <a href="#schedule-chapter-0" className={scheduleClasses.scrollCue}><span>SCROLL THROUGH THE SPRINT</span><ArrowDown size={15} aria-hidden="true" /></a>
            </div>
          </div>
          <div className={scheduleClasses.introRule}><span>FROM 11 AM TO 11 AM</span><span>24H UI/UX HACKATHON</span><span>CHECK-IN OPENS AT 9 AM</span></div>
        </header>

        <nav className={scheduleClasses.mobileNav} aria-label="Jump to a schedule chapter">
          {chapters.map((chapter, index) => <a key={chapter.name} href={`#schedule-chapter-${index}`} aria-current={active === index ? "step" : undefined}><span>0{index + 1}</span>{chapter.name}</a>)}
        </nav>

        <div className={scheduleClasses.journey} data-journey>
          <aside className={scheduleClasses.stickyStage} data-phase={active} aria-label="Design journey progress">
            <div className={scheduleClasses.stageTop}><span>THE DESIGN CONTINUUM</span><span>0{active + 1} / 04</span></div>
            <DesignContinuum />
            <div className={scheduleClasses.stageCaption}><span>{phaseNotes[active]}</span><span>{phaseTimes[active]}</span></div>
            <nav ref={chapterLinksRef} className={scheduleClasses.chapterLinks} aria-label="Jump to a schedule chapter">
              <span
                ref={activeLineRef}
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-[var(--blue)]"
              />
              {chapters.map((chapter, index) => <a key={chapter.name} href={`#schedule-chapter-${index}`} aria-current={active === index ? "step" : undefined}><span>0{index + 1}</span>{chapter.name}<ArrowUpRight size={12} aria-hidden="true" /></a>)}
            </nav>
           
          </aside>

          <div className={scheduleClasses.chapterStream}>
            <div className={scheduleClasses.journeyTrack} aria-hidden="true"><span data-journey-progress /></div>
            {chapters.map((chapter, chapterIndex) => (
              <article id={`schedule-chapter-${chapterIndex}`} key={chapter.name} data-chapter aria-labelledby={`chapter-title-${chapterIndex}`} className={scheduleClasses.chapter}>
                <div className={scheduleClasses.chapterMeta}><span>CHAPTER 0{chapterIndex + 1} <span>/</span> {chapter.eyebrow}</span><span>{chapter.date}</span></div>
                <h3 id={`chapter-title-${chapterIndex}`} data-float-heading className={`${scheduleClasses.chapterTitle} ${chapterIndex === 2 ? scheduleClasses.chapterOutline : ""}`}><FloatLetters text={chapter.name.toUpperCase()} /><span className={scheduleClasses.titleDot}>.</span></h3>
                <p className={scheduleClasses.chapterCopy} data-scroll-copy>{chapter.description.split(" ").map((word, index) => <span data-word key={index}>{word} </span>)}</p>
                <ol className={scheduleClasses.milestones}>
                  {chapter.checkpoints.map((point) => {
                    const envelope = point.kind === "red" || point.kind === "black";
                    return (
                      <li key={`${point.time}-${point.title}`} data-milestone data-kind={point.kind} className={`group/point ${scheduleClasses.milestone}`}>
                        {point.date && <p className={scheduleClasses.dayChange}><Moon size={12} aria-hidden="true" />{point.date}</p>}
                        {envelope ? (
                          <div data-envelope-reveal data-black={point.kind === "black"} className={scheduleClasses.envelopeMoment}>
                            <Envelope black={point.kind === "black"} />
                            <div className={scheduleClasses.envelopeCopy}><span data-event-time className={scheduleClasses.eventTime}>{point.time}</span><span className={scheduleClasses.envelopeEyebrow}>{point.kind === "black" ? "THE AFTER DARK REVEAL" : "YOUR FIRST CHALLENGE"}</span><span data-event-name className={scheduleClasses.eventName}>{point.title}</span></div>
                          </div>
                        ) : (
                          <div className={scheduleClasses.event}>
                            <span className={scheduleClasses.eventTime}>{point.time}</span>
                            <span className={scheduleClasses.eventName}>{point.title}</span>
                            {point.kind === "break" && <Coffee size={16} strokeWidth={1.3} aria-hidden="true" />}
                            {point.kind === "finish" && <Flag size={20} strokeWidth={1.3} aria-hidden="true" />}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ol>
                <div className={scheduleClasses.chapterEnd}><span data-chapter-line /><p>{chapterIndex === 0 ? "THE CLOCK STARTS NEXT" : chapterIndex === 1 ? "AND THEN, EVERYTHING CHANGES" : chapterIndex === 2 ? "KEEP GOING. DAYLIGHT IS NEXT." : "24 HOURS. ONE NEW PERSPECTIVE."}<ArrowDownRight size={14} aria-hidden="true" /></p></div>
              </article>
            ))}
          </div>
        </div>

        <div className={scheduleClasses.outro}>
          <p data-float-heading><FloatLetters text="YOU CAME WITH AN IDEA." /><br /><span className={scheduleClasses.outroAccent}><FloatLetters text="LEAVE WITH A VISION." /></span></p>
        </div>
      </div>
    </section>
  );
}
