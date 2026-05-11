import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "The Ascend Theory programs combine financial literacy, market awareness, AI literacy, digital skills, discipline, and systems thinking for practical learning and youth education.",
};

const programs = [
  {
    title: "Financial Literacy Workshops",
    text: "Practical education covering budgeting, saving, credit, investing basics, ownership, economic awareness, and long-term financial decision-making.",
  },
  {
    title: "Market Awareness Sessions",
    text: "Beginner-friendly sessions that explain market structure, economic cycles, risk, trading psychology, and how financial systems move.",
  },
  {
    title: "Digital Skills And AI Literacy",
    text: "Training focused on modern tools, AI workflows, digital productivity, automation, online research, and technology-driven opportunity.",
  },
  {
    title: "Discipline And Systems Training",
    text: "Frameworks for routines, focus, habit formation, execution, emotional control, and building a personal operating system.",
  },
  {
    title: "Youth Education Initiatives",
    text: "Programs designed for students and young adults learning money, markets, technology, personal growth, and modern readiness.",
  },
  {
    title: "Community Learning Programs",
    text: "Group-based learning experiences, discussions, challenges, live sessions, and accountability systems for Ascenders.",
  },
];

const roadmap = [
  "School and college workshops",
  "Youth financial literacy seminars",
  "Digital resource library",
  "Live virtual sessions",
  "Community learning cohorts",
  "Future curriculum partnerships",
];

const outcomes = [
  "Stronger financial decision-making",
  "Better understanding of markets and economic systems",
  "Improved discipline, focus, and personal operating habits",
  "Practical awareness of AI, digital tools, and modern skills",
  "Greater confidence around learning, building, and execution",
  "Clearer long-term thinking around ownership and opportunity",
];

const deliveryFormats = [
  "Workshops",
  "Seminars",
  "Live sessions",
  "Digital guides",
  "Community cohorts",
  "School partnerships",
];

export default function ProgramsPage() {
  return (
    <main className="programsPage">
      <section className="programsHero">
        <p className="eyebrow">Programs</p>

        <h1>EDUCATION BUILT FOR EXECUTION.</h1>

        <p>
          The Ascend Theory is developing programs that combine financial
          literacy, market awareness, digital skills, discipline, and systems
          thinking into practical learning experiences for the next generation.
        </p>

        <div className="pageCtaActions">
          <a href="/contact" className="pageCtaPrimary">
            Start a Partnership
          </a>

          <a href="/resources" className="pageCtaSecondary">
            View Resources
          </a>
        </div>
      </section>

      <section className="programsGrid" aria-label="Program areas">
        {programs.map((program) => (
          <article key={program.title} className="programCard">
            <h2>{program.title}</h2>
            <p>{program.text}</p>
          </article>
        ))}
      </section>

      <section className="programsCallout">
        <p className="eyebrow">Outcomes</p>

        <h2>Designed to build practical literacy, confidence, and execution.</h2>

        <p>
          The program model focuses on helping learners understand money,
          markets, technology, discipline, and personal systems in ways they can
          apply to real decisions and long-term growth.
        </p>

        <div className="programRoadmap">
          {outcomes.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
      </section>

      <section className="programsCallout">
        <p className="eyebrow">Delivery</p>

        <h2>Flexible formats for media, schools, communities, and partners.</h2>

        <p>
          The Ascend Theory can grow through content, live programming, resource
          libraries, community spaces, and institutional partnerships.
        </p>

        <div className="programRoadmap">
          {deliveryFormats.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
      </section>

      <section className="programsCallout">
        <p className="eyebrow">Roadmap</p>

        <h2>From media to workshops, resources, and community learning.</h2>

        <p>
          The long-term goal is to create scalable education systems that can be
          delivered through content, live programming, digital products,
          community spaces, and institutional partnerships.
        </p>

        <div className="programRoadmap">
          {roadmap.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
      </section>

      <section className="pageCta">
        <h2>Bring The Ascend Theory into a learning environment.</h2>

        <p>
          For schools, nonprofits, youth organizations, and partners interested
          in financial literacy, digital skills, market awareness, and
          systems-based personal development programming.
        </p>

        <div className="pageCtaActions">
          <a href="/contact" className="pageCtaPrimary">
            Start a Partnership
          </a>

          <a href="/resources" className="pageCtaSecondary">
            View Resources
          </a>
        </div>
      </section>
    </main>
  );
}
