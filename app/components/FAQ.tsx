"use client";

import { useId, useRef, useState } from "react";
import { UnfoldAccordion } from "./ui/unfold-accordion";
import type { UnfoldAccordionItem } from "./ui/unfold-accordion";

const questions: UnfoldAccordionItem[] = [
  {
    id: "what-is",
    title: "What is D'VINE 2.0?",
    content:
      "D'VINE 2.0 is a 24-hour UI/UX Design Hackathon organized by IEEE Student Branch CEC and IEDC BOOTCAMP CEC.",
  },
  {
    id: "who-can",
    title: "Who can participate?",
    content:
      "Students, aspiring designers, UI/UX enthusiasts, and individuals interested in design and problem-solving can participate, subject to the official eligibility criteria.",
  },
  {
    id: "solo",
    title: "Can I participate solo?",
    content: "Yes. Participants can compete individually or as a team of two.",
  },
  {
    id: "team-size",
    title: "What is the maximum team size?",
    content: "The maximum team size is 2 members.",
  },
  {
    id: "duration",
    title: "How long is the hackathon?",
    content: "The entire design challenge runs for 24 hours.",
  },
  {
    id: "designing",
    title: "What will we be designing?",
    content:
      "Participants will receive a design challenge at the beginning of the hackathon and will develop a UI/UX solution within the given timeframe.",
  },
  {
    id: "tools",
    title: "Which tools can I use?",
    content:
      "Participants can use their preferred UI/UX and design tools, subject to the official event rules.",
  },
  {
    id: "prizes",
    title: "What are the prizes?",
    content: "D'VINE 2.0 features prizes worth ₹2 Lakhs.",
  },
  {
    id: "judging",
    title: "How will the designs be judged?",
    content:
      "Submissions will be evaluated based on factors such as problem understanding, creativity, user experience, visual design, functionality, and presentation.",
  },
  {
    id: "experience",
    title: "Do I need prior UI/UX experience?",
    content:
      "Prior experience can be helpful, but participants primarily need the ability to understand the challenge, develop a solution, and communicate their design effectively.",
  },
  {
    id: "after",
    title: "What happens after the 24-hour design period?",
    content:
      "Participants submit their solutions, after which the shortlisted entries proceed to the presentation and evaluation stage.",
  },
  {
    id: "updates",
    title: "Where can I find updates?",
    content:
      "All official announcements, guidelines, and updates will be shared through the official communication channels of IEEE Student Branch CEC and IEDC BOOTCAMP CEC.",
  },
];

const mobileTopics = [
  { label: "The basics", indices: [0, 1, 2, 3] },
  { label: "The sprint", indices: [4, 5, 6, 9] },
  { label: "What's next", indices: [7, 8, 10, 11] },
];

export default function FAQ() {
  const [mobileTopic, setMobileTopic] = useState(0);
  const topicRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const topicId = useId();

  return (
    <section
      id="faq"
      className="relative mx-auto grid w-[min(100%-2rem,1180px)] items-start gap-8 py-14 sm:w-[min(100%-4rem,1180px)] sm:gap-12 sm:py-20 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:py-32"
    >
      <div className="reveal max-w-[36rem]">
        <p className="mb-2.5 sm:mb-3 text-[0.66rem] sm:text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--blue)]">
          FAQ
        </p>
        <h2 className="mb-4 sm:mb-5 font-[family-name:var(--font-heading)] text-[clamp(1.85rem,6vw,4.5rem)] font-extrabold leading-[1.04] tracking-[-0.04em] text-[var(--text)]">
          Frequently Asked Questions
        </h2>
        <p className="m-0 text-sm sm:text-base leading-[1.68] text-[var(--muted)]">
          Everything you need to know about the format, criteria, team sizes, and how to prepare.
        </p>
      </div>

      {/* Mobile-only topic navigation; desktop retains the full accordion. */}
      <div className="sm:hidden">
        <div className="mb-[15px] flex justify-between gap-3 font-mono text-[8px] leading-[normal] tracking-[0.06em] text-[var(--muted)]"><span className="text-[var(--blue)]">BROWSE BY TOPIC</span><span>12 QUESTIONS / 3 TOPICS</span></div>
        <div className="mb-[22px] grid grid-cols-3 gap-2.5" role="tablist" aria-label="FAQ topics">
          {mobileTopics.map((topic, index) => (
            <button
              key={topic.label}
              ref={(element) => { topicRefs.current[index] = element; }}
              type="button"
              role="tab"
              id={`${topicId}-tab-${index}`}
              aria-controls={`${topicId}-panel-${index}`}
              aria-selected={mobileTopic === index}
              tabIndex={mobileTopic === index ? 0 : -1}
              className="group relative flex min-h-[60px] cursor-pointer flex-col items-start gap-2 border-b border-[var(--line)] bg-transparent pt-2.5 pb-[13px] text-left font-[family-name:var(--font-heading)] text-[12px] leading-[normal] font-semibold text-[var(--muted)] transition-colors duration-200 after:absolute after:inset-x-0 after:bottom-[-1px] after:h-0.5 after:origin-left after:scale-x-0 after:bg-[var(--blue)] after:transition-transform after:duration-[250ms] after:content-[''] aria-selected:text-[var(--blue-light)] aria-selected:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--blue)] motion-reduce:transition-none motion-reduce:after:transition-none"
              onClick={() => setMobileTopic(index)}
              onKeyDown={(event) => {
                let next = index;
                if (event.key === "ArrowRight") next = (index + 1) % mobileTopics.length;
                else if (event.key === "ArrowLeft") next = (index + mobileTopics.length - 1) % mobileTopics.length;
                else if (event.key === "Home") next = 0;
                else if (event.key === "End") next = mobileTopics.length - 1;
                else return;
                event.preventDefault();
                setMobileTopic(next);
                topicRefs.current[next]?.focus();
              }}
            >
              <span className="font-mono text-[8px] leading-[normal] font-normal opacity-60 group-aria-selected:opacity-100" aria-hidden="true">0{index + 1}</span>
              <span>{topic.label}</span>
            </button>
          ))}
        </div>
        {mobileTopics.map((topic, index) => (
          <div
            key={topic.label}
            id={`${topicId}-panel-${index}`}
            role="tabpanel"
            aria-labelledby={`${topicId}-tab-${index}`}
            hidden={mobileTopic !== index}
            tabIndex={0}
            className="min-h-[216px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--blue)] [&>div]:border-t-0"
          >
            <UnfoldAccordion items={topic.indices.map((questionIndex) => questions[questionIndex])} />
          </div>
        ))}
      </div>

      {/* Desktop view: 100% same as before */}
      <div className="hidden sm:block">
        <UnfoldAccordion items={questions} className="lg:grid-cols-2 lg:gap-x-10" />
      </div>
    </section>
  );
}
