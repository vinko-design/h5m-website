import { getPublishedArticles } from "@/lib/articles";

import { SiteHeaderClient } from "./site-header-client";

export function SiteHeader() {
  const showBlog = getPublishedArticles().length > 0;

  return <SiteHeaderClient showBlog={showBlog} />;
}
