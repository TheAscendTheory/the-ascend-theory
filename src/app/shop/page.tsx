import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "The Ascend Theory shop for apparel, accessories, notebooks, stickers, and future community merchandise.",
};

const products = [
  {
    name: "Ascend Theory Hoodie",
    status: "Coming Soon",
    description:
      "Premium black hoodie built for the first Ascenders. Clean, minimal, and movement-ready.",
  },
  {
    name: "Ascend Theory T-Shirt",
    status: "Coming Soon",
    description:
      "Everyday black tee designed around The Ascend Theory identity system.",
  },
  {
    name: "Ascenders Cap",
    status: "Coming Soon",
    description:
      "Minimal black cap built for events, content, and community presence.",
  },
  {
    name: "Ascend Sticker Pack",
    status: "Coming Soon",
    description:
      "Symbol stickers for laptops, notebooks, gear, and community drops.",
  },
];

export default function ShopPage() {
  return (
    <main className="shopPage">
      <section className="shopHero">
        <p className="eyebrow">Shop</p>

        <h1>WEAR THE STANDARD.</h1>

        <p>
          The Ascend Theory merchandise line is being built to turn the
          movement into a visible identity through apparel, accessories,
          notebooks, stickers, and community-ready brand pieces.
        </p>

        <div className="pageCtaActions">
          <a
            href="https://shop.theascendtheory.com"
            target="_blank"
            rel="noreferrer"
            className="pageCtaPrimary"
          >
            Open Fourthwall Shop
          </a>

          <a href="/community" className="pageCtaSecondary">
            Join The Community
          </a>
        </div>
      </section>

      <section className="shopGrid" aria-label="Merchandise preview">
        {products.map((product) => (
          <article key={product.name} className="shopCard">
            <p>{product.status}</p>
            <h2>{product.name}</h2>
            <span>{product.description}</span>
          </article>
        ))}
      </section>
    </main>
  );
}
