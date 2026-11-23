"use client";

import type { ReactNode } from "react";
import { motion, MotionConfig } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

const motionTags = {
  div: motion.div,
  article: motion.article,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
} as const;

type MotionTag = keyof typeof motionTags;

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
};

/** Fades and lifts a block into view once, with an optional stagger delay. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  duration = 0.7,
}: RevealProps) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className={className}
        initial={{ opacity: 0, y }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration, delay, ease: EASE }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
  gap?: number;
};

/** Parent that reveals its StaggerItem children one after another. */
export function Stagger({
  children,
  className,
  delay = 0,
  amount = 0.15,
  gap = 0.12,
}: StaggerProps) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className={className}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount }}
        variants={{
          hidden: {},
          show: {
            transition: { delayChildren: delay, staggerChildren: gap },
          },
        }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  as?: MotionTag;
  hover?: "lift" | "scale";
};

/** Individual child of a Stagger container. */
export function StaggerItem({
  children,
  className,
  as = "div",
  hover,
}: StaggerItemProps) {
  const Component = motionTags[as];

  return (
    <Component
      className={className}
      variants={{
        hidden: { opacity: 0, y: 22 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.65, ease: EASE },
        },
      }}
      whileHover={
        hover === "lift"
          ? { y: -6 }
          : hover === "scale"
            ? { scale: 1.03 }
            : undefined
      }
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
    >
      {children}
    </Component>
  );
}
