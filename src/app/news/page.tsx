import type { Metadata } from "next";
import { BarChart3, Clock, FileText, Play, Radio, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "News Desk",
  description:
    "The Ascend Theory News Desk tracks market-moving headlines, daily briefs, current-event articles, and fast commentary across macro, markets, business, technology, and digital assets.",
};

const newsFilters = [
  "All",
  "Macro",
  "Markets",
  "Crypto",
  "Business",
  "Technology",
  "Education",
];

const dailyBriefs = [
  {
    label: "Morning Brief",
    title: "What matters before the open",
    text: "A fast scan of economic events, overnight sentiment, key levels, and assets traders should keep on watch.",
    icon: Clock,
  },
  {
    label: "Market Impact",
    title: "Why the move happened",
    text: "Short explanations connecting headlines to DXY, yields, indices, crypto, gold, oil, and risk appetite.",
    icon: BarChart3,
  },
  {
    label: "Current Events",
    title: "Articles plus commentary",
    text: "Fast written pieces for news that deserves context but does not need a long documentary or course treatment.",
    icon: FileText,
  },
];

const newsFormats = [
  {
    type: "Video",
    title: "Daily Market Recap",
    description:
      "A quick video format for what moved markets today, what mattered, and what was noise.",
    status: "Video desk",
    icon: Play,
  },
  {
    type: "Article",
    title: "Headline Breakdown",
    description:
      "Written analysis for inflation prints, central bank remarks, earnings, geopolitics, commodities, and digital asset events.",
    status: "Editorial desk",
    icon: FileText,
  },
  {
    type: "Live Note",
    title: "Market-Moving Alert",
    description:
      "Short-form update format for urgent catalysts that need speed, clarity, and a clean source trail.",
    status: "Fast desk",
    icon: Zap,
  },
  {
    type: "Audio",
    title: "News Voice Note",
    description:
      "A lightweight audio format for quick commentary when a full video is too slow to produce.",
    status: "Audio desk",
    icon: Radio,
  },
];

export default function NewsPage() {
  return (
    <main className="newsPage">
      <section className="newsHero">
        <p className="eyebrow">News Desk</p>
        <h1>Fast context for what moves markets.</h1>
        <p>
          News is separate from evergreen Media because it moves faster:
          articles, short videos, briefs, alerts, and commentary built around
          current events that affect money, markets, business, and technology.
        </p>
      </section>

      <nav className="newsFilterBar" aria-label="News categories">
        {newsFilters.map((filter) => (
          <a key={filter} href={`#${filter.toLowerCase()}`}>
            {filter}
          </a>
        ))}
      </nav>

      <section className="newsBriefGrid" aria-label="Daily news brief structure">
        {dailyBriefs.map((brief) => {
          const Icon = brief.icon;

          return (
            <article key={brief.title}>
              <Icon size={22} />
              <span>{brief.label}</span>
              <h2>{brief.title}</h2>
              <p>{brief.text}</p>
            </article>
          );
        })}
      </section>

      <section className="newsDeskLayout">
        <div className="newsFeed">
          <div className="newsSectionHeader">
            <p className="eyebrow">Publishing Desk</p>
            <h2>Videos, articles, alerts, and audio in one fast desk.</h2>
          </div>

          {newsFormats.map((format) => {
            const Icon = format.icon;

            return (
              <article key={format.title} className="newsStoryCard">
                <div>
                  <Icon size={20} />
                  <span>{format.type}</span>
                </div>
                <h3>{format.title}</h3>
                <p>{format.description}</p>
                <em>{format.status}</em>
              </article>
            );
          })}
        </div>

        <aside className="newsSidePanel">
          <p className="eyebrow">Editorial Standard</p>
          <h2>Fast, but not sloppy.</h2>
          <p>
            Each news item should answer what happened, why it matters, what
            assets may be affected, what is still unknown, and how learners can
            connect it to the Academy or Trading Desk workflow.
          </p>
          <div>
            <span>Source trail</span>
            <span>Market impact</span>
            <span>Asset map</span>
            <span>Follow-up watch</span>
          </div>
        </aside>
      </section>
    </main>
  );
}
