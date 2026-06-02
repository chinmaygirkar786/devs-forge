# Google Search Console — sitemap, indexing, crawl errors

Production site: **https://devs-forge.com**

## 1. Submit sitemap (manual in GSC)

1. Open [Google Search Console](https://search.google.com/search-console) → property **`https://devs-forge.com`**.
2. **Indexing → Sitemaps**.
3. Submit **`sitemap.xml`** (full URL: `https://devs-forge.com/sitemap.xml`).
4. After 24–48h, confirm status **Success** and **~26** discovered URLs (3 static + 4 category hubs + 19 tools).

**Repo sources:** `src/app/sitemap.ts`, `public/robots.txt` (static; `Sitemap:` points to `https://devs-forge.com/sitemap.xml`).

If GSC shows **Couldn’t fetch**:

- Run `npm run verify:crawl` (or `scripts/verify-googlebot-crawl.sh`).
- Deploy latest build and **purge Cloudflare cache** for `/sitemap.xml`, `/robots.txt`, and `/_next/static/chunks/*`.

## 2. URL inspection (10 core tools)

Request indexing only after **Test live URL** shows **URL is available to Google**.

| Tool                | URL                                                  |
| ------------------- | ---------------------------------------------------- |
| JSON Formatter      | https://devs-forge.com/tools/json-formatter          |
| JWT Decoder         | https://devs-forge.com/tools/jwt-decoder             |
| Regex Tester        | https://devs-forge.com/tools/regex-tester            |
| Base64 Encoder      | https://devs-forge.com/tools/base64-encoder          |
| UUID Generator      | https://devs-forge.com/tools/uuid-generator          |
| Color Palette       | https://devs-forge.com/tools/color-palette-generator |
| URL Encoder         | https://devs-forge.com/tools/url-encoder             |
| HTML Formatter      | https://devs-forge.com/tools/html-formatter          |
| Timestamp Converter | https://devs-forge.com/tools/timestamp-converter     |
| JSON to TypeScript  | https://devs-forge.com/tools/json-to-typescript      |

Also inspect once: `/`, `/tools`, `/sitemap.xml`.

## 3. Automated production verification

```bash
npm run verify:crawl
```

Checks (Googlebot user-agent): `robots.txt`, `sitemap.xml` (200 + 19 URLs), 10 core tool pages, home, tools index, and a sample `/_next/static/chunks/*.js` load.

**Last verified:** 2026-05-22 — all checks passed.

## 4. GSC issue → action matrix

| GSC issue                                                                              | Likely cause                                      | Action                                                                               |
| -------------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **Blocked by robots.txt** on `/icon`, `/apple-icon`, `/sw.js`, `/manifest.webmanifest` | Intentional in `public/robots.txt`                | **No fix** — not needed for rankings                                                 |
| **403** on `/_next/static/chunks/*.js`                                                 | Chunk guard without crawler bypass or stale cache | Deploy `src/lib/chunk-access-guard.ts`; purge CF cache for chunks                    |
| **robots.txt not valid** / **503** / redirect on `/robots.txt`                         | Edge policy blocked non-Googlebot fetches         | Deploy latest; `robots.txt` must be **200** for all clients (`npm run verify:crawl`) |
| **Page with redirect** on `/icon` (normal browser)                                     | `route-access-policy` redirects tab navigation    | **Expected** for users; crawlers still get **200** for OG/icon when allowed          |
| **Soft 404** / **Crawled – not indexed**                                               | New site / authority                              | On-page SEO + time; not a robots bug                                                 |
| **Server error (5xx)**                                                                 | Worker / Cloudflare                               | Security → Events, Wrangler logs                                                     |
| **Sitemap couldn’t read**                                                              | Wrong property, 403, non-XML                      | Fix deploy; expect `Content-Type: application/xml`                                   |
| **Alternate page with proper canonical**                                               | —                                                 | Usually valid; confirm canonical matches tool URL                                    |

For targeted code fixes, export **Indexing → Pages** (or **Why pages aren’t indexed**) with example URLs and error types.

## 5. Success criteria

- GSC **Sitemaps**: `sitemap.xml` **Success**, ~26 URLs.
- **URL inspection** for core tools: “URL is on Google” or “Crawled” within ~1–2 weeks.
- `npm run verify:crawl` passes (no 403 on pages or chunks for Googlebot).
- Crawl errors limited to intentional PWA/icon blocks or “Discovered – not indexed”, not 5xx/chunk 403.
