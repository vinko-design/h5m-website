import Image from "next/image";
import Link from "next/link";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { readPublicImageSize } from "@/lib/image-size";

const components: Components = {
  h2: ({ children }) => (
    <h2 className="mt-10 text-xl font-semibold text-[var(--navy)]">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 text-lg font-semibold text-[var(--navy)]">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mt-4 leading-relaxed text-muted-foreground">{children}</p>
  ),
  a: ({ href, children }) => {
    const className =
      "text-[var(--indigo)] underline-offset-2 hover:underline";

    if (href && (href.startsWith("/") || href.startsWith("#"))) {
      return (
        <Link href={href} className={className}>
          {children}
        </Link>
      );
    }

    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  },
  ul: ({ children }) => (
    <ul className="mt-4 list-disc space-y-2 pl-6 leading-relaxed text-muted-foreground">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-4 list-decimal space-y-2 pl-6 leading-relaxed text-muted-foreground">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed [&_p]:mt-2">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-[var(--navy)]">{children}</strong>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mt-6 border-l-2 border-[var(--gold)] pl-4 text-[var(--navy)]">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-10 border-border" />,
  img: ({ src, alt }) => {
    if (typeof src !== "string") {
      return null;
    }

    const size = readPublicImageSize(src);

    return (
      <Image
        src={src}
        alt={alt ?? ""}
        width={size.width}
        height={size.height}
        sizes="(min-width: 768px) 768px, 100vw"
        unoptimized
        className={
          src.endsWith("/check-in-questions.webp")
            ? "mt-6 h-auto w-full rounded-2xl ring-1 ring-[var(--indigo)]/20"
            : "mt-6 h-auto w-full rounded-2xl"
        }
      />
    );
  },
  pre: ({ children }) => (
    <pre className="mt-6 overflow-x-auto rounded-xl bg-[var(--navy)] p-4 text-sm text-white">
      {children}
    </pre>
  ),
  code: ({ children, className }) => {
    if (className) {
      return <code className={className}>{children}</code>;
    }

    return (
      <code className="rounded bg-[var(--secondary)] px-1 py-0.5 text-[0.9em] text-[var(--navy)]">
        {children}
      </code>
    );
  },
  table: ({ children }) => (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm text-muted-foreground">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-border px-3 py-2 font-semibold text-[var(--navy)]">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-border px-3 py-2 align-top">{children}</td>
  ),
};

const questionListComponents: Components = {
  ...components,
  ol: ({ children }) => (
    <ol className="mt-6 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[var(--indigo)]">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="pl-2 leading-relaxed [&>h3]:mt-6 [&_p]:mt-2">{children}</li>
  ),
};

export function ArticleBody({
  markdown,
  payoffList = false,
}: {
  markdown: string;
  payoffList?: boolean;
}) {
  return (
    <div className="mt-10">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={payoffList ? questionListComponents : components}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
