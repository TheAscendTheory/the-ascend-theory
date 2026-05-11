import { NextResponse } from "next/server";

type NewsProviderItem = {
  uuid?: string;
  id?: string | number;
  title?: string;
  headline?: string;
  description?: string;
  summary?: string;
  source?: string;
  author?: string;
  url?: string;
  published_at?: string;
  created_at?: string;
  updated?: string;
  symbols?: string[];
  entities?: Array<{ symbol?: string; type?: string; name?: string }>;
  tickers?: string[];
  channels?: string[];
  tags?: string[];
};

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

const watchedSymbols = [
  "SPY",
  "QQQ",
  "DIA",
  "IWM",
  "BTCUSD",
  "ETHUSD",
  "EURUSD",
  "GBPUSD",
  "USDJPY",
  "USDCAD",
  "XAUUSD",
  "XAGUSD",
  "CL=F",
  "GC=F",
  "AAPL",
  "MSFT",
  "NVDA",
  "TSLA",
  "AMZN",
  "META",
  "GOOGL",
];

function compactText(value: unknown, fallback = "") {
  return String(value || fallback)
    .replace(/\s+/g, " ")
    .trim();
}

function uniq(values: string[]) {
  return [...new Set(values.map((value) => value.toUpperCase()).filter(Boolean))];
}

function classifyCategory(text: string) {
  const lower = text.toLowerCase();

  if (/\b(bitcoin|btc|ethereum|eth|crypto|stablecoin|blockchain)\b/.test(lower)) {
    return "Crypto";
  }

  if (/\b(fed|central bank|inflation|cpi|pce|rates|yields|treasury|gdp|jobs|payrolls)\b/.test(lower)) {
    return "Macro";
  }

  if (/\b(earnings|revenue|guidance|shares|stock|nasdaq|s&p|dow)\b/.test(lower)) {
    return "Markets";
  }

  if (/\b(oil|gold|silver|copper|commodity|commodities|natural gas)\b/.test(lower)) {
    return "Commodities";
  }

  if (/\b(ai|semiconductor|chip|software|technology|cybersecurity)\b/.test(lower)) {
    return "Technology";
  }

  return "Business";
}

function classifyImpact(text: string): NewsFlowItem["impact"] {
  const lower = text.toLowerCase();

  if (/\b(fomc|cpi|pce|nfp|payrolls|fed decision|rate decision|war|default|bankruptcy|merger|acquisition|sec sues|halted)\b/.test(lower)) {
    return "High";
  }

  if (/\b(earnings|guidance|inflation|yields|oil|gold|bitcoin|nasdaq|downgrade|upgrade)\b/.test(lower)) {
    return "Medium";
  }

  return "Low";
}

function extractAssets(item: NewsProviderItem, text: string) {
  const entitySymbols =
    item.entities
      ?.map((entity) => entity.symbol || entity.name || "")
      .filter(Boolean) || [];

  const directSymbols = [
    ...(item.symbols || []),
    ...(item.tickers || []),
    ...entitySymbols,
  ];

  const textSymbols = watchedSymbols.filter((symbol) =>
    text.toUpperCase().includes(symbol.replace("=F", "")),
  );

  return uniq([...directSymbols, ...textSymbols]).slice(0, 6);
}

function normalizeItem(item: NewsProviderItem, index: number): NewsFlowItem | null {
  const title = compactText(item.title || item.headline);
  const summary = compactText(item.description || item.summary, title);
  const source = compactText(item.source || item.author, "Market desk");
  const url = compactText(item.url);
  const publishedAt = compactText(item.published_at || item.created_at || item.updated);

  if (!title || !url) {
    return null;
  }

  const text = `${title} ${summary}`;

  return {
    id: compactText(item.uuid || item.id, `${title}-${index}`),
    title,
    summary,
    source,
    url,
    publishedAt: publishedAt || new Date().toISOString(),
    category: classifyCategory(text),
    impact: classifyImpact(text),
    assets: extractAssets(item, text),
  };
}

async function fetchMarketaux() {
  const apiKey = process.env.MARKETAUX_API_KEY;

  if (!apiKey) {
    return null;
  }

  const url = new URL("https://api.marketaux.com/v1/news/all");
  url.searchParams.set("api_token", apiKey);
  url.searchParams.set("language", "en");
  url.searchParams.set("filter_entities", "true");
  url.searchParams.set("limit", "18");
  url.searchParams.set("symbols", watchedSymbols.join(","));

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`News provider responded with ${response.status}.`);
  }

  const payload = (await response.json()) as { data?: NewsProviderItem[] };
  return (payload.data || []).map(normalizeItem).filter(Boolean) as NewsFlowItem[];
}

async function fetchBenzinga() {
  const apiKey = process.env.BENZINGA_API_KEY;

  if (!apiKey) {
    return null;
  }

  const url = new URL("https://api.benzinga.com/api/v2/news");
  url.searchParams.set("token", apiKey);
  url.searchParams.set("pagesize", "18");
  url.searchParams.set("displayOutput", "full");
  url.searchParams.set("tickers", watchedSymbols.slice(0, 12).join(","));

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`News provider responded with ${response.status}.`);
  }

  const payload = (await response.json()) as NewsProviderItem[];
  return payload.map(normalizeItem).filter(Boolean) as NewsFlowItem[];
}

export async function GET() {
  try {
    const items = (await fetchMarketaux()) || (await fetchBenzinga()) || [];
    const configured = Boolean(process.env.MARKETAUX_API_KEY || process.env.BENZINGA_API_KEY);

    return NextResponse.json({
      ok: true,
      configured,
      provider: process.env.MARKETAUX_API_KEY
        ? "marketaux"
        : process.env.BENZINGA_API_KEY
          ? "benzinga"
          : null,
      refreshedAt: new Date().toISOString(),
      items,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        configured: true,
        refreshedAt: new Date().toISOString(),
        items: [],
        error: error instanceof Error ? error.message : "Unable to load market news.",
      },
      { status: 502 },
    );
  }
}
