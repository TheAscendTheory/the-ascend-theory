import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media",
  description:
    "The Ascend Theory media engine distributes financial literacy, market awareness, digital skills, systems thinking, discipline, and self-development through short-form, long-form, live media, and original series.",
};

const mediaFormats = [
  {
    title: "Shorts",
    text: "Fast, cinematic lessons on money, discipline, mindset, systems, markets, technology, and modern ambition.",
  },
  {
    title: "Courses",
    text: "Structured on-site education for Academy lessons, premium modules, walkthroughs, and subscriber learning paths.",
  },
  {
    title: "Podcasts",
    text: "Audio conversations, solo commentary, study discussions, market reflections, and interviews built for repeat listening.",
  },
  {
    title: "Documentaries",
    text: "Story-driven visual projects exploring discipline, ambition, financial education, technology, and culture.",
  },
  {
    title: "Long-Form Video",
    text: "Deeper breakdowns, essays, educational videos, market psychology, strategy, economics, and philosophy.",
  },
  {
    title: "Livestreams",
    text: "Livestreams, interviews, panels, podcasts, workshops, and real-time conversations with builders and learners.",
  },
  {
    title: "Market Breakdowns",
    text: "Accessible analysis of financial movement, global markets, trading psychology, risk, and economic narratives.",
  },
  {
    title: "Interviews",
    text: "Conversations with creators, traders, founders, educators, students, builders, and community leaders.",
  },
];

const mediaLanes = [
  "Podcasts live in their own lane.",
  "Documentaries stay separate from daily news.",
  "Courses connect directly to Academy and paid learning.",
  "Market breakdowns can link back to Trading Desk.",
  "Shorts drive discovery without burying long-form work.",
  "Interviews and livestreams build trust through real voices.",
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
          The Ascend Theory media ecosystem connects short-form
          content, long-form education, podcasts, interviews, livestreams,
          documentaries, courses, and market breakdowns without bunching every
          format into one feed.
        </p>

        <div className="pageCtaActions">
          <a href="#distribution" className="pageCtaPrimary">
            Follow Channels
          </a>
          <a href="/news" className="pageCtaSecondary">
            Open News Desk
          </a>
        </div>
      </section>

      <section className="mediaCallout mediaLaneCallout">
        <p className="eyebrow">Content Lanes</p>
        <h2>Evergreen media stays organized by category.</h2>
        <p>
          News gets its own fast-moving section. Media stays focused on the
          evergreen library: videos, courses, podcasts, documentaries,
          interviews, livestreams, and market education that people return to.
        </p>
        <div className="mediaSeriesGrid">
          {mediaLanes.map((lane) => (
            <div key={lane}>{lane}</div>
          ))}
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

      <section id="distribution" className="mediaCallout">
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
        <h2>Follow the media engine.</h2>

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
