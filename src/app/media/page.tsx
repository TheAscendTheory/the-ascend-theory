import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media",
  description:
    "The Ascend Theory media engine distributes financial literacy, market awareness, digital skills, systems thinking, discipline, and self-development through short-form, long-form, live media, and original series.",
};

const mediaFormats = [
  {
    title: "Short-Form",
    text: "Fast, cinematic lessons on money, discipline, mindset, systems, markets, technology, and modern ambition.",
  },
  {
    title: "Long-Form",
    text: "Deeper breakdowns, essays, educational videos, market psychology, strategy, economics, and philosophy.",
  },
  {
    title: "Live Media",
    text: "Future livestreams, interviews, panels, podcasts, workshops, and real-time conversations with builders and learners.",
  },
  {
    title: "Market Breakdowns",
    text: "Accessible analysis of financial movement, global markets, trading psychology, risk, and economic narratives.",
  },
  {
    title: "Documentaries",
    text: "Story-driven visual projects exploring discipline, ambition, financial education, technology, and culture.",
  },
  {
    title: "Interviews",
    text: "Conversations with creators, traders, founders, educators, students, builders, and community leaders.",
  },
];

const mediaSeries = [
  "Money Basics",
  "Market Awareness",
  "Systems Over Motivation",
  "AI For Builders",
  "Ascender Notes",
  "Founder Build Log",
];

const distributionChannels = [
  {
    label: "YouTube",
    href: "https://www.youtube.com/@TheAscendTheoryGlobal",
  },
  {
    label: "YouTube Shorts",
    href: "https://www.youtube.com/@TheAscendTheoryGlobal/shorts",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@theascendtheoryglobal",
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
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/tapiwa-geza-70838a409/",
  },
];

export default function MediaPage() {
  return (
    <main className="mediaPage">
      <section className="mediaHero">
        <p className="eyebrow">Media</p>

        <h1>THE MEDIA ENGINE.</h1>

        <p>
          The Ascend Theory is building a media ecosystem across short-form
          content, long-form education, podcasts, interviews, livestreams,
          documentaries, and market breakdowns.
        </p>

        <div className="pageCtaActions">
          <a
            href="https://www.youtube.com/@TheAscendTheoryGlobal"
            target="_blank"
            rel="noreferrer"
            className="pageCtaPrimary"
          >
            Watch YouTube
          </a>

          <a
            href="https://www.tiktok.com/@theascendtheoryglobal"
            target="_blank"
            rel="noreferrer"
            className="pageCtaSecondary"
          >
            Follow TikTok
          </a>
        </div>
      </section>

      <section className="mediaGrid" aria-label="Media formats">
        {mediaFormats.map((format) => (
          <article key={format.title} className="mediaCard">
            <h2>{format.title}</h2>
            <p>{format.text}</p>
          </article>
        ))}
      </section>

      <section className="mediaCallout">
        <p className="eyebrow">Content Series</p>

        <h2>Original formats built around education and execution.</h2>

        <p>
          The media strategy is designed around repeatable series that can teach
          financial literacy, market awareness, digital skills, systems
          thinking, and disciplined execution without relying on generic
          motivational content.
        </p>

        <div className="mediaSeriesGrid">
          {mediaSeries.map((series) => (
            <div key={series}>{series}</div>
          ))}
        </div>
      </section>

      <section className="mediaCallout">
        <p className="eyebrow">Distribution</p>

        <h2>Built for multi-platform reach without losing identity.</h2>

        <p>
          Each platform can serve a different role: short-form discovery,
          long-form education, newsletter depth, founder updates, and community
          conversion.
        </p>

        <div className="mediaSeriesGrid">
          {distributionChannels.map((channel) => (
            <a
              key={channel.label}
              href={channel.href}
              target="_blank"
              rel="noreferrer"
            >
              {channel.label}
            </a>
          ))}
        </div>
      </section>

      <section className="mediaCallout">
        <p className="eyebrow">Direction</p>

        <h2>Education, culture, and execution distributed through media.</h2>

        <p>
          The media engine exists to turn financial literacy, discipline,
          technology, systems thinking, and personal development into content
          people can discover, learn from, and build around.
        </p>
      </section>

      <section className="pageCta">
        <h2>Follow the media engine as it develops.</h2>

        <p>
          The Ascend Theory uses media to make financial literacy, market
          awareness, technology, discipline, and systems thinking easier to
          discover, understand, and apply.
        </p>

        <div className="pageCtaActions">
          <a href="/resources" className="pageCtaPrimary">
            View Resources
          </a>

          <a href="/contact" className="pageCtaSecondary">
            Media Inquiries
          </a>
        </div>
      </section>
    </main>
  );
}
