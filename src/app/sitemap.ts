import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://theascendtheory.com";
  const currentDate = new Date();

  const routes = [
    "",
    "/about",
    "/programs",
    "/media",
    "/resources",
    "/community",
    "/contact",
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
