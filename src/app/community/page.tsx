import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community",
  description:
    "The Ascenders community is a developing network for financial literacy, market awareness, digital skills, systems thinking, discipline, accountability, and long-term self-development.",
};

const communityPillars = [
  {
    title: "Global Network",
    text: "A network for ambitious learners across media, finance, technology, business, education, creativity, and self-development.",
  },
  {
    title: "Learning Culture",
    text: "A community built around practical financial literacy, market awareness, digital skills, systems thinking, and disciplined execution.",
  },
  {
    title: "Accountability",
    text: "Spaces for members to share progress, set goals, ask questions, learn from each other, and build consistent operating habits.",
  },
  {
    title: "Builder Identity",
    text: "The Ascenders represent people who create proof through projects, content, education, entrepreneurship, and disciplined action.",
  },
  {
    title: "Youth Impact",
    text: "Programs and conversations designed to help students and young adults understand money, markets, technology, and opportunity.",
  },
  {
    title: "Future Events",
    text: "Seminars, livestreams, workshops, youth financial literacy initiatives, community calls, and in-person meetups.",
  },
];

const communitySpaces = [
  "Start Here",
  "Financial Literacy",
  "Market Awareness",
  "Digital Skills And AI",
  "Systems And Discipline",
  "Wins And Progress",
  "Networking",
  "Live Sessions",
];

const socialLinks = [
  {
    label: "Join Discord",
    href: "https://discord.gg/sRkBrb2n",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@TheAscendTheoryGlobal",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/theascendtheoryglobal/",
  },
  {
    label: "X",
    href: "https://x.com/AscendTheoryHQ",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@theascendtheoryglobal",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/tapiwa-geza-70838a409/",
  },
];

export default function CommunityPage() {
  return (
    <main className="communityPage">
      <section className="communityHero">
        <p className="eyebrow">Community</p>

        <h1>THE ASCENDERS.</h1>

        <p>
          A developing network of ambitious builders, creators, traders,
          entrepreneurs, students, and self-developing individuals committed to
          higher standards, practical learning, and long-term transformation.
        </p>

        <div className="pageCtaActions">
          <a
            href="https://discord.gg/sRkBrb2n"
            target="_blank"
            rel="noreferrer"
            className="pageCtaPrimary"
          >
            Join Discord
          </a>

          <a
            href="https://www.youtube.com/@TheAscendTheoryGlobal"
            target="_blank"
            rel="noreferrer"
            className="pageCtaSecondary"
          >
            Follow YouTube
          </a>
        </div>
      </section>

      <section className="communityGrid" aria-label="Community pillars">
        {communityPillars.map((pillar) => (
          <article key={pillar.title} className="communityCard">
            <h2>{pillar.title}</h2>
            <p>{pillar.text}</p>
          </article>
        ))}
      </section>

      <section className="communityCallout">
        <p className="eyebrow">Community Structure</p>

        <h2>Built around learning, progress, and accountability.</h2>

        <p>
          The community is being structured around focused spaces for financial
          literacy, markets, digital tools, systems, discipline, networking, and
          shared progress.
        </p>

        <div className="communitySpaceGrid">
          {communitySpaces.map((space) => (
            <div key={space}>{space}</div>
          ))}
        </div>
      </section>

      <section className="communityCallout">
        <p className="eyebrow">The Standard</p>

        <h2>A community built around growth, proof, and execution.</h2>

        <p>
          The Ascenders are the people who turn ideas into systems, lessons into
          discipline, ambition into output, and financial awareness into
          long-term ownership.
        </p>
      </section>

      <section className="communityCallout">
        <p className="eyebrow">Connect</p>

        <h2>The community now has live channels.</h2>

        <p>
          Join the Discord for the early foundation, then follow the media
          channels as The Ascend Theory builds across video, social, and
          professional platforms.
        </p>

        <div className="socialLinkGrid">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
            >
              {link.label}
            </a>
          ))}
        </div>
      </section>

      <section className="pageCta">
        <h2>Join the early foundation of The Ascenders.</h2>

        <p>
          The community is being shaped around financial literacy, market
          awareness, digital skills, execution, accountability, and long-term
          self-development.
        </p>

        <div className="pageCtaActions">
          <a href="/#contact" className="pageCtaPrimary">
            Join The Waitlist
          </a>

          <a href="/programs" className="pageCtaSecondary">
            Explore Programs
          </a>
        </div>
      </section>
    </main>
  );
}
