import type { Metadata } from "next";
import TradeJournal from "./TradeJournal";

export const metadata: Metadata = {
  title: "Trade Journal",
  description:
    "Log trades, track win rate, profit factor, profitability, net profit, and average R with The Ascend Theory trade journal.",
};

export default function TradeJournalPage() {
  return (
    <main className="resourcesPage">
      <section className="resourcesHero">
        <p className="eyebrow">Trade Journal</p>

        <h1>RECORD THE EXECUTION.</h1>

        <p>
          A practical trading journal for logging setups, direction, entry,
          exit, stop, size, profit and loss, win rate, profit factor, average R,
          and overall profitability.
        </p>

        <div className="pageCtaActions">
          <a href="/resources/charting" className="pageCtaPrimary">
            Open Charts
          </a>

          <a href="/resources/risk-calculator" className="pageCtaSecondary">
            Risk Calculator
          </a>
        </div>
      </section>

      <section className="resourceCallout">
        <p className="eyebrow">Journal</p>

        <h2>Track the process, not just the result.</h2>

        <p>
          Your journal saves in this browser for now. Profile-based cloud saving
          can be connected once Supabase Auth and the journal database table are
          enabled.
        </p>

        <TradeJournal />
      </section>
    </main>
  );
}
