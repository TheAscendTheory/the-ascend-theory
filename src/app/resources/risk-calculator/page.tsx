import type { Metadata } from "next";
import RiskCalculator from "./RiskCalculator";

export const metadata: Metadata = {
  title: "Risk Calculator",
  description:
    "Use The Ascend Theory risk calculator to estimate dollar risk, position size, position value, potential reward, and risk-to-reward before taking a trade.",
};

const principles = [
  "Define risk before reward",
  "Know the invalidation level",
  "Size based on loss tolerance",
  "Avoid revenge trades",
  "Respect volatility",
  "Review every outcome",
];

export default function RiskCalculatorPage() {
  return (
    <main className="resourcesPage">
      <section className="resourcesHero">
        <p className="eyebrow">Market Tool</p>

        <h1>RISK CALCULATOR.</h1>

        <p>
          Estimate position size, dollar risk, potential reward, and
          risk-to-reward before taking a trade. This tool is for education and
          planning only.
        </p>

        <div className="pageCtaActions">
          <a href="/resources/economic-calendar" className="pageCtaPrimary">
            Open Economic Calendar
          </a>

          <a href="/disclaimer" className="pageCtaSecondary">
            Read Disclaimer
          </a>
        </div>
      </section>

      <section className="resourceCallout">
        <p className="eyebrow">Calculator</p>

        <h2>Define the risk before the trade.</h2>

        <p>
          Enter account size, risk percentage, entry, stop, and optional target
          price. For stocks and crypto, units can be interpreted as shares or
          coins. For forex, futures, or leveraged products, confirm contract and
          pip values separately.
        </p>

        <RiskCalculator />
      </section>

      <section className="resourceCallout">
        <p className="eyebrow">Risk Principles</p>

        <h2>Use the calculator as a discipline tool.</h2>

        <div className="resourceLibraryGrid">
          {principles.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
      </section>
    </main>
  );
}
