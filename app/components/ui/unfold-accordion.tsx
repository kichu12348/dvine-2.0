"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { motionTransitions } from "../../lib/motion-tokens";

export interface UnfoldAccordionItem {
  id: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
}

export interface UnfoldAccordionProps {
  items: UnfoldAccordionItem[];
  /** Allow multiple items to be open at once */
  allowMultiple?: boolean;
  /** Default open item ids */
  defaultOpen?: string[];
  className?: string;
}

export const UnfoldAccordion: React.FC<UnfoldAccordionProps> = ({
  items,
  allowMultiple = false,
  defaultOpen = [],
  className,
}) => {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpen);

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={cn("grid border-t border-[var(--line)]", className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div key={item.id} className="border-b border-[var(--line)]">
            <button
              type="button"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-3 py-3 sm:py-4.5 md:py-5 border-none bg-transparent cursor-pointer text-left text-[var(--text)] font-[family-name:var(--font-heading)] text-[0.92rem] sm:text-[clamp(1.1rem,2.8vw,1.45rem)] font-semibold tracking-tight transition-colors duration-200 hover:text-[var(--blue)]"
            >
              <div>
                <span className="block leading-snug">{item.title}</span>
                {item.subtitle && (
                  <span className="block mt-1 text-[var(--muted)] text-xs font-normal tracking-normal">
                    {item.subtitle}
                  </span>
                )}
              </div>

              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={motionTransitions.springSnappy}
                className="shrink-0 text-[var(--blue)] p-1"
              >
                <ChevronDown size={18} />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={motionTransitions.springGentle}
                  className="overflow-hidden"
                >
                  <motion.div
                    initial={{ y: -4, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -4, opacity: 0 }}
                    transition={{
                      duration: 0.28,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="max-w-[42rem] pb-3.5 sm:pb-5 text-[var(--muted)] text-xs sm:text-[0.94rem] leading-relaxed"
                  >
                    {item.content}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default UnfoldAccordion;
