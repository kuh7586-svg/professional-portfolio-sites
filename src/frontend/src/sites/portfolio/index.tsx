import { CustomCursor } from "@/components/shared";
import { useEffect } from "react";
import { PortfolioAbout, PortfolioContacts, PortfolioFooter } from "./About";
import { PortfolioHeader, PortfolioHero } from "./Hero";
import { PortfolioWorks } from "./Works";

export function PortfolioHome() {
  useEffect(() => {
    document.title = "Алексей Ветров — сайты на ощупь";
  }, []);

  return (
    <div
      data-ocid="portfolio.page"
      className="theme-portfolio grain relative min-h-screen overflow-x-clip"
    >
      <CustomCursor />
      <PortfolioHeader />
      <main>
        <PortfolioHero />
        <PortfolioWorks />
        <PortfolioAbout />
        <PortfolioContacts />
      </main>
      <PortfolioFooter />
    </div>
  );
}
