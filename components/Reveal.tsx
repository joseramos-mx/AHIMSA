"use client";

import { createElement, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

type RevealTag = "div" | "section" | "article" | "span" | "ul" | "li" | "h2" | "h3" | "h4" | "p";

type RevealProps = {
  /** HTML tag to render. Default: "div". */
  as?: RevealTag;
  /** Delay in seconds before the entrance animation. */
  delay?: number;
  /** Vertical offset (px) the element starts from. Default: 24. */
  distance?: number;
  /** Duration of the entrance animation (s). Default: 0.6. */
  duration?: number;
  className?: string;
  children: ReactNode;
};

/**
 * Fades + slides a block of content in once it enters the viewport.
 * Fires a single time per element. Respects prefers-reduced-motion by
 * rendering the plain tag with no animation.
 */
export default function Reveal({
  as = "div",
  delay = 0,
  distance = 24,
  duration = 0.6,
  className,
  children,
}: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return createElement(as, { className }, children);
  }

  // motion[as] is typed as a component for each HTML tag — safe to index.
  const MotionTag = motion[as];

  return (
    <MotionTag
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
