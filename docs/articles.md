# Articles

How an approved draft becomes a page on `highfivemoments.app`. Reviewing the website pull request is the publish gate. Approval in `h5m-seo` is not publication.

The site renders markdown from this repo. There is no CMS. One layout supplies the title, canonical URL, share image, article and breadcrumb structured data, and the sitemap entry.

## Files

| Piece | Path |
| --- | --- |
| Article | `content/articles/<slug>.md` |
| Hero and section images | `public/blog/<slug>/` |
| Public URL | `/blog/<slug>` |
| Index | `/blog` |

The slug is the filename without `.md`. Use the primary keyword, lowercase, with hyphens. `relationship-check-in.md` is served at `/blog/relationship-check-in`. Leave the slug alone after the page is published.

`published: true` puts the article on the index, in the sitemap, and on a public URL. Any other value is ignored by those surfaces. With zero published articles, `/blog` stays out of the sitemap and is marked `noindex`. The footer link labeled Articles appears once a published article exists.

## Frontmatter

```yaml
---
title: Relationship check-in questions
description: A relationship check-in is one calm sitting, weekly or monthly, to talk about how the days went.
heading: Relationship check-in questions for one calm sitting
publishedAt: 2026-10-19
updatedAt: 2026-10-19
published: true
hero:
  src: /blog/relationship-check-in/relationship-check-in.webp
  alt: Relationship check-in questions on a printed card held by two people sitting together.
---
```

- `title` is the title tag only. The site template adds `| High Five Moments`. Including the brand doubles it.
- `description` is the meta description.
- `heading` is the visible H1. It can differ from `title`.
- `publishedAt` and `updatedAt` are `YYYY-MM-DD`. `updatedAt` is the same day or later.
- `hero.src` is `/blog/<slug>/<slug>.webp`.
- `hero.alt` describes what is in the picture.

The markdown body starts at the first H2. The layout renders the H1, so the file has no `#` heading. The body keeps its own closing waitlist line. The layout does not add another one.

A build fails when a published article is missing its hero, the hero is the wrong size, a body image has no alt text, or a body image sits outside `public/blog/<slug>/`.

## Images

Published images are WebP.

The hero is 1200 by 630 pixels. That file is the share card, the article structured-data image, and the picture at the top of the page. The filename matches the slug.

Section images live in the same folder, use a descriptive filename, and include alt text in the markdown:

```md
![Six relationship check-in questions printed on a card.](/blog/relationship-check-in/check-in-questions.webp)
```

Picture rules live in the SEO site config: photographs stay naturalistic, graphic colour uses the interface palette, and a generated face is allowed when the picture has a reason. This pattern does not generate images.

## What the page emits

For a published article the layout sets:

- Title from `title`, description, and canonical `/blog/<slug>`
- Open Graph `article`, with the published and updated dates, and the hero as the image
- A Twitter large image card
- A byline with the date and Vinko Kraljevic
- Visible breadcrumbs: Home / Articles / heading
- `BlogPosting` and `BreadcrumbList` structured data, tied to the site organization
- A sitemap entry with `lastModified` from `updatedAt`, monthly change frequency, and priority `0.7`

`/blog` lists published articles, newest first. Once that list has an article, the index is included in the sitemap.
