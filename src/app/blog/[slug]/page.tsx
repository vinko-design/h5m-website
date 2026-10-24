import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { ArticleBody } from "@/components/article-body";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
import { TurnstileProvider } from "@/components/turnstile-provider";
import { WaitlistCta } from "@/components/waitlist-cta";
import {
  formatArticleDate,
  getPublishedArticle,
  getPublishedArticles,
} from "@/lib/articles";
import {
  FOUNDER_NAME,
  FOUNDER_TITLE,
  FOUNDER_X_URL,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site-config";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getPublishedArticle(slug);

  if (!article) {
    return {};
  }

  const title = `${article.title} | ${SITE_NAME}`;
  const url = `/blog/${article.slug}`;
  const image = {
    url: article.hero.src,
    width: article.hero.width,
    height: article.hero.height,
    alt: article.hero.alt,
  };

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "article",
      url: `${SITE_URL}${url}`,
      title,
      description: article.description,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [FOUNDER_NAME],
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: article.description,
      images: [article.hero.src],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getPublishedArticle(slug);

  if (!article) {
    notFound();
  }

  const pageUrl = `${SITE_URL}/blog/${article.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: article.heading,
        description: article.description,
        image: `${SITE_URL}${article.hero.src}`,
        datePublished: article.publishedAt,
        dateModified: article.updatedAt,
        author: {
          "@type": "Person",
          name: FOUNDER_NAME,
          jobTitle: FOUNDER_TITLE,
          url: SITE_URL,
          sameAs: [FOUNDER_X_URL],
        },
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": pageUrl,
        },
        url: pageUrl,
      },
      {
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
          {
            "@type": "ListItem",
            position: 3,
            name: article.heading,
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <TurnstileProvider>
      <main className="flex flex-1 flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <article className="mx-auto w-full max-w-3xl flex-1 px-6 pb-16 pt-24 md:pt-28">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Articles", href: "/blog" },
              { label: article.heading },
            ]}
          />
          <h1 className="mt-6 text-3xl font-bold text-[var(--navy)] md:text-4xl">
            {article.heading}
          </h1>
          <p className="mt-4 text-muted-foreground">
            <time dateTime={article.publishedAt}>
              {formatArticleDate(article.publishedAt)}
            </time>
            {article.updatedAt !== article.publishedAt ? (
              <>
                <span aria-hidden="true"> · </span>
                <time dateTime={article.updatedAt}>
                  Updated {formatArticleDate(article.updatedAt)}
                </time>
              </>
            ) : null}
            <span aria-hidden="true"> · </span>
            {FOUNDER_NAME}
          </p>
          <Image
            src={article.hero.src}
            alt={article.hero.alt}
            width={article.hero.width}
            height={article.hero.height}
            priority
            sizes="(min-width: 768px) 768px, 100vw"
            className="mt-8 h-auto w-full rounded-2xl"
          />
          <ArticleBody markdown={article.body} />
        </article>
        <WaitlistCta />
        <Footer />
      </main>
    </TurnstileProvider>
  );
}
