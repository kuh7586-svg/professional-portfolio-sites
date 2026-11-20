import { useFinePointer } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

const INTERACTIVE =
  "a, button, [role='button'], input, select, textarea, label, summary, [data-cursor]";

interface CustomCursorProps {
  /** difference: inverts what is under it (dark themes). solid: plain foreground dot (light themes). */
  variant?: "difference" | "solid";
  className?: string;
}

/**
 * 10px dot + 40px ring that grows over interactive elements.
 * Elements with `data-cursor="смотреть"` show that word inside the ring.
 * Disabled on touch / coarse pointers; hides the native cursor only while mounted.
 */
export function CustomCursor({
  variant = "difference",
  className,
}: CustomCursorProps) {
  const fine = useFinePointer();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 260, damping: 26, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 260, damping: 26, mass: 0.5 });
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    if (!fine) return;
    const root = document.documentElement;
    root.classList.add("cursor-custom");
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const over = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.(INTERACTIVE);
      setHover(Boolean(el));
      setLabel(el?.getAttribute("data-cursor") ?? "");
    };
    const leave = () => setVisible(false);
    const pressDown = () => setDown(true);
    const pressUp = () => setDown(false);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", pressDown);
    window.addEventListener("pointerup", pressUp);
    return () => {
      root.classList.remove("cursor-custom");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", pressDown);
      window.removeEventListener("pointerup", pressUp);
    };
  }, [fine, x, y]);

  if (!fine) return null;
  const blend = variant === "difference" ? "mix-blend-difference" : "";
  const ringScale = label ? 2.2 : hover ? 1.6 : 1;

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none fixed inset-0 z-[95]", className)}
    >
      <motion.div
        className={cn(
          "absolute left-0 top-0 h-2.5 w-2.5 rounded-full bg-foreground",
          blend,
        )}
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: visible && !hover ? 1 : 0, scale: down ? 0.6 : 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className={cn(
          "absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-foreground",
          label && "bg-foreground",
          blend,
        )}
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: down ? ringScale * 0.85 : ringScale,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      >
        {label && (
          <span className="font-mono text-[5px] uppercase tracking-[0.15em] text-background">
            {label}
          </span>
        )}
      </motion.div>
    </div>
  );
}
