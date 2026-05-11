"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, ExternalLink, RefreshCw, WifiOff } from "lucide-react";

type NewsFlowItem = {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  category: string;
  impact: "High" | "Medium" | "Low";
  assets: string[];
};

type NewsFlowResponse = {
  ok: boolean;
  configured: boolean;
  refreshedAt: string;
  items: NewsFlowItem[];
  error?: string;
};

const refreshIntervalMs = 300000;
const filters = ["All", "High", "Macro", "Markets", "Crypto", "Technology"];

function formatTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function NewsFlowClient() {
  const [items, setItems] = useState<NewsFlowItem[]>([]);
  const [configured, setConfigured] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [refreshedAt, setRefreshedAt] = useState("");

  const loadNews = useCallback(async (manual = false) => {
    setError("");
    setRefreshing(manual);

    try {
      const response = await fetch("/api/news-flow", { cache: "no-store" });
      const payload = (await response.json()) as NewsFlowResponse;

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "News flow is unavailable.");
      }

      setItems(payload.items || []);
      setConfigured(payload.configured);
      setRefreshedAt(payload.refreshedAt);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "News flow is unavailable.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const firstLoad = window.setTimeout(() => void loadNews(), 0);
    const timer = window.setInterval(() => void loadNews(), refreshIntervalMs);

    return () => {
      window.clearTimeout(firstLoad);
      window.clearInterval(timer);
    };
  }, [loadNews]);

  const visibleItems = useMemo(() => {
    if (activeFilter === "All") {
      return items;
    }

    if (activeFilter === "High") {
      return items.filter((item) => item.impact === "High");
    }

    return items.filter((item) => item.category === activeFilter);
  }, [activeFilter, items]);

  return (
    <section className="newsLiveFlow" aria-label="Live market news flow">
      <div className="newsLiveHeader">
        <div>
          <p className="eyebrow">Market News Flow</p>
          <h2>Current events that can move risk, liquidity, and sentiment.</h2>
          <p>
            A live-ready desk for market-moving headlines, tagged by category,
            impact, asset, and source so traders can scan without clutter.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadNews(true)}
          disabled={refreshing}
          aria-label="Refresh market news"
        >
          <RefreshCw size={16} />
          {refreshing ? "Refreshing" : "Refresh"}
        </button>
      </div>

      <div className="newsFlowControls" aria-label="News flow filters">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className={activeFilter === filter ? "active" : ""}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="newsFlowState">
          <Activity size={22} />
          <span>Loading market news flow.</span>
        </div>
      ) : error ? (
        <div className="newsFlowState newsFlowStateError">
          <WifiOff size={22} />
          <span>{error}</span>
        </div>
      ) : !configured ? (
        <div className="newsFlowState">
          <WifiOff size={22} />
          <span>
            Add a licensed financial news API key to activate constantly
            updating headlines.
          </span>
        </div>
      ) : visibleItems.length === 0 ? (
        <div className="newsFlowState">
          <Activity size={22} />
          <span>No headlines matched this filter yet.</span>
        </div>
      ) : (
        <div className="newsFlowList">
          {visibleItems.map((item) => (
            <article key={item.id} className="newsFlowItem">
              <div className="newsFlowMeta">
                <span>{item.impact} impact</span>
                <span>{item.category}</span>
                <span>{formatTime(item.publishedAt)}</span>
              </div>

              <h3>{item.title}</h3>
              <p>{item.summary}</p>

              <div className="newsFlowFooter">
                <div>
                  <span>{item.source}</span>
                  {item.assets.slice(0, 4).map((asset) => (
                    <strong key={asset}>{asset}</strong>
                  ))}
                </div>

                <a href={item.url} target="_blank" rel="noreferrer">
                  Read
                  <ExternalLink size={14} />
                </a>
              </div>
            </article>
          ))}
        </div>
      )}

      {refreshedAt ? (
        <p className="newsFlowRefresh">Last refresh: {formatTime(refreshedAt)}</p>
      ) : null}
    </section>
  );
}
