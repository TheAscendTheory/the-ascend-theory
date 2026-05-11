"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import { Maximize2, Minimize2, Music, Play, X } from "lucide-react";

export type MediaKind = "video" | "audio";
export type MediaSource = "youtube" | "file";

export type PlayerItem = {
  id: string;
  title: string;
  eyebrow: string;
  kind: MediaKind;
  source: MediaSource;
  src: string;
  access: "free" | "member" | "paid" | "exclusive";
  ready?: boolean;
};

type MediaContextValue = {
  activeItem: PlayerItem | null;
  minimized: boolean;
  play: (item: PlayerItem) => void;
  close: () => void;
  toggleMinimized: () => void;
};

const MediaContext = createContext<MediaContextValue | null>(null);

function youtubeEmbedUrl(url: string) {
  const directMatch = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&]+)/);
  const embedMatch = url.match(/youtube\.com\/embed\/([^?]+)/);
  const id = embedMatch?.[1] || directMatch?.[1];

  return id
    ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`
    : "";
}

function YouTubePlayer({ item }: { item: PlayerItem }) {
  const embedUrl = youtubeEmbedUrl(item.src);

  if (!embedUrl) {
    return (
      <div className="globalMediaPlaceholder">
        Add a YouTube video URL to play this inside the site.
      </div>
    );
  }

  return (
    <iframe
      src={embedUrl}
      title={item.title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    />
  );
}

function GlobalMediaDock() {
  const media = useMediaPlayer();
  const item = media.activeItem;

  if (!item) {
    return null;
  }

  return (
    <aside className={media.minimized ? "globalMediaDock isMinimized" : "globalMediaDock"}>
      <div className="globalMediaHeader">
        <button type="button" onClick={media.toggleMinimized}>
          {item.kind === "audio" ? <Music size={17} /> : <Play size={17} />}
          <span>{item.title}</span>
        </button>

        <div>
          <button
            type="button"
            onClick={media.toggleMinimized}
            aria-label={media.minimized ? "Expand media player" : "Minimize media player"}
          >
            {media.minimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button type="button" onClick={media.close} aria-label="Close media player">
            <X size={16} />
          </button>
        </div>
      </div>

      {!media.minimized && (
        <div className="globalMediaBody">
          <div className="globalMediaMeta">
            <span>{item.eyebrow}</span>
            <strong>{item.access === "free" ? "Free" : item.access}</strong>
          </div>

          {item.ready === false && (
            <div className="globalMediaPlaceholder">
              Media player ready. Add the final source file or YouTube video
              URL when the content is published.
            </div>
          )}

          {item.ready !== false && item.kind === "video" && item.source === "youtube" && <YouTubePlayer item={item} />}

          {item.ready !== false && item.kind === "video" && item.source === "file" && (
            <video src={item.src} controls autoPlay playsInline />
          )}

          {item.ready !== false && item.kind === "audio" && <audio src={item.src} controls autoPlay />}
        </div>
      )}
    </aside>
  );
}

export function MediaLayerProvider({ children }: { children: ReactNode }) {
  const [activeItem, setActiveItem] = useState<PlayerItem | null>(null);
  const [minimized, setMinimized] = useState(false);

  const value = useMemo<MediaContextValue>(
    () => ({
      activeItem,
      minimized,
      play(item) {
        setActiveItem(item);
        setMinimized(false);
      },
      close() {
        setActiveItem(null);
        setMinimized(false);
      },
      toggleMinimized() {
        setMinimized((current) => !current);
      },
    }),
    [activeItem, minimized]
  );

  return (
    <MediaContext.Provider value={value}>
      {children}
      <GlobalMediaDock />
    </MediaContext.Provider>
  );
}

export function useMediaPlayer() {
  const context = useContext(MediaContext);

  if (!context) {
    throw new Error("useMediaPlayer must be used inside MediaLayerProvider.");
  }

  return context;
}
