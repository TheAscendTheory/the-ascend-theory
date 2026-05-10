import type { Metadata } from "next";
import TradingViewEconomicCalendar from "./TradingViewEconomicCalendar";

export const metadata: Metadata = {
  title: "Economic Calendar",
  description:
    "Track major economic events, central bank announcements, inflation reports, employment data, and market-moving releases with The Ascend Theory economic calendar.",
};

const eventTypes = [
  "Central bank decisions",
  "Inflation reports",
  "Employment data",
  "GDP releases",
  "Consumer confidence",
  "Manufacturing data",
];

export default function EconomicCalendarPage() {
  return (
    <main className="resourcesPage">
      <section className="resourcesHero">
        <p className="eyebrow">Market Tool</p>

        <h1>ECONOMIC CALENDAR.</h1>

        <p>
          Track scheduled economic events, announcements, and data releases
          that can influence currencies, indices, commodities, rates, and broad
          market sentiment.
        </p>

        <div className="pageCtaActions">
          <a href="/resources/risk-calculator" className="pageCtaPrimary">
            Open Risk Calculator
          </a>

          <a href="/disclaimer" className="pageCtaSecondary">
            Read Disclaimer
          </a>
        </div>
      </section>

      <section className="resourceCallout">
        <p className="eyebrow">Live Calendar</p>

        <h2>Upcoming market-moving events.</h2>

        <p>
          Use the calendar as an awareness tool. It is not a signal to enter or
          exit trades. High-impact events can increase volatility, widen
          spreads, and change market conditions quickly.
        </p>

        <TradingViewEconomicCalendar />
      </section>

      <section className="resourceCallout">
        <p className="eyebrow">Watchlist</p>

        <h2>Events worth understanding before they hit.</h2>

        <div className="resourceLibraryGrid">
          {eventTypes.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
      </section>
    </main>
  );
}
