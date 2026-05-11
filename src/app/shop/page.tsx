import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "The Ascend Theory shop for apparel, accessories, notebooks, stickers, and community merchandise.",
};

const shopStandards = [
  "Apparel should feel clean, disciplined, and wearable.",
  "Notebooks and study tools should connect naturally to Academy work.",
  "Accessories should support the Ascender identity without feeling gimmicky.",
  "Discounts, drops, and affiliate offers should be clearly labeled.",
];

export default function ShopPage() {
  return (
    <main className="shopPage">
      <section className="shopHero">
        <p className="eyebrow">Shop</p>

        <h1>WEAR THE STANDARD.</h1>

        <p>
          Enter the official Ascend Theory shop for apparel, accessories,
          notebooks, stickers, and brand pieces.
        </p>

        <div className="pageCtaActions">
          <a
            href="https://shop.theascendtheory.com"
            target="_blank"
            rel="noreferrer"
            className="pageCtaPrimary"
          >
            Enter Shop
          </a>

          <a href="/community" className="pageCtaSecondary">
            Join The Community
          </a>
        </div>
      </section>

      <section className="mediaCallout shopStandardCallout">
        <p className="eyebrow">Shop Standard</p>
        <h2>Commerce should support the identity, not distract from it.</h2>
        <p>
          The shop stays direct: official apparel, accessories, study pieces,
          notebooks, stickers, and brand items that fit the Ascend standard.
        </p>
        <div className="mediaSeriesGrid">
          {shopStandards.map((standard) => (
            <div key={standard}>{standard}</div>
          ))}
        </div>
      </section>
    </main>
  );
}
