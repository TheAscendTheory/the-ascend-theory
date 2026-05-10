"use client";

import { Lock, Music, Play } from "lucide-react";
import { PlayerItem, useMediaPlayer } from "../components/MediaLayer";

type MediaCategory = {
  id: string;
  label: string;
  title: string;
  description: string;
  items: PlayerItem[];
};

const mediaCategories: MediaCategory[] = [
  {
    id: "videos",
    label: "Videos",
    title: "Video Lessons",
    description:
      "Short-form and long-form visual lessons for market awareness, money, discipline, and systems.",
    items: [
      {
        id: "market-awareness-intro",
        eyebrow: "Video",
        title: "Market Awareness Intro",
        kind: "video",
        source: "youtube",
        src: "https://www.youtube.com/@TheAscendTheoryGlobal",
        access: "free",
        ready: false,
      },
    ],
  },
  {
    id: "podcasts",
    label: "Podcasts",
    title: "Podcasts And Interviews",
    description:
      "Longer conversations, founder notes, interviews, and audio-first thinking for members.",
    items: [
      {
        id: "ascender-audio-notes",
        eyebrow: "Podcast",
        title: "Ascender Audio Notes",
        kind: "audio",
        source: "file",
        src: "/media/ascender-audio-notes.mp3",
        access: "member",
        ready: false,
      },
    ],
  },
  {
    id: "documentaries",
    label: "Documentaries",
    title: "Documentaries",
    description:
      "Story-driven films around discipline, ambition, education, technology, and culture.",
    items: [
      {
        id: "discipline-documentary",
        eyebrow: "Documentary",
        title: "Discipline Over Noise",
        kind: "video",
        source: "file",
        src: "/media/discipline-over-noise.mp4",
        access: "paid",
        ready: false,
      },
    ],
  },
  {
    id: "music",
    label: "Music",
    title: "Music And Focus Audio",
    description:
      "Audio environments for studying, building, journaling, and focused market prep.",
    items: [
      {
        id: "focus-session-one",
        eyebrow: "Music",
        title: "Focus Session One",
        kind: "audio",
        source: "file",
        src: "/media/focus-session-one.mp3",
        access: "free",
        ready: false,
      },
    ],
  },
  {
    id: "courses",
    label: "Courses",
    title: "Courses And Exclusive Lessons",
    description:
      "Structured paid and exclusive education that lives inside the platform.",
    items: [
      {
        id: "systems-course",
        eyebrow: "Course",
        title: "Personal Operating System",
        kind: "video",
        source: "file",
        src: "/media/personal-operating-system.mp4",
        access: "exclusive",
        ready: false,
      },
    ],
  },
];

export default function MediaLibrary() {
  const media = useMediaPlayer();

  return (
    <section className="mediaPlayerSection" aria-label="On-site media library">
      <div id="media-library" className="mediaPlayerHeader">
        <p className="eyebrow">On-Site Player</p>
        <h2>Watch, listen, and keep working.</h2>
        <p>
          Evergreen videos, documentaries, podcasts, music, and paid course
          lessons can play inside the site while the rest of the app stays
          usable. Fast current-event coverage now lives in News.
        </p>
      </div>

      <div className="mediaCategoryNav" aria-label="Media categories">
        {mediaCategories.map((category) => (
          <a key={category.id} href={`#${category.id}`}>
            {category.label}
          </a>
        ))}
      </div>

      {mediaCategories.map((category) => (
        <section key={category.id} id={category.id} className="mediaCategorySection">
          <div className="mediaCategoryHeader">
            <div>
              <p className="eyebrow">{category.label}</p>
              <h3>{category.title}</h3>
            </div>
            <p>{category.description}</p>
          </div>

          <div className="mediaPlayerGrid">
            {category.items.map((item) => (
              <article key={item.id} className="mediaPlayerCard">
                <div className="mediaThumb">
                  {item.kind === "audio" ? <Music size={30} /> : <Play size={32} />}
                  {item.access !== "free" && (
                    <span>
                      <Lock size={13} />
                      {item.access}
                    </span>
                  )}
                </div>

                <div>
                  <p>{item.eyebrow}</p>
                  <h3>{item.title}</h3>
                </div>

                <button type="button" onClick={() => media.play(item)}>
                  {item.ready === false ? "Open Slot" : item.kind === "audio" ? "Play Audio" : "Play Video"}
                </button>
              </article>
            ))}
          </div>
        </section>
      ))}
    </section>
  );
}
