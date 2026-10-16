<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Shared product context

Before making assumptions about product definition, audience, positioning, messaging, or cross-product principles, read [docs/shared-context.md](docs/shared-context.md) and follow it to the canonical `h5m-context` repository.

- Shared product context is authoritative for cross-project product questions.
- This repository remains authoritative for published website copy, metadata, and implementation.
- Report conflicts explicitly; do not silently resolve them from convenience.
- Shared context may be unavailable when this repository is opened alone — say so instead of inferring.
- If this discussion reveals follow-up that is not the current task, append one short unreviewed entry to [../h5m-context/backlog/inbox.md](../h5m-context/backlog/inbox.md) — title, date, while, likely owner, source, note — then return to the task. Source is a link to where the context lives: a chat or agent session, a doc path, a decision id, or any other stable link. Optional when there is no stable link. Do not block a capture on finding a URL. Do not use a skill name or a short label that is not a link. Do not open `later.md`, `done.md`, or the rules file, and do not prioritize or start it.
