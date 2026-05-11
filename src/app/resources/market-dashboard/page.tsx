import type { Metadata } from "next";
import AlertPlanner from "./AlertPlanner";
import TradingWorkspace from "../charting/TradingWorkspace";
import TradingViewAdvancedChart from "./TradingViewAdvancedChart";

export const metadata: Metadata = {
  title: "Trading Desk",
  description:
    "Use The Ascend Theory market dashboard for order flow, liquidity, structure, correlation, volatility, risk, execution planning, heatmaps, sessions, and market awareness.",
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
        <p className="eyebrow">Trading Desk</p>

        <h1>TRADING DESK.</h1>

        <p>
          A practical trading desk connecting charts, calendar, liquidity, structure,
          macro context, volatility, risk, execution planning, journaling, and
          session timing into one workflow.
        </p>

        <div className="pageCtaActions">
          <a href="#workspace-tools" className="pageCtaSecondary">
            Customize Tools
          </a>
          <a href="/resources/economic-calendar" className="pageCtaPrimary">
            Economic Calendar
          </a>
        </div>
      </section>

      <section id="live-chart" className="chartingStage unifiedTradingStage">
        <TradingViewAdvancedChart />
      </section>

      <div id="workspace-tools">
        <TradingWorkspace />
      </div>

      <section className="resourceCallout">
        <p className="eyebrow">Calendar</p>

        <h2>Check the calendar before sizing risk.</h2>

        <p>
          Major economic releases can change volatility, spreads, and session
          behavior. Keep the calendar inside the Trading Desk workflow before
          planning entries.
        </p>

        <div className="pageCtaActions">
          <a href="/resources/economic-calendar" className="pageCtaPrimary">
            Open Economic Calendar
          </a>
        </div>
      </section>

      <section className="resourceCallout">
        <p className="eyebrow">Market Stack</p>

        <h2>One clean workflow: chart, plan, size, journal.</h2>

        <p>
          The chart stays first. Everything else is optional and collapsible so
          traders can work minimally or open only the panels they need.
        </p>

        <div className="marketToolGrid">
          <a href="/resources/charting">
            <strong>Trading Desk</strong>
            <span>Live chart with optional watchlist, structure, flow notes, risk, journal, and sessions.</span>
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
          Use this planner to define the symbol, level, and reason before
          setting a live alert in your trading account or future notification
          workflow.
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
