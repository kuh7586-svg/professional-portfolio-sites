import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { type ElementType, Fragment } from "react";

type RevealStyle = "rise" | "tilt" | "blur";

interface RevealHeadlineProps {
  /** One string or an array of explicit lines. */
  text: string | string[];
  as?: ElementType;
  /** Split into words (default) or letters. */
  split?: "word" | "letter";
  /** rise: masked slide up · tilt: 3D flip from below · blur: soft focus-in. */
  variant?: RevealStyle;
  delay?: number;
  stagger?: number;
  duration?: number;
  className?: string;
  lineClassName?: string;
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const VARIANTS: Record<
  RevealStyle,
  {
    hidden: Record<string, number | string>;
    shown: Record<string, number | string>;
  }
> = {
  rise: { hidden: { y: "110%" }, shown: { y: "0%" } },
  tilt: {
    hidden: { y: "60%", rotateX: -80, opacity: 0 },
    shown: { y: "0%", rotateX: 0, opacity: 1 },
  },
  blur: {
    hidden: { opacity: 0, filter: "blur(12px)", y: "20%" },
    shown: { opacity: 1, filter: "blur(0px)", y: "0%" },
  },
};

/** Hero headline revealed piece by piece on mount. Screen readers get the plain text. */
export function RevealHeadline({
  text,
  as: Tag = "h1",
  split = "word",
  variant = "rise",
  delay = 0.1,
  stagger,
  duration = 0.9,
  className,
  lineClassName,
}: RevealHeadlineProps) {
  const reduced = useReducedMotion();
  const lines = Array.isArray(text) ? text : [text];
  const step = stagger ?? (split === "letter" ? 0.025 : 0.08);
  const v = VARIANTS[variant];
  let index = 0;

  return (
    <Tag className={className} aria-label={lines.join(" ")}>
      {lines.map((line, li) => {
        const words = line.split(" ");
        return (
          <span
            key={`${li}-${line}`}
            aria-hidden="true"
            className={cn("block", lineClassName)}
            style={variant === "tilt" ? { perspective: "600px" } : undefined}
          >
            {words.map((word, wi) => {
              const pieces = split === "letter" ? Array.from(word) : [word];
              return (
                <Fragment key={`${wi}-${word}`}>
                  <span className="inline-block whitespace-nowrap">
                    {pieces.map((piece, pi) => {
                      const i = index++;
                      return (
                        <span
                          key={`${pi}-${piece}`}
                          className={cn(
                            "inline-block",
                            variant === "rise" &&
                              "overflow-hidden pb-[0.08em] -mb-[0.08em]",
                          )}
                        >
                          <motion.span
                            className="inline-block will-change-transform"
                            initial={reduced ? false : v.hidden}
                            animate={v.shown}
                            transition={{
                              duration,
                              ease: EASE,
                              delay: delay + i * step,
                            }}
                          >
                            {piece}
                          </motion.span>
                        </span>
                      );
                    })}
                  </span>
                  {wi < words.length - 1 && " "}
                </Fragment>
              );
            })}
          </span>
        );
      })}
    </Tag>
  );
}
