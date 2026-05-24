This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Cloudflare Workers

This app uses [OpenNext for Cloudflare](https://opennext.js.org/cloudflare). **Do not use `npm run build` alone** for production deploys.

```bash
npm ci
npm run cf:build    # or: npm run cf:deploy
```

In the Cloudflare dashboard, set the build command to **`npm run cf:build`** (not plain `next build`).

Environment variables for production (Workers build + runtime):

- `NEXT_PUBLIC_SITE_URL=https://devs-forge.com`
- `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` (optional; analytics disabled when unset)
- `SECURITY_CSP_DISABLE=true` (optional; disables CSP entirely — not recommended)

## Security headers

HTTP security headers (HSTS, `nosniff`, frame denial, Permissions-Policy, CSP) are defined in `src/lib/security-headers.ts` and applied via:

- `next.config.ts` (`headers()`)
- `src/middleware.ts` and `cloudflare/entry.worker.ts` (edge responses)
- `public/_headers` for Cloudflare static assets (keep in sync when editing the CSP)

CSP is **enforced** in production (PostHog via `/ingest`, Cloudflare Web Analytics allowed). Report-only was removed because it still fills Chrome DevTools Issues and lowers Lighthouse Best Practices. Set `SECURITY_CSP_DISABLE=true` only while debugging a new third-party script.

**Cloudflare dashboard (manual):** enable WAF managed rules, Bot Fight Mode with **allow verified bots** (Googlebot/Bingbot), and optional rate limits on `/ingest/*` so analytics cannot be abused as an open relay.

Responsible disclosure: [security.txt](https://devs-forge.com/.well-known/security.txt) (`public/.well-known/security.txt`).
