import { animate, useInView, useReducedMotion } from "motion/react";
import {
  type ChangeEvent,
  type PointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";

const clamp = (v: number) => Math.min(100, Math.max(0, v));

/** Drag (mouse/touch) or use arrow keys to compare the panel before and after correction. */
export function BeforeAfter() {
  const frameRef = useRef<HTMLDivElement>(null);
  const touched = useRef(false);
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const inView = useInView(frameRef, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();

  // One-time hint: the divider glides in so visitors see it moves.
  useEffect(() => {
    if (!inView || reduced || touched.current) return;
    const controls = animate(88, 50, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (!touched.current) setPos(v);
      },
    });
    return () => controls.stop();
  }, [inView, reduced]);

  const fromPointer = (clientX: number) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos(clamp(((clientX - rect.left) / rect.width) * 100));
  };

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    touched.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    fromPointer(e.clientX);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging) fromPointer(e.clientX);
  };
  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setDragging(false);
  };
  const onRange = (e: ChangeEvent<HTMLInputElement>) => {
    touched.current = true;
    setPos(Number(e.target.value));
  };

  return (
    <div
      ref={frameRef}
      data-ocid="detail.compare.canvas_target"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      className="relative aspect-[4/3] w-full cursor-ew-resize touch-pan-y select-none overflow-hidden border border-hairline md:aspect-[16/9]"
    >
      <img
        src="/assets/generated/detailing/after.jpg"
        alt="Тот же капот после коррекции и керамики: глубокий глянец, чёткие отражения ламп"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <img
        src="/assets/generated/detailing/before.jpg"
        alt="Капот графитового седана до работы: голограммы, паутинка царапин, пыльная плёнка"
        draggable={false}
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <span className="pointer-events-none absolute left-3 top-3 border border-hairline bg-background px-2 py-1 font-mono text-[11px] uppercase tracking-[0.2em] md:left-5 md:top-5">
        До
      </span>
      <span className="pointer-events-none absolute right-3 top-3 bg-primary px-2 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-primary-foreground md:right-5 md:top-5">
        После
      </span>

      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={Math.round(pos)}
        onChange={onRange}
        aria-label="Положение шторки: слева «до», справа «после»"
        aria-valuetext={`Показано ${Math.round(pos)}% снимка «до»`}
        data-ocid="detail.compare.drag_handle"
        className="peer sr-only"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 w-px bg-primary"
        style={{ left: `${pos}%` }}
      >
        <span
          className={`absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border border-primary bg-background font-mono text-xs text-primary shadow-lift transition-transform duration-300 ease-out-expo ${dragging ? "scale-110" : ""}`}
        >
          ‹ ›
        </span>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden ring-2 ring-inset ring-ring peer-focus-visible:block"
      />
    </div>
  );
}
