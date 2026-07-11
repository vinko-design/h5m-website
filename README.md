# High Five Moments — Waitlist Website

A Next.js waitlist site for **High Five Moments**, a couples app for shared goals, calendar planning, and staying aligned.

## Tech stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS
- **shadcn/ui** — form components
- **Supabase** — waitlist signups storage
- **Resend** + React Email — welcome emails
- **Vercel Analytics** — traffic and conversion tracking

## Local development

1. Clone the repo and install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env.local
   ```

3. Fill in `.env.local` with your Supabase and Resend credentials (see setup below).

4. Run the dev server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Infrastructure & DNS

The domain uses **four services** — each with one job:

| Service | Job |
|---------|-----|
| **Namecheap** | Domain registration (renewals only) |
| **Cloudflare** | DNS + inbound email (`hello@` → Gmail) |
| **Vercel** | Host the Next.js website |
| **Resend** | Send waitlist welcome emails |

Full diagram, DNS record tables, API key layout, and checklists:

**→ [docs/infrastructure.md](./docs/infrastructure.md)**

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-only key for waitlist inserts |
| `RESEND_API_KEY` | Yes (prod) | Resend **send-only** API key for welcome emails |
| `RESEND_FROM_EMAIL` | Yes (prod) | Verified sender address only, e.g. `hello@highfivemoments.app` (display name is added automatically) |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical URL, e.g. `https://highfivemoments.app` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Yes (prod) | Cloudflare Turnstile site key (public) |
| `TURNSTILE_SECRET_KEY` | Yes (prod) | Cloudflare Turnstile secret key (server-only) |
| `WAITLIST_PRODUCTION_ENABLED` | Yes (prod only) | Set to `true` on **Production** only — gates Supabase writes and Resend sends |
| `UNSUBSCRIBE_SECRET` | Recommended | Server-only HMAC secret for unsubscribe links; falls back to service role key |
| `MAILING_ADDRESS` | Deferred | Physical postal address for welcome email footer (CAN-SPAM). Omit until you have a business or P.O. Box — see [docs/infrastructure.md](./docs/infrastructure.md) checklist |

For Cursor Resend MCP, use a separate full-access key in `.env.resend-mcp` (see [docs/infrastructure.md](./docs/infrastructure.md)).

After linking to Vercel: `vercel env pull .env.local`

## Supabase setup

1. Create a free project at [supabase.com](https://supabase.com).
2. In the SQL editor (or via Supabase CLI), run the migration in:

   ```
   supabase/migrations/20250620000000_create_waitlist_signups.sql
   ```

3. Copy your project URL, anon key, and service role key into `.env.local` / Vercel env vars.
4. View signups in the Supabase dashboard → Table Editor → `waitlist_signups`.

## Resend setup

1. Create an account at [resend.com](https://resend.com).
2. Add domain `highfivemoments.app` and add DNS records in **Cloudflare** (see [docs/infrastructure.md](./docs/infrastructure.md)).
3. Create a **send-only** API key → `RESEND_API_KEY` in `.env.local` / Vercel.
4. Set `RESEND_FROM_EMAIL=hello@highfivemoments.app` (address only; emails send as `High Five Moments <hello@...>`).
5. Test a signup locally once the domain shows **verified** in Resend.

## Vercel deployment

1. Push the repo to GitHub.
2. Import the project in [Vercel](https://vercel.com) (or run `vercel link`).
3. Add environment variables:
   - **Production:** all variables above, including `WAITLIST_PRODUCTION_ENABLED=true`, Turnstile keys, and Resend/Supabase production values.
   - **Preview:** Turnstile keys and `NEXT_PUBLIC_SITE_URL` only if you need UI testing. Do **not** set `WAITLIST_PRODUCTION_ENABLED` on Preview — signups validate but do not write production data or send email.
4. **Enable Preview Deployment Protection** in Vercel → Project → Settings → Deployment Protection.
5. Add `highfivemoments.app` in **Vercel → Project → Settings → Domains**.
6. Add the A/CNAME records Vercel shows into **Cloudflare DNS** (grey cloud). See [docs/infrastructure.md](./docs/infrastructure.md).
7. `vercel.json` redirects `www.highfivemoments.app` → `highfivemoments.app` (apex canonical).
8. **Enable Vercel Analytics** in project settings → Analytics (required for conversion tracking).
9. Run the Supabase migration in `supabase/migrations/20250626000000_waitlist_security.sql`.
10. Deploy and test a full waitlist signup on production.
11. Optional: configure Vercel log alerts for `[waitlist] rate_limit_exceeded` and `[waitlist] resend_send_failed`.

## Analytics & conversion KPI

Vercel Analytics tracks:

1. **Home page views** — automatic on `/`
2. **Waitlist Submit** — custom event fired on successful form submission
3. **Thank-you page views** — automatic on `/thank-you`

**Primary KPI:** waitlist conversion rate = `Waitlist Submit` events (or `/thank-you` page views) ÷ home page visitors.

In the Vercel dashboard → Analytics → filter by custom events to monitor `Waitlist Submit` over time.

## Google Search Console

After deploying to production:

1. Verify `highfivemoments.app` at [Google Search Console](https://search.google.com/search-console).
2. Submit the sitemap: `https://highfivemoments.app/sitemap.xml`
3. Monitor indexing, search queries, impressions, and crawl errors over the following weeks.

## Project structure

```
src/
├── app/
│   ├── actions/waitlist.ts    # Server Action — validate, insert, email
│   ├── privacy/page.tsx       # Privacy policy
│   ├── thank-you/page.tsx     # Post-signup confirmation
│   ├── opengraph-image.tsx    # Dynamic OG image (1200×630)
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── layout.tsx             # Metadata, JSON-LD, Analytics
│   └── page.tsx               # Home page
├── components/
│   ├── hero.tsx
│   ├── features.tsx
│   ├── social-proof.tsx       # Hidden at launch (SHOW_SOCIAL_PROOF=false)
│   ├── footer.tsx
│   ├── waitlist-form.tsx
│   └── ui/                    # shadcn components
├── emails/welcome.tsx         # React Email welcome template
└── lib/
    ├── site-config.ts
    └── supabase/
        ├── server.ts          # Service role client
        └── types.ts
supabase/migrations/           # SQL schema
```

## License

Private — High Five Moments.
