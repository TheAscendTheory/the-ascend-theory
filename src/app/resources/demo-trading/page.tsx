import type { Metadata } from "next";
import DemoTrading from "./DemoTrading";

export const metadata: Metadata = {
  title: "Demo Trading",
  description:
    "Practice trading with simulated money, open and close demo positions, and send closed trades into The Ascend Theory trade journal.",
};

export default function DemoTradingPage() {
  return (
    <main className="resourcesPage">
      <section className="resourcesHero">
        <p className="eyebrow">Practice Account</p>

        <h1>DEMO TRADING.</h1>

        <p>
          Practice execution with simulated money. Open demo long or short
          positions, close them at simulated prices, and send the results into
          your trade journal for win rate, profit factor, and performance
          tracking.
        </p>

        <div className="pageCtaActions">
          <a href="/resources/market-dashboard" className="pageCtaPrimary">
            Open Trading Desk
          </a>

          <a href="/resources/trade-journal" className="pageCtaSecondary">
            View Journal
          </a>
        </div>
      </section>

      <section className="resourceCallout">
        <p className="eyebrow">Simulator</p>

        <h2>Build execution reps before real capital.</h2>

        <p>
          This simulator is for education and practice only. It does not place
          real trades, connect to a broker, or use live execution data yet.
        </p>

        <DemoTrading />
      </section>
    </main>
  );
}
