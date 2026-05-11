import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "The Ascend Theory shop for apparel, accessories, notebooks, stickers, and community merchandise.",
};

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
    </main>
  );
}
