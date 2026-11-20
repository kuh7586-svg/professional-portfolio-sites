import { cn } from "@/lib/utils";
import { TransitionLink } from "./PageTransition";

interface BackToPortfolioProps {
  className?: string;
  /** Fixed in the top-left corner (default). Pass false to place it inline in a site header. */
  fixed?: boolean;
}

/** Visible «← в портфолио» link for every demo site. Inherits colors from the site's theme class. */
export function BackToPortfolio({
  className,
  fixed = true,
}: BackToPortfolioProps) {
  return (
    <TransitionLink
      to="/"
      data-ocid="demo.back_to_portfolio.link"
      className={cn(
        "group inline-flex min-h-11 items-center gap-2 border border-hairline bg-background px-3 font-mono text-xs uppercase tracking-[0.2em] text-foreground transition-colors duration-300 hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        fixed && "fixed left-3 top-3 z-50 md:left-5 md:top-5",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-500 ease-out-expo group-hover:-translate-x-1"
      >
        ←
      </span>
      <span>в портфолио</span>
    </TransitionLink>
  );
}
