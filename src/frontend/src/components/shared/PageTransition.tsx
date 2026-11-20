import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { type SiteInfo, siteForPath } from "@/lib/shared/sites";
import { cn } from "@/lib/utils";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Phase =
  | { kind: "idle" }
  | { kind: "cover"; to: string; site: SiteInfo }
  | { kind: "reveal"; site: SiteInfo };

interface TransitionApi {
  /** Navigate to an href; plays the curtain wipe when the target is another site. */
  go: (to: string) => void;
  busy: boolean;
}

const TransitionContext = createContext<TransitionApi | null>(null);

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

export function TransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const reduced = usePrefersReducedMotion();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const curtainDriven = useRef(false);
  const lastSiteId = useRef(siteForPath(pathname).id);

  // Browser back/forward between sites: play the reveal half of the wipe.
  useEffect(() => {
    const site = siteForPath(pathname);
    if (site.id === lastSiteId.current) return;
    lastSiteId.current = site.id;
    if (curtainDriven.current) {
      curtainDriven.current = false;
      return;
    }
    if (!reduced) setPhase({ kind: "reveal", site });
  }, [pathname, reduced]);

  const go = useCallback(
    (to: string) => {
      const target = siteForPath(to);
      const current = siteForPath(pathname);
      if (reduced || target.id === current.id) {
        void navigate({ to });
        return;
      }
      setPhase((p) =>
        p.kind === "idle" ? { kind: "cover", to, site: target } : p,
      );
    },
    [navigate, pathname, reduced],
  );

  const onCovered = useCallback(
    (to: string, site: SiteInfo) => {
      curtainDriven.current = true;
      window.scrollTo(0, 0);
      void navigate({ to });
      setPhase({ kind: "reveal", site });
    },
    [navigate],
  );

  const api = useMemo(
    () => ({ go, busy: phase.kind !== "idle" }),
    [go, phase.kind],
  );

  return (
    <TransitionContext.Provider value={api}>
      {children}
      {phase.kind !== "idle" && (
        <motion.div
          key={`${phase.kind}-${phase.site.id}`}
          aria-hidden="true"
          data-ocid="transition.curtain"
          className={cn(
            phase.site.theme,
            "pointer-events-auto fixed inset-0 z-[90] flex items-end justify-between px-5 pb-8 md:px-10 md:pb-12",
          )}
          initial={{
            clipPath:
              phase.kind === "cover"
                ? "inset(100% 0% 0% 0%)"
                : "inset(0% 0% 0% 0%)",
          }}
          animate={{
            clipPath:
              phase.kind === "cover"
                ? "inset(0% 0% 0% 0%)"
                : "inset(0% 0% 100% 0%)",
          }}
          transition={{
            duration: 0.7,
            ease: EASE,
            delay: phase.kind === "reveal" ? 0.12 : 0,
          }}
          onAnimationComplete={() => {
            if (phase.kind === "cover") onCovered(phase.to, phase.site);
            else setPhase({ kind: "idle" });
          }}
        >
          <span className="font-display text-3xl leading-none tracking-tight md:text-6xl">
            {phase.site.name}
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-2">
            {phase.site.kind}
          </span>
        </motion.div>
      )}
    </TransitionContext.Provider>
  );
}

export function useSiteTransition(): TransitionApi {
  const ctx = useContext(TransitionContext);
  if (!ctx)
    throw new Error("useSiteTransition must be used inside TransitionProvider");
  return ctx;
}

type TransitionLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> & {
  to: string;
  children: ReactNode;
};

/** Anchor that routes through the curtain wipe. Keeps modifier-click / new-tab behaviour. */
export function TransitionLink({
  to,
  onClick,
  children,
  ...rest
}: TransitionLinkProps) {
  const { go } = useSiteTransition();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    )
      return;
    e.preventDefault();
    go(to);
  };
  return (
    <a href={to} onClick={handle} {...rest}>
      {children}
    </a>
  );
}
