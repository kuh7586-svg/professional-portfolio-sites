import { useFinePointer } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import type { ButtonHTMLAttributes, PointerEvent, ReactNode } from "react";

interface MagneticProps {
  children: ReactNode;
  /** Share of the cursor offset the element follows (0..1). */
  strength?: number;
  className?: string;
}

const SPRING = { stiffness: 220, damping: 16, mass: 0.6 };

/** Wraps any control (Link, button, anchor) and pulls it toward the cursor on hover. */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: MagneticProps) {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, SPRING);
  const sy = useSpring(y, SPRING);
  const enabled = fine && !reduced;

  const onMove = (e: PointerEvent<HTMLSpanElement>) => {
    if (!enabled) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      className={cn("inline-flex", className)}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.span>
  );
}

type MagneticButtonProps = {
  children: ReactNode;
  strength?: number;
  className?: string;
  wrapperClassName?: string;
} & (
  | ({ href: string; external?: boolean } & {
      onClick?: never;
      type?: never;
      disabled?: never;
    })
  | ({ href?: undefined; external?: never } & Pick<
      ButtonHTMLAttributes<HTMLButtonElement>,
      "onClick" | "type" | "disabled"
    >)
) & { "data-ocid"?: string; "aria-label"?: string };

/**
 * Pill CTA that follows the cursor. Renders <a> with `href`, otherwise <button>.
 * Style via className (each site applies its own radius/colors).
 */
export function MagneticButton(props: MagneticButtonProps) {
  const { children, strength = 0.3, className, wrapperClassName } = props;
  const base = cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-body text-sm font-medium text-primary-foreground transition-[transform,background-color,color] duration-300 ease-out-expo active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50",
    className,
  );
  return (
    <Magnetic strength={strength} className={wrapperClassName}>
      {props.href !== undefined ? (
        <a
          href={props.href}
          className={base}
          data-ocid={props["data-ocid"]}
          aria-label={props["aria-label"]}
          {...(props.external ? { target: "_blank", rel: "noreferrer" } : {})}
        >
          {children}
        </a>
      ) : (
        <button
          type={
            props.type === "submit"
              ? "submit"
              : props.type === "reset"
                ? "reset"
                : "button"
          }
          onClick={props.onClick}
          disabled={props.disabled}
          className={base}
          data-ocid={props["data-ocid"]}
          aria-label={props["aria-label"]}
        >
          {children}
        </button>
      )}
    </Magnetic>
  );
}
