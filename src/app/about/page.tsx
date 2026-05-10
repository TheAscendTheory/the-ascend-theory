import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about The Ascend Theory, a media, education, and community ecosystem built around financial literacy, systems thinking, market awareness, discipline, technology, and self-development.",
};

const aboutCards = [
  {
    title: "Mission",
    text: "Help people build financial intelligence, discipline, digital awareness, and higher personal operating standards.",
  },
  {
    title: "Vision",
    text: "Create a global media and education ecosystem for ambitious students, builders, creators, traders, and entrepreneurs.",
  },
  {
    title: "Identity",
    text: "The Ascenders are people committed to intentional growth, execution, learning, ownership, and long-term transformation.",
  },
];

const founderVision = [
  "Media Infrastructure",
  "Financial Education",
  "Youth Initiatives",
  "Technology Systems",
  "Global Community",
  "Digital Products",
];

const operatingPrinciples = [
  "Systems over motivation",
  "Execution over appearance",
  "Education over confusion",
  "Ownership over dependency",
  "Discipline over impulse",
  "Long-term thinking over noise",
];

export default function AboutPage() {
  return (
    <main className="aboutPage">
      <section className="aboutHero">
        <p className="eyebrow">About The Movement</p>

        <h1>A NEW STANDARD FOR AMBITION.</h1>

        <p>
          The Ascend Theory is a media, education, and community ecosystem built
          around financial literacy, systems thinking, market awareness,
          discipline, technology, and self-development.
        </p>

        <div className="pageCtaActions">
          <a href="/programs" className="pageCtaPrimary">
            View Programs
          </a>

          <a
            href="https://discord.gg/sRkBrb2n"
            target="_blank"
            rel="noreferrer"
            className="pageCtaSecondary"
          >
            Join Discord
          </a>
        </div>
      </section>

      <section className="aboutGrid" aria-label="About The Ascend Theory">
        {aboutCards.map((card) => (
          <article key={card.title} className="aboutCard">
            <h2>{card.title}</h2>
            <p>{card.text}</p>
          </article>
        ))}
      </section>

      <section className="founderVision">
        <p className="eyebrow">Founder Vision</p>

        <h2>Building A Global Ecosystem.</h2>

        <p>
          The Ascend Theory is designed as more than a content platform. The
          long-term vision is a scalable ecosystem spanning media, financial
          literacy, education, technology, digital infrastructure, community
          systems, youth initiatives, and global self-development.
        </p>

        <div className="visionGrid">
          {founderVision.map((item) => (
            <div key={item}>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="founderVision">
        <p className="eyebrow">Operating Principles</p>

        <h2>The standard behind the brand.</h2>

        <p>
          The Ascend Theory is built around practical values that can be taught,
          practiced, measured, and repeated through media, education, community,
          and personal systems.
        </p>

        <div className="visionGrid">
          {operatingPrinciples.map((item) => (
            <div key={item}>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pageCta">
        <h2>Explore the programs behind the movement.</h2>

        <p>
          The Ascend Theory is expanding from media into financial literacy
          workshops, youth education, digital skills, market awareness, and
          community-based learning systems.
        </p>

        <div className="pageCtaActions">
          <a href="/programs" className="pageCtaPrimary">
            View Programs
          </a>

          <a href="/contact" className="pageCtaSecondary">
            Partner With Us
          </a>
        </div>
      </section>
    </main>
  );
}
