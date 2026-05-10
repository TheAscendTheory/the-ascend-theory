import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://theascendtheory.com";
  const currentDate = new Date();

  const routes = [
    "",
    "/about",
    "/programs",
    "/news",
    "/media",
    "/learn",
    "/resources",
    "/resources/market-dashboard",
    "/resources/charting",
    "/resources/economic-calendar",
    "/resources/risk-calculator",
    "/resources/demo-trading",
    "/resources/trade-journal",
    "/community",
    "/social",
    "/affiliates",
    "/contact",
    "/account",
    "/shop",
    "/the-ascender-starter-guide.html",
    "/privacy",
    "/disclaimer",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
