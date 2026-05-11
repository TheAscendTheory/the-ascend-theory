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
          A practical trading desk connecting charts, calendar, liquidity, structure,
          macro context, volatility, risk, execution planning, journaling, and
          session timing into one workflow.
        </p>

        <div className="pageCtaActions">
          <a href="#live-chart" className="pageCtaPrimary">
            Open Chart
          </a>
          <a href="#workspace-tools" className="pageCtaSecondary">
            Customize Tools
          </a>
        </div>
      </section>

      <section id="live-chart" className="chartingStage unifiedTradingStage">
        <TradingViewAdvancedChart />
      </section>

      <div id="workspace-tools">
        <TradingWorkspace />
      </div>
    </main>
  );
}
