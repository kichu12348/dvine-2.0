"use client";

import { useState } from "react";
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

export default function FAQ() {
  const [showAllMobile, setShowAllMobile] = useState(false);

  // Top 6 questions on mobile by default to prevent vertical congestion
  const mobileQuestions = showAllMobile ? questions : questions.slice(0, 6);

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

      {/* Mobile view with gentle progressive disclosure */}
      <div className="sm:hidden">
        <UnfoldAccordion items={mobileQuestions} />
        {questions.length > 6 && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setShowAllMobile((prev) => !prev)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-cyan-400/30 bg-white/[0.04] px-5 py-2 text-xs font-extrabold uppercase tracking-wider text-cyan-300 backdrop-blur-sm transition-all hover:bg-cyan-950/40 hover:border-cyan-400/50 active:scale-95 shadow-[0_0_15px_rgba(26,186,255,0.15)] cursor-pointer"
            >
              {showAllMobile ? (
                <>Show Fewer Questions ↑</>
              ) : (
                <>View all 12 questions (6 more) ↓</>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Desktop view: 100% same as before */}
      <div className="hidden sm:block">
        <UnfoldAccordion items={questions} className="lg:grid-cols-2 lg:gap-x-10" />
      </div>
    </section>
  );
}
