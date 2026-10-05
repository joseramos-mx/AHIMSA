"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { FAQ } from "@/lib/join";
import Reveal from "@/components/Reveal";

/** Acordeón accesible: una pregunta abierta a la vez. */
export default function Faq() {
  const reduce = useReducedMotion();
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-cream px-6 py-20 text-ink md:px-10 lg:py-28">
      <div className="mx-auto max-w-[840px]">
        <Reveal
          as="h2"
          className="font-fraunces text-[34px] font-light leading-[1.1] lg:text-[48px]"
        >
          Preguntas frecuentes
        </Reveal>

        <div className="mt-12 border-t border-ink/15">
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            const buttonId = `${baseId}-q${i}`;
            const panelId = `${baseId}-a${i}`;
            return (
              <div key={item.question} className="border-b border-ink/15">
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 rounded-[2px] py-6 text-left font-fraunces text-[20px] font-light leading-snug text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:text-[24px]"
                  >
                    {item.question}
                    <svg
                      aria-hidden="true"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      className={`shrink-0 transition-transform duration-300 motion-reduce:transition-none ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      <path d="M9 2v14M2 9h14" />
                    </svg>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: reduce ? 0 : 0.35,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[640px] pb-6 font-figtree text-[16px] leading-[1.6] text-ink/80">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
