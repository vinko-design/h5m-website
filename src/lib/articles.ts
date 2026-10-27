import "server-only";

import fs from "node:fs";
import path from "node:path";
import { cache } from "react";

import matter from "gray-matter";
import { z } from "zod";

import { readPublicImageSize } from "@/lib/image-size";
import { SITE_NAME } from "@/lib/site-config";

export const ARTICLE_HERO_WIDTH = 1200;
export const ARTICLE_HERO_HEIGHT = 630;

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const MARKDOWN_IMAGE = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

const heroSchema = z.object({
  src: z.string().trim().min(1),
  alt: z.string().trim().min(1),
});

const isoDateSchema = z.preprocess((value) => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  return value;
}, z.string().regex(ISO_DATE));

const frontmatterSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  heading: z.string().trim().min(1),
  publishedAt: isoDateSchema,
  updatedAt: isoDateSchema,
  published: z.boolean(),
  payoffList: z.boolean().optional(),
  hero: heroSchema.optional(),
});

export type Article = {
  slug: string;
  title: string;
  description: string;
  heading: string;
  publishedAt: string;
  updatedAt: string;
  payoffList: boolean;
  hero: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  body: string;
};

export const getPublishedArticles = cache(function getPublishedArticles(): Article[] {
  return loadArticles()
    .flatMap((entry) => (entry.published ? [entry.article] : []))
    .sort((a, b) => {
      if (a.publishedAt === b.publishedAt) {
        return a.slug.localeCompare(b.slug);
      }

      return a.publishedAt < b.publishedAt ? 1 : -1;
    });
});

export function getPublishedArticle(slug: string): Article | null {
  return getPublishedArticles().find((article) => article.slug === slug) ?? null;
}

export function formatArticleDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00Z`));
}

type LoadedArticle =
  | { published: false }
  | { published: true; article: Article };

function loadArticles(): LoadedArticle[] {
  if (!fs.existsSync(ARTICLES_DIR)) {
    return [];
  }

  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => loadArticle(fileName));
}

function loadArticle(fileName: string): LoadedArticle {
  const slug = fileName.slice(0, -3);

  if (!SLUG_PATTERN.test(slug)) {
    throw new Error(
      `Article filename "${fileName}" must be a lowercase hyphenated slug.`,
    );
  }

  const raw = fs.readFileSync(path.join(ARTICLES_DIR, fileName), "utf8");
  const parsed = matter(raw);
  const frontmatter = frontmatterSchema.safeParse(parsed.data);

  if (!frontmatter.success) {
    const details = frontmatter.error.issues
      .map((issue) => `${issue.path.join(".") || "frontmatter"}: ${issue.message}`)
      .join("; ");
    throw new Error(`Article "${slug}" has invalid frontmatter. ${details}`);
  }

  const data = frontmatter.data;

  if (data.title.includes(SITE_NAME)) {
    throw new Error(
      `Article "${slug}" title must leave off the brand. The site template adds "| ${SITE_NAME}".`,
    );
  }

  assertRealDate(slug, "publishedAt", data.publishedAt);
  assertRealDate(slug, "updatedAt", data.updatedAt);

  if (data.updatedAt < data.publishedAt) {
    throw new Error(`Article "${slug}" updatedAt is earlier than publishedAt.`);
  }

  assertNoMarkdownH1(slug, parsed.content);

  if (!data.published) {
    return { published: false };
  }

  if (!data.hero) {
    throw new Error(`Published article "${slug}" is missing a hero image.`);
  }

  const expectedHero = `/blog/${slug}/${slug}.webp`;

  if (data.hero.src !== expectedHero) {
    throw new Error(
      `Published article "${slug}" hero.src must be ${expectedHero}.`,
    );
  }

  const heroSize = readPublicImageSize(data.hero.src);

  if (
    heroSize.width !== ARTICLE_HERO_WIDTH ||
    heroSize.height !== ARTICLE_HERO_HEIGHT
  ) {
    throw new Error(
      `Published article "${slug}" hero must be ${ARTICLE_HERO_WIDTH} by ${ARTICLE_HERO_HEIGHT} pixels.`,
    );
  }

  assertBodyImages(slug, parsed.content);

  return {
    published: true,
    article: {
      slug,
      title: data.title,
      description: data.description,
      heading: data.heading,
      publishedAt: data.publishedAt,
      updatedAt: data.updatedAt,
      payoffList: data.payoffList ?? false,
      hero: {
        src: data.hero.src,
        alt: data.hero.alt,
        width: heroSize.width,
        height: heroSize.height,
      },
      body: parsed.content.trim(),
    },
  };
}

function assertRealDate(slug: string, field: string, value: string) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error(`Article "${slug}" ${field} is not a real date.`);
  }
}

function assertNoMarkdownH1(slug: string, body: string) {
  const withoutFences = body.replace(/```[\s\S]*?```/g, "");

  if (/^#\s/m.test(withoutFences)) {
    throw new Error(
      `Article "${slug}" must not include a markdown H1. The page renders the heading.`,
    );
  }
}

function assertBodyImages(slug: string, body: string) {
  for (const match of body.matchAll(MARKDOWN_IMAGE)) {
    const alt = match[1]?.trim() ?? "";
    const src = match[2] ?? "";
    const expectedPrefix = `/blog/${slug}/`;

    if (!alt) {
      throw new Error(`Article "${slug}" has an image without alt text (${src}).`);
    }

    if (!src.startsWith(expectedPrefix) || !src.endsWith(".webp")) {
      throw new Error(
        `Article "${slug}" images must be WebP files in ${expectedPrefix}. Found ${src}.`,
      );
    }

    readPublicImageSize(src);
  }
}
