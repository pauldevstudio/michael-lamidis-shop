"use client";

/**
 * Fade-in-on-scroll wrapper. Respects prefers-reduced-motion (handled in CSS).
 * Default delay & y-offset tuned for "premium calm".
 */
import { motion, type Variants } from "framer-motion";
import * as React from "react";

interface Props {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

const baseVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98], delay },
  }),
};

export function Reveal({ children, delay = 0, y, className, as = "div" }: Props) {
  const MotionTag = motion[as as "div"] as typeof motion.div;
  const variants: Variants = y !== undefined
    ? {
        hidden: { opacity: 0, y },
        visible: (d: number = 0) => ({
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98], delay: d },
        }),
      }
    : baseVariants;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      custom={delay}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}
