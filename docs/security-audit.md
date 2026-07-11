# Security Audit Report

Date: June 26, 2026

Scope: High Five Moments public waitlist website before production deployment.

Status: Manual and automated/static review completed. An independent challenge review was incorporated. No code fixes from this report have been applied yet.

## Executive Summary

Overall launch readiness: not production-ready yet.

The codebase foundation is solid for a small pre-launch marketing site: one mutable server action, no API route sprawl, no auth/cookie surface, server-only service-role Supabase access, RLS verified live, no tracked secrets, and minimal analytics. The production blocker is narrower and more concrete than "the site is insecure": the waitlist action is currently an unauthenticated outbound-email amplification primitive.

Anyone can submit arbitrary email addresses and make the verified `highfivemoments.app` domain send a welcome email to those people. That can burn Resend quota, create spam complaints, damage sender reputation, and undermine trust before launch.

Top 3 risks:

1. Unauthenticated email amplification through the waitlist action.
2. Email/privacy compliance mismatch: privacy policy promises unsubscribe links, while the email lacks unsubscribe/opt-out and physical mailing address details.
3. Preview/deployment hygiene: public preview deployments must not write production Supabase data or send production Resend email.

Production block: yes, until Phase 0 items are fixed and verified.

## Asset Map

Sensitive assets:

- Waitlist email addresses.
- Consent state, signup timestamp, and signup source.
- `SUPABASE_SERVICE_ROLE_KEY`.
- `RESEND_API_KEY`.
- Resend MCP full-access key in local ignored env.
- Vercel environment variables and runtime logs.
- Domain and sender reputation for `highfivemoments.app`.
- Brand trust around private couple/relationship context.

Public entry points:

- `/`
- `/privacy`
- `/thank-you`
- `/robots.txt`
- `/sitemap.xml`
- `/opengraph-image`
- `/apple-icon`
- `joinWaitlist` server action from `src/app/actions/waitlist.ts`

Third-party services:

- Supabase for waitlist storage.
- Resend for welcome email.
- Vercel Analytics for page/conversion analytics.
- Vercel for planned hosting/runtime and preview deployments.
- Cloudflare for DNS and inbound email routing.
- Namecheap for registration.
- npm package supply chain.

Trust boundaries:

- Browser or non-browser client to Next.js server action.
- Server action to Supabase using service role.
- Server action to Resend using API key.
- Vercel runtime/logs as processor of secrets and email addresses.
- Preview deployments versus production services.
- Cloudflare/Resend/Gmail boundary for domain and email operations.

## Verified Implementation Notes

Routes and server surfaces:

- No `route.ts` API handlers found.
- No `middleware.ts` or `proxy.ts` found.
- The only server-side mutation surface found is `joinWaitlist`.
- No authentication/session/cookie logic exists.
- No public CORS logic exists.
- Next 16 Server Actions provide same-origin CSRF protection by default, but this does not stop non-browser automation from calling the action with matching headers.
- Next 16 Server Actions cap request bodies at 1 MB by default, which lowers request-size risk.

Supabase:

- The remote `high-five-moments` Supabase project is active and healthy.
- Remote table `public.waitlist_signups` has RLS enabled.
- Supabase security and performance advisors returned no lints.
- The repo migration creates `waitlist_signups` with a unique email constraint and a deny-all RLS policy.
- The service role client is imported from a `server-only` module.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is documented as required, but no browser Supabase client was found. It can likely be removed from required setup unless a future client use is added.

Resend:

- Resend domain `highfivemoments.app` is verified.
- Sending is enabled.
- Open tracking and click tracking are disabled.
- No Resend webhooks are configured.
- Two API keys were visible by name: one MCP key and one website key. Secret values were not printed or inspected.

Environment files:

- `git ls-files ".env*"` returned no tracked env files.
- Ignored local env files exist: `.env`, `.env.local`, `.env.resend-mcp`, `.env.example`.
- Secret values were not printed or inspected.

Build/static checks:

- TypeScript no-emit check passed.
- Production build passed.
- Lint currently fails on a React lint error in `src/components/site-header.tsx`; this is not a direct security bug but may block CI.

Dependency checks:

- `npm audit --omit=dev --audit-level=moderate` reports a moderate PostCSS advisory through `next@16.2.9`.
- Full `npm audit` also reports a moderate `uuid` advisory through the dev-only `resend-mcp` chain.
- The PostCSS advisory appears low exploitability for this repo because no user-controlled CSS generation was found, but it should be monitored and fixed via safe upgrades.
- Do not run `npm audit fix --force` if it proposes a breaking downgrade.

## Findings

| ID | Severity | Area | File/path | Evidence | Risk | Recommended fix | Production blocker? |
|---|---|---|---|---|---|---|---|
| HFM-01 | High | Email amplification / waitlist abuse | `src/app/actions/waitlist.ts` | Server action accepts any submitted email, inserts it, and may call Resend to send a welcome email. No durable rate limit, ownership proof, bot challenge, or platform abuse control exists. | Attackers can make the verified domain email arbitrary strangers, causing spam complaints, sender reputation damage, Resend quota/cost abuse, and possible account suspension. | Add a bot challenge and/or platform abuse control, plus durable per-IP and per-normalized-email throttling. Do not use in-memory counters on Vercel; use Vercel Firewall/rate limits, Cloudflare Turnstile, Upstash/Vercel KV, or a Supabase-backed limiter. | yes |
| HFM-02 | Medium | Privacy / enumeration | `src/app/actions/waitlist.ts` | Duplicate unique violation returns `{ success: true, alreadyOnList: true }`. | Attackers can probe whether a known email joined a relationship-focused waitlist. UI redirects identically, but the response body leaks state. | Return the same generic `{ success: true }` shape for new and duplicate signups. Optionally equalize timing; otherwise accept timing as low residual risk. | should fix |
| HFM-03 | High | Email compliance/trust | `src/emails/welcome.tsx`, `src/app/privacy/page.tsx` | Policy says users may unsubscribe using links in emails; welcome email has no unsubscribe or opt-out link. The email also lacks physical mailing address details while saying "I'll occasionally share meaningful updates." | Compliance and trust mismatch. The welcome email is at least partly marketing, not purely transactional. | Add working unsubscribe/opt-out support, preferably including `List-Unsubscribe` headers if supported by the sending flow, and include required sender/contact address details. Or change copy/policy until implemented. | yes |
| HFM-04 | Medium | Preview/deployment separation | `README.md`, `docs/infrastructure.md` | Docs say add env vars for Production and Preview. If previews use production Supabase/Resend envs, public preview URLs can write production waitlist rows and send real emails. Preview Deployment Protection was not verified. | Accidental production data writes and real emails from preview deployments. | Enable Vercel Preview Deployment Protection. Use separate preview Supabase/Resend config, or gate Resend sending behind a production-only flag and point previews at non-production storage. | should fix |
| HFM-05 | Medium | Logging/privacy | `src/app/actions/waitlist.ts` | Raw `insertError`, `emailError`, and caught `error` are logged. | Provider errors may include submitted email addresses or internal details in Vercel logs. | Log sanitized error code/category only. Avoid logging submitted email or raw provider payloads. | should fix |
| HFM-06 | Low | Input validation/request size | `src/app/actions/waitlist.ts`, `src/components/waitlist-form.tsx` | Email uses `.email()` only; honeypot has no max length; inputs have no `maxLength`. The action lowercases/trims only at insert time. | Low resource risk because Server Actions have a 1 MB body cap, but schema/input bounds are still better hygiene. | Normalize in schema, add `email.max(254)`, add a short honeypot max, and mirror with input `maxLength`. | no |
| HFM-07 | Medium | Security headers | `next.config.ts`, `vercel.json` | No HSTS, referrer policy, permissions policy, frame protection, or content-type hardening configured. No CSP configured. | Weak browser baseline if XSS, framing, referrer leakage, or MIME-sniffing issues appear later. | Ship cheap safe headers now: HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, and frame protection via `X-Frame-Options: DENY` and/or `frame-ancestors 'none'`. Defer strict CSP to report-only/post-launch unless easy. | should fix |
| HFM-08 | Medium | UX/trust failure state | `src/app/actions/waitlist.ts`, `src/app/thank-you/page.tsx` | If Resend env is missing or email send fails, the action still returns success; thank-you page says "Check your inbox." | Users may expect an email that never arrives; support and trust issue. | Track email send status internally, alert on failures, soften thank-you copy, or retry asynchronously. | no |
| HFM-09 | Medium | Dependency advisory | `package-lock.json`, `next@16.2.9` | Production `npm audit` reports PostCSS advisory through Next. Suggested force fix is unsafe. | Low current exploitability, but an unresolved production advisory remains. | Upgrade Next when a patched safe version is available. Do not force downgrade. | no |
| HFM-10 | Low | Frontend XSS | `src/app/layout.tsx` | Uses `dangerouslySetInnerHTML` for JSON-LD generated from constants/env-derived `SITE_URL`. `JSON.stringify` does not escape `<` or `</script>`. | Low practical risk because values are operator-controlled today. Risk increases if request/user-derived data is added later. | Keep JSON-LD values static, or escape `<` as `\u003c` with a safe serializer before inserting script content. | no |
| HFM-11 | Low | Email privacy | `src/emails/welcome.tsx` | Email loads Google Fonts from `fonts.googleapis.com`. | Minor privacy/perception issue for a privacy-first brand. | Use system fonts in email. | no |
| HFM-12 | Low | Analytics | `src/components/waitlist-form.tsx` | Sends only `track("Waitlist Submit")`; no email is included. | Current implementation is fine; future regression would be privacy-sensitive. | Keep analytics event payloads free of email or relationship data. | no |
| HFM-13 | Low | Production dependency boundary | `package.json` | `shadcn` CLI is listed under production `dependencies`. | Unnecessary production supply-chain surface. | Move to `devDependencies` or remove if not needed at runtime. | no |
| HFM-14 | Low | Env/docs hygiene | `README.md`, codebase | `NEXT_PUBLIC_SUPABASE_ANON_KEY` is documented as required, but no browser Supabase client was found. | Not a vuln because anon keys are public by design and RLS denies access, but it is an unnecessary public config knob. | Drop from required setup unless/ until a client Supabase use is added. | no |
| HFM-15 | Low | Privacy-policy completeness | `src/app/privacy/page.tsx` | Policy names Supabase and Resend, but does not clearly name Vercel as hosting/logging/analytics processor and does not state data-retention period. | Minor trust/compliance gap for a privacy-first brand. | Add Vercel to processor/analytics wording and include a simple retention/deletion statement. | no |

## Positive Security Observations

- No tracked env files were found.
- Service-role Supabase access is isolated in a `server-only` module.
- Supabase RLS is enabled on the only table.
- Supabase advisors are clean.
- No raw API route handlers were found.
- No auth/session code exists, so auth-specific risks are currently out of scope.
- Next Server Actions provide same-origin CSRF protection by default.
- Next Server Actions have a default 1 MB request body cap.
- No `eval`, `new Function`, `innerHTML`, or unsafe dynamic redirect patterns were found.
- External links in the privacy page use `rel="noopener noreferrer"` with `target="_blank"`.
- Vercel Analytics event currently sends only a generic event name and no email address.

## Fix Plan

### Phase 0: Must Fix Before Production

1. Stop outbound email amplification on `joinWaitlist`.
   - Add a bot challenge and/or platform abuse control.
   - Add durable per-IP and per-normalized-email throttling.
   - Do not implement rate limiting with process memory on Vercel.
2. Reconcile the email/privacy claim before sending real launch emails.
   - Add unsubscribe/opt-out handling and sender address details, or change copy/policy until that exists.
3. Separate preview from production.
   - Enable Vercel Preview Deployment Protection.
   - Ensure previews cannot write production Supabase data or send production Resend email.

### Phase 1: Should Fix Before Public Launch

1. Remove duplicate-membership signal from the server action response.
2. Sanitize Supabase and Resend error logging.
3. Add cheap safe security headers: HSTS, nosniff, frame protection, referrer policy, and permissions policy.
4. Add max lengths and normalization to the waitlist schema and inputs.
5. Add monitoring/alerts for signup spikes and Resend send failures.
6. Fix lint so static checks are clean in CI.
7. Monitor and upgrade dependency advisories safely.

### Phase 2: Hardening After Launch

1. Add report-only CSP, then tighten if useful.
2. Add double opt-in if the waitlist becomes a broader marketing list.
3. Remove external font loading from email.
4. Move dev-only tooling out of production dependencies.
5. Drop unused `NEXT_PUBLIC_SUPABASE_ANON_KEY` setup docs unless client Supabase is introduced.
6. Add simple regression checks for "no email in analytics payloads."
7. Expand privacy policy retention and processor wording.

## Do Not Over-Engineer

Unnecessary right now:

- Full authentication system. There are no user accounts.
- Complex RBAC. There is only one waitlist table.
- WAF-first architecture. Start with app/platform throttling and a lightweight bot challenge.
- Heavy bot-detection vendors. Turnstile plus durable throttling is enough for launch.
- Custom CSRF framework. Server Actions already provide same-origin CSRF protection, and there is no authenticated cookie/session action.
- Complex CORS work. No public API route handlers expose CORS.
- Strict CSP as a launch blocker. Start with cheap headers and use report-only CSP later.
- Advanced audit logging. Basic sanitized operational logs are enough for this phase.

Can wait:

- Double opt-in, unless launch emails become ongoing marketing campaigns.
- Formal vendor risk program.
- Complex consent-management UI.
- Dedicated mailbox provider, unless operational support volume grows.

## Verification Plan

Email amplification controls:

- Attempt repeated signups from the same IP and normalized email.
- Confirm later attempts fail before Supabase insert and before Resend send.
- Confirm non-browser scripted requests are throttled or challenged.
- Confirm legitimate low-volume users still succeed.
- Confirm the limiter works across deployments/instances and does not rely on in-memory state.

Duplicate privacy:

- Submit the same email twice.
- Confirm the server response and UI behavior are indistinguishable from a new signup.
- Decide whether to equalize timing or accept timing as a low residual risk.

Unsubscribe/opt-out:

- Send the welcome email to a test inbox.
- Confirm the unsubscribe/opt-out path works.
- Confirm email content includes required sender/contact address details.
- Confirm the privacy policy matches actual behavior.

Preview/prod env separation:

- Deploy a preview.
- Confirm preview access is protected if intended.
- Confirm preview writes do not hit the production Supabase table.
- Confirm preview does not send production Resend email.

Log hygiene:

- Force a Supabase failure locally or in a safe preview.
- Force a Resend failure in a safe preview.
- Confirm logs do not contain submitted email addresses or raw provider payloads.

Security headers:

- Inspect deployed response headers for `/`, `/privacy`, `/thank-you`, `/robots.txt`, and `/sitemap.xml`.
- Confirm HSTS, nosniff, frame protection, referrer policy, and permissions policy are present.
- If CSP is added, start report-only and confirm compatibility with Next assets, Vercel Analytics, JSON-LD, images, and fonts.

Validation:

- Submit oversized email and honeypot values.
- Confirm rejection before database or email calls.

Analytics:

- Confirm Vercel custom events contain only the event name and no email/form data.

Supabase:

- Re-run Supabase security and performance advisors after any migration changes.
- Confirm RLS remains enabled on `public.waitlist_signups`.

Dependencies:

- Re-run `npm audit --omit=dev --audit-level=moderate`.
- Upgrade only through safe package updates, not `npm audit fix --force` if it proposes breaking downgrades.

## Checks Completed

Safe local/static commands run during the audit:

- `npm audit --audit-level=moderate`
- `npm audit --omit=dev --audit-level=moderate`
- `npm outdated --long`
- `npm run lint`
- `npm exec tsc -- --noEmit --pretty false`
- `npm run build`
- `npm ls next postcss uuid resend-mcp resend svix --all`
- `npm ls --omit=dev --depth=0`
- `git ls-files ".env*"`
- `git status --short --ignored`
- Targeted static searches for secrets, unsafe HTML/eval, redirects, cookies/headers, server actions/API routes, validation, logging, middleware/proxy.
- Supabase MCP read-only checks for projects, table schema/RLS, security advisors, and performance advisors.
- Resend MCP read-only checks for domain status, API key names, and webhooks.
- Next 16 local docs checked for Server Actions same-origin CSRF protection and default request body size limit.

Checks not completed:

- Secret values in local env files were not inspected to avoid exposing secrets.
- Actual Vercel production settings were not verified because the visible Vercel team had no imported project at audit time.
- Vercel Preview Deployment Protection state was not verified.
- No live attacks, production probing, signup flooding, or third-party abuse testing were performed.

