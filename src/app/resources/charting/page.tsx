import type { Metadata } from "next";
import TradingViewAdvancedChart from "../market-dashboard/TradingViewAdvancedChart";

export const metadata: Metadata = {
  title: "Charts",
  description:
    "Use The Ascend Theory charting workspace for market structure, watchlists, drawing tools, indicators, and disciplined technical analysis.",
};

const chartingPrinciples = [
  "Start with higher-timeframe structure",
  "Mark key support and resistance",
  "Watch volume around major levels",
  "Check macro events before entries",
  "Plan invalidation before profit targets",
  "Record the trade in your journal",
];

export default function ChartingPage() {
  return (
    <main className="resourcesPage">
      <section className="chartingHero">
        <p className="eyebrow">Markets</p>

        <h1>CHARTING DESK.</h1>

        <p>
          A focused market workspace for live charts, drawing tools, watchlists,
          technical structure, macro references, and disciplined trade planning.
        </p>

        <div className="pageCtaActions">
          <a href="/resources/trade-journal" className="pageCtaPrimary">
            Open Trade Journal
          </a>

          <a href="/resources/economic-calendar" className="pageCtaSecondary">
            Economic Calendar
          </a>
        </div>
      </section>

      <section className="chartingStage">
        <TradingViewAdvancedChart />
      </section>

      <section className="resourceCallout">
        <p className="eyebrow">Charting Process</p>

        <h2>Read the market before reacting to it.</h2>

        <div className="resourceLibraryGrid">
          {chartingPrinciples.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
      </section>
    </main>
  );
}
