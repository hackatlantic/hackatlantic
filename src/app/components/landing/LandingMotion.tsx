import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { APPLICATION_URL } from "./content";

export function ApplyLink({ compact = false }: { compact?: boolean }) {
  const reduced = useReducedMotion();
  return (
    <motion.a
      href={APPLICATION_URL}
      className={`landing-button${compact ? " compact" : ""}`}
      whileHover={reduced ? undefined : { y: -2 }}
      whileTap={reduced ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.16 }}
    >
      Sign up
    </motion.a>
  );
}

export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { y: 16 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// Draw the annotation, not the text: Fredoka stays legible from the first frame.
// Adapted from the hand-drawn SVG reference supplied for this design.
export function DrawnAccent({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <span className="drawn-accent">
      {children}
      <svg aria-hidden="true" viewBox="0 0 300 24" preserveAspectRatio="none">
        <motion.path
          d="M5 14 Q95 1 293 10 M12 21 Q156 8 280 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          initial={reduced ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: reduced ? 0 : 1.1,
            ease: "easeInOut",
            delay: reduced ? 0 : 0.15,
          }}
        />
      </svg>
    </span>
  );
}

function ScrollWord({
  word,
  index,
  progress,
}: {
  word: string;
  index: number;
  progress: MotionValue<number>;
}) {
  const start = Math.min(index * 0.055, 0.35);
  const y = useTransform(progress, [start, 0.85], [14 + index * 2, 0]);
  const rotateX = useTransform(progress, [start, 0.85], [12, 0]);
  return <motion.span style={{ y, rotateX }}>{word} </motion.span>;
}

export function ScrollTitle({ text, id }: { text: string; id: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 95%", "start 55%"],
  });
  return (
    <h2 id={id} ref={ref} className="scroll-title">
      {reduced ? (
        text
      ) : (
        <>
          <span className="visually-hidden">{text}</span>
          <span aria-hidden="true">
            {text.split(" ").map((word, index) => (
              <ScrollWord
                key={`${word}-${index}`}
                word={word}
                index={index}
                progress={scrollYProgress}
              />
            ))}
          </span>
        </>
      )}
    </h2>
  );
}

export function ScenicLayer({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-8, 8]);
  return (
    <motion.div
      ref={ref}
      className={`scenic-layer ${className}`}
      style={{ y: reduced ? 0 : y }}
    >
      {children}
    </motion.div>
  );
}
