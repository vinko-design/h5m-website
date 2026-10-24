import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
import { formatArticleDate, getPublishedArticles } from "@/lib/articles";
import {
  BLOG_DESCRIPTION,
  BLOG_TITLE,
  OG_IMAGE_ALT,
  OG_IMAGE_PATH,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site-config";

export function generateMetadata(): Metadata {
  const hasArticles = getPublishedArticles().length > 0;

  return {
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    alternates: {
      canonical: "/blog",
    },
    robots: hasArticles
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/blog`,
      title: `${BLOG_TITLE} | ${SITE_NAME}`,
      description: BLOG_DESCRIPTION,
      images: [
        {
          url: OG_IMAGE_PATH,
          width: 1200,
          height: 630,
          alt: OG_IMAGE_ALT,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${BLOG_TITLE} | ${SITE_NAME}`,
      description: BLOG_DESCRIPTION,
      images: [OG_IMAGE_PATH],
    },
  };
}

export default function BlogIndexPage() {
  const articles = getPublishedArticles();
  const jsonLd =
    articles.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: SITE_URL,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Articles",
              item: `${SITE_URL}/blog`,
            },
          ],
        }
      : null;

  return (
    <main className="flex flex-1 flex-col">
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      ) : null}
      <div className="mx-auto w-full max-w-3xl flex-1 px-6 pb-16 pt-24 md:pt-28">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Articles" }]} />
        <h1 className="mt-6 text-3xl font-bold text-[var(--navy)] md:text-4xl">
          {BLOG_TITLE}
        </h1>
        {articles.length > 0 ? (
          <>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {BLOG_DESCRIPTION}
            </p>
            <ul className="mt-10">
              {articles.map((article) => (
                <li
                  key={article.slug}
                  className="border-t border-border/70 py-8 first:border-t-0 first:pt-0"
                >
                  <h2 className="text-2xl font-semibold">
                    <Link
                      href={`/blog/${article.slug}`}
                      className="text-[var(--navy)] underline-offset-2 hover:underline"
                    >
                      {article.heading}
                    </Link>
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    <time dateTime={article.publishedAt}>
                      {formatArticleDate(article.publishedAt)}
                    </time>
                  </p>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    {article.description}
                  </p>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="mt-4 leading-relaxed text-muted-foreground">
            New articles will show up here.
          </p>
        )}
      </div>
      <Footer />
    </main>
  );
}
