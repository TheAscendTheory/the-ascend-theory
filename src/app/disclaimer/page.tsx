import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Educational disclaimer for The Ascend Theory. Content is for learning purposes only and does not constitute financial, investment, legal, tax, or professional advice.",
};

export default function DisclaimerPage() {
  return (
    <main className="disclaimerPage">
      <section className="disclaimerHero">
        <p className="eyebrow">Disclaimer</p>

        <h1>EDUCATION, NOT FINANCIAL ADVICE.</h1>

        <p>
          The Ascend Theory provides educational content, resources, media, and
          community programming for general learning purposes only.
        </p>
      </section>

      <section className="disclaimerContent">
        <h2>Financial Education</h2>

        <p>
          Any content related to money, markets, investing, trading, business,
          economics, or personal finance is provided for educational and
          informational purposes only. Nothing on this site should be considered
          financial, investment, legal, tax, or professional advice.
        </p>

        <h2>No Guarantees</h2>

        <p>
          The Ascend Theory does not guarantee financial outcomes, investment
          results, business success, trading performance, income, or personal
          results. All decisions are the responsibility of the individual.
        </p>

        <h2>Personal Responsibility</h2>

        <p>
          Visitors, members, students, and community participants should do
          their own research and consult qualified professionals before making
          financial, legal, tax, investment, or business decisions.
        </p>

        <h2>Market Risk</h2>

        <p>
          Markets involve risk. Trading, investing, and financial speculation
          can lead to losses. Educational discussion of markets does not
          represent a recommendation to buy, sell, trade, or hold any asset.
        </p>

        <h2>Community And Content</h2>

        <p>
          The Ascend Theory may share opinions, frameworks, commentary,
          resources, and educational perspectives. These are intended to support
          learning, awareness, discipline, and critical thinking.
        </p>
      </section>

      <section className="pageCta">
        <h2>Learn with responsibility.</h2>

        <p>
          The Ascend Theory is built to help people think better, learn faster,
          and develop stronger systems, not to replace professional advice or
          personal judgment.
        </p>

        <div className="pageCtaActions">
          <a href="/resources" className="pageCtaPrimary">
            View Resources
          </a>

          <a href="/contact" className="pageCtaSecondary">
            Contact Us
          </a>
        </div>
      </section>
    </main>
  );
}
