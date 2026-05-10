import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Explore The Ascend Theory resource library for financial literacy, market education, AI literacy, digital systems, discipline frameworks, templates, and self-development tools.",
};

const resources = [
  {
    title: "Financial Literacy",
    text: "Core money principles, budgeting, saving, credit, investing basics, ownership, and economic awareness.",
  },
  {
    title: "Market Education",
    text: "Trading psychology, market structure, risk management, economic cycles, systems thinking, and strategic execution.",
  },
  {
    title: "Digital Systems",
    text: "Templates, workflows, productivity systems, AI tools, automation habits, and operational frameworks.",
  },
  {
    title: "Self-Mastery",
    text: "Discipline frameworks, habit systems, focus training, emotional control, patience, and long-term thinking.",
  },
  {
    title: "Creator Tools",
    text: "Planning templates, content systems, brand frameworks, newsletter structures, and digital product strategy.",
  },
  {
    title: "Youth Education",
    text: "Beginner-friendly resources for students and young adults learning money, markets, technology, and discipline.",
  },
];

const upcomingResources = [
  "The Ascender Starter Guide",
  "Financial Literacy Basics",
  "Personal Operating System Template",
  "AI Tools For Young Builders",
  "Market Awareness Beginner Guide",
  "Discipline And Execution Tracker",
];

export default function ResourcesPage() {
  return (
    <main className="resourcesPage">
      <section className="resourcesHero">
        <p className="eyebrow">Resources</p>

        <h1>TOOLS FOR ASCENSION.</h1>

        <p>
          Educational systems, financial literacy resources, frameworks, market
          education, digital products, templates, and learning tools built for
          modern self-development.
        </p>

        <div className="pageCtaActions">
          <a
            href="/the-ascender-starter-guide.html"
            className="pageCtaPrimary"
            target="_blank"
            rel="noreferrer"
          >
            Open Starter Guide
          </a>

          <a href="/#waitlist" className="pageCtaSecondary">
            Join For Updates
          </a>
        </div>
      </section>

      <section className="resourcesGrid" aria-label="Resource categories">
        {resources.map((resource) => (
          <article key={resource.title} className="resourceCard">
            <h2>{resource.title}</h2>
            <p>{resource.text}</p>
          </article>
        ))}
      </section>

      <section className="resourceCallout">
        <p className="eyebrow">Library Buildout</p>

        <h2>Guides, templates, frameworks, and learning systems.</h2>

        <p>
          The resource library is being developed as a practical toolset for
          financial literacy, market awareness, digital execution, AI literacy,
          and personal operating systems.
        </p>

        <div className="resourceLibraryGrid">
          {upcomingResources.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
      </section>

      <section className="pageCta">
        <h2>Use the resource library as your starting point.</h2>

        <p>
          The resource system is being built to support financial literacy,
          digital skills, market awareness, personal discipline, and the
          operating habits behind long-term growth.
        </p>

        <div className="pageCtaActions">
          <a
            href="/the-ascender-starter-guide.html"
            className="pageCtaPrimary"
            target="_blank"
            rel="noreferrer"
          >
            Open Starter Guide
          </a>

          <a href="/programs" className="pageCtaSecondary">
            Explore Programs
          </a>
        </div>
      </section>
    </main>
  );
}
