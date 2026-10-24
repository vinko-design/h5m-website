import type { MetadataRoute } from "next";

import { getPublishedArticles } from "@/lib/articles";
import { SITE_URL } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const articles = getPublishedArticles();

  const entries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  if (articles.length === 0) {
    return entries;
  }

  const newestUpdate = articles.reduce(
    (latest, article) => (article.updatedAt > latest ? article.updatedAt : latest),
    articles[0].updatedAt,
  );

  entries.push({
    url: `${SITE_URL}/blog`,
    lastModified: new Date(`${newestUpdate}T00:00:00Z`),
    changeFrequency: "weekly",
    priority: 0.6,
  });

  for (const article of articles) {
    entries.push({
      url: `${SITE_URL}/blog/${article.slug}`,
      lastModified: new Date(`${article.updatedAt}T00:00:00Z`),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return entries;
}
