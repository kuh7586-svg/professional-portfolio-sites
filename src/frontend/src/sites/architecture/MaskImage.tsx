import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

const EASE: [number, number, number, number] = [0.77, 0, 0.175, 1];

interface MaskImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  delay?: number;
  /** Load eagerly (first screen). */
  eager?: boolean;
}

/** Arch signature: the image is uncovered by a horizontal mask, like a drawing sheet sliding out. */
export function MaskImage({
  src,
  alt,
  className,
  imgClassName,
  delay = 0,
  eager = false,
}: MaskImageProps) {
  const reduced = usePrefersReducedMotion();
  return (
    <motion.div
      className={cn("relative overflow-hidden bg-card", className)}
      initial={reduced ? false : { clipPath: "inset(0 100% 0 0)" }}
      whileInView={{ clipPath: "inset(0 0% 0 0)" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.1, ease: EASE, delay }}
    >
      <div className="h-full w-full transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]">
        <motion.img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          className={cn("h-full w-full object-cover grayscale", imgClassName)}
          initial={reduced ? false : { scale: 1.18 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay }}
        />
      </div>
    </motion.div>
  );
}
