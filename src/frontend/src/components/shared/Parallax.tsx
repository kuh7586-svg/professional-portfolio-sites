import { cn } from "@/lib/utils";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { type ReactNode, useRef } from "react";

interface ParallaxProps {
  children: ReactNode;
  /** Travel in px across the element's pass through the viewport. Negative moves against scroll. */
  distance?: number;
  axis?: "y" | "x";
  /** Optional slow rotation in degrees over the same pass. */
  rotate?: number;
  className?: string;
}

/** Moves one element at its own speed while it crosses the viewport. */
export function Parallax({
  children,
  distance = 80,
  axis = "y",
  rotate = 0,
  className,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const shift = useTransform(
    scrollYProgress,
    [0, 1],
    [distance / 2, -distance / 2],
  );
  const turn = useTransform(scrollYProgress, [0, 1], [-rotate / 2, rotate / 2]);

  const style = reduced
    ? undefined
    : axis === "y"
      ? { y: shift, rotate: turn }
      : { x: shift, rotate: turn };

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div className="will-change-transform" style={style}>
        {children}
      </motion.div>
    </div>
  );
}
