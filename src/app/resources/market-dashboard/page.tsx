import type { Metadata } from "next";
import TradingWorkspace from "../charting/TradingWorkspace";
import TradingViewAdvancedChart from "./TradingViewAdvancedChart";

export const metadata: Metadata = {
  title: "Trading Desk",
  description:
    "Use The Ascend Theory market dashboard for order flow, liquidity, structure, correlation, volatility, risk, execution planning, heatmaps, sessions, and market awareness.",
};

export default function MarketDashboardPage() {
  return (
    <main className="resourcesPage">
      <section className="resourcesHero">
        <p className="eyebrow">Trading Desk</p>

        <h1>TRADING DESK.</h1>

        <p>
          A chart-first workspace for watching price, checking market events,
          sizing risk, planning alerts, and journaling trades without leaving the
          desk.
        </p>

        <div className="pageCtaActions">
          <a href="#workspace-tools" className="pageCtaPrimary">
            Customize Tools
          </a>
        </div>
      </section>

      <section id="live-chart" className="chartingStage unifiedTradingStage tradingDeskSurface">
        <div className="tradingDeskSurfaceHeader">
          <div>
            <p className="eyebrow">Live Chart</p>
            <h2>Live chart and execution workspace.</h2>
          </div>
          <span>Use the chart for price, then keep news, calendar, alerts, risk, and journal connected below.</span>
        </div>
        <TradingViewAdvancedChart />
      </section>

      <section className="deskWorkflowStrip" aria-label="Trading desk workflow">
        <article>
          <span>01</span>
          <strong>Read price</strong>
          <p>Start with trend, levels, liquidity, and context.</p>
        </article>
        <article>
          <span>02</span>
          <strong>Check events</strong>
          <p>Use the calendar before entering around high-impact releases.</p>
        </article>
        <article>
          <span>03</span>
          <strong>Size risk</strong>
          <p>Calculate position size before the trade becomes emotional.</p>
        </article>
        <article>
          <span>04</span>
          <strong>Record review</strong>
          <p>Journal the setup, result, notes, and performance stats.</p>
        </article>
      </section>

      <div id="workspace-tools">
        <TradingWorkspace />
      </div>
    </main>
  );
}
