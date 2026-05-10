import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Offers",
  description:
    "Browse The Ascend Theory affiliate offers, prop firm discounts, platform deals, and partner codes with clear risk reminders.",
};

const offerSlots = [
  {
    name: "Prop Firm Partner",
    category: "Prop Firm",
    code: "COMING SOON",
    note: "Add discount code, rules, payout terms, and risk notes before publishing.",
  },
  {
    name: "Trading Platform",
    category: "Platform",
    code: "COMING SOON",
    note: "Add platform benefit, supported markets, monthly cost, and suitability notes.",
  },
  {
    name: "Market Tools",
    category: "Software",
    code: "COMING SOON",
    note: "Add what the tool does, who it is for, and whether it is beginner friendly.",
  },
];

export default function AffiliatesPage() {
  return (
    <main className="resourcesPage">
      <section className="resourcesHero">
        <p className="eyebrow">Affiliate Offers</p>
        <h1>PARTNER CODES.</h1>
        <p>
          A clean home for prop firm discounts, platform offers, and partner
          tools. Every offer should be useful, clearly labeled, and paired with
          risk awareness.
        </p>
      </section>

      <section className="resourceCallout">
        <p className="eyebrow">Offer Library</p>
        <h2>Only promote tools that fit the Ascend standard.</h2>
        <p>
          Add discount codes here when they are ready. Keep the page practical:
          what the offer is, who it is for, what the code gives, and what risks
          or rules users must understand.
        </p>

        <div className="affiliateGrid">
          {offerSlots.map((offer) => (
            <article key={offer.name}>
              <span>{offer.category}</span>
              <h3>{offer.name}</h3>
              <strong>{offer.code}</strong>
              <p>{offer.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="resourceCallout">
        <p className="eyebrow">Disclosure</p>
        <h2>Transparency protects trust.</h2>
        <p>
          Some links may earn The Ascend Theory a commission. Offers are not
          trading advice, profit guarantees, or a reason to take unnecessary
          risk. Users should read all rules before buying, funding, or trading.
        </p>
      </section>
    </main>
  );
}
