import type { Metadata } from "next";
import AlertPlanner from "./AlertPlanner";

export const metadata: Metadata = {
  title: "Market Dashboard",
  description:
    "Use The Ascend Theory market dashboard for live charting, watchlists, drawing tools, risk planning, and economic event awareness.",
};

const workflow = [
  "Check the economic calendar before trading",
  "Mark major support and resistance",
  "Write the alert reason before the entry",
  "Use the risk calculator before sizing",
  "Review the trade after the outcome",
];

export default function MarketDashboardPage() {
  return (
    <main className="resourcesPage">
      <section className="resourcesHero">
        <p className="eyebrow">Market Tool</p>

        <h1>MARKET DASHBOARD.</h1>

        <p>
          A practical market hub connecting charting, calendar awareness, risk
          management, trade journaling, and alert planning into one workflow.
        </p>

        <div className="pageCtaActions">
          <a href="/resources/charting" className="pageCtaPrimary">
            Open Charts
          </a>

          <a href="/resources/demo-trading" className="pageCtaSecondary">
            Practice Demo Trading
          </a>
        </div>
      </section>

      <section className="resourceCallout">
        <p className="eyebrow">Market Stack</p>

        <h2>Chart, plan, size, and review.</h2>

        <p>
          The dashboard exists to connect the tools, not hide them. Start with
          the chart, check the calendar, size the trade, then journal the
          outcome.
        </p>

        <div className="marketToolGrid">
          <a href="/resources/charting">
            <strong>Charts</strong>
            <span>Live charts, watchlists, drawing tools, and indicators.</span>
          </a>

          <a href="/resources/economic-calendar">
            <strong>Economic Calendar</strong>
            <span>Macro events, inflation data, employment releases, and central banks.</span>
          </a>

          <a href="/resources/risk-calculator">
            <strong>Risk Calculator</strong>
            <span>Position size, dollar risk, position value, reward, and R multiple.</span>
          </a>

          <a href="/resources/demo-trading">
            <strong>Demo Trading</strong>
            <span>Practice with simulated money and send closed trades into the journal.</span>
          </a>

          <a href="/resources/trade-journal">
            <strong>Trade Journal</strong>
            <span>Win rate, profit factor, net P/L, average R, and trade review.</span>
          </a>
        </div>
      </section>

      <section className="resourceCallout">
        <p className="eyebrow">Alert Planning</p>

        <h2>Turn random watching into a written trigger.</h2>

        <p>
          This planner does not send live notifications yet. Use it to define
          the symbol, level, and reason before setting a live alert in your
          broker or TradingView account.
        </p>

        <AlertPlanner />
      </section>

      <section className="resourceCallout">
        <p className="eyebrow">Execution Workflow</p>

        <h2>Use the dashboard as a decision system.</h2>

        <div className="resourceLibraryGrid">
          {workflow.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
      </section>
    </main>
  );
}
