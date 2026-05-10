import type { Metadata } from "next";
import Link from "next/link";

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

      <section className="resourceCallout">
        <p className="eyebrow">Charting Process</p>

        <h2>The full charting desk now lives in Market Dashboard.</h2>

        <p>
          To keep the experience seamless, charts, watchlists, structure,
          risk, session planning, and journaling are grouped in one workspace.
        </p>

        <div className="pageCtaActions">
          <Link href="/resources/market-dashboard" className="pageCtaPrimary">
            Open Market Dashboard
          </Link>
        </div>

        <div className="resourceLibraryGrid">
          {chartingPrinciples.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
      </section>
    </main>
  );
}
