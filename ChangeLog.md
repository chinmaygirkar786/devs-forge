# Change Log

## Step 1 - Project scaffold

- Bootstrapped a new Next.js App Router project with TypeScript, Tailwind CSS, ESLint, and `src/` directory support.
- Added `react-markdown` for the browser-based Markdown Previewer while keeping the dependency surface small.
- Added a `typecheck` script to support production-readiness checks.

## Step 2 - App shell and SEO foundation

- Replaced the starter page with a premium SaaS-style homepage shell and reusable layout.
- Added theme bootstrapping, sticky navigation, command palette support, structured metadata helpers, sitemap generation, robots generation, and Open Graph image routes.
- Added file-based site configuration, helper utilities, and local-only history storage.

## Step 3 - Affiliate system readiness

- Created placeholder-safe affiliate configuration and local click tracking in `src/lib/affiliate.ts`.
- Future monetization replacement points:
  - Replace placeholder partner URLs in `src/lib/affiliate.ts`.
  - Optionally connect click events to analytics once a provider is chosen.
  - Review CTA copy in `src/components/AffiliateBox.tsx` when live affiliate programs are available.

## Step 4 - Registry and content system

- Added a file-based registry in `src/tools/index.ts` with slug, metadata, keyword clusters, examples, related tool links, affiliate context, and lazy component references.
- Added helper accessors in `src/lib/tools.ts` for related tools, category sections, homepage data, and route generation.
- Added JSON-LD helpers and metadata builders in `src/lib/seo.ts`.

## Step 5 - MVP tool implementation

- Built all 12 browser-only tools:
  - JSON Formatter & Validator
  - JWT Decoder / Inspector
  - Base64 Encoder / Decoder
  - Regex Tester with explanation
  - UUID Generator
  - Color Palette Generator
  - Gradient Generator
  - Markdown Previewer
  - URL Encoder / Decoder
  - HTML Formatter / Minifier
  - Timestamp Converter
  - JSON to TypeScript Interface Generator
- Added shared tool UI primitives for copy actions, keyboard shortcuts, stats, toasts, responsive dropdowns, and consistent input/output panels.

## Step 6 - Verification

- Confirmed `npm run typecheck` passes.
- Confirmed `npm run lint` passes.
- Confirmed `npm run build` passes with statically generated homepage and tool routes.

## Step 8 - Cloudflare deployment routing fix

- Fixed tool routes returning 404 on Cloudflare by removing `dynamicParams = false`, which breaks dynamic route handling in `@opennextjs/cloudflare`.
- Added explicit static generation for tool pages and per-tool Open Graph images.
- Added `public/_routes.json` so non-static paths like `/tools/*` are handled by the Worker instead of falling through to a missing static file.
- Added Cloudflare build scripts (`cf:build`, `cf:preview`, `cf:deploy`) and declared `@opennextjs/cloudflare` + `wrangler` dependencies.
- Cloudflare deploy must run `npm run cf:build` (or `npm run cf:deploy`), not plain `next build` alone.

## Step 7 - UI polish and stability fixes

- Added `cursor-pointer` affordances to the theme toggle buttons and the navbar search trigger so interactive controls feel clickable.
- Fixed a React/Next client rendering warning by replacing the inline theme bootstrap `<script>` in `src/app/layout.tsx` with `next/script`.
- Fixed theme and local-history hydration mismatches by moving both to hydration-safe external store patterns.
- Fixed the `useSyncExternalStore` history snapshot loop by caching the localStorage-backed history snapshot in `src/lib/history.ts`.
- Standardized pill and tag alignment across the app so labels stay centered, avoid shrinking, and do not wrap awkwardly:
  - command palette shortcut pill
  - command palette category tag
  - navbar `Ctrl + K` pill
  - tool header tags
  - affiliate status tag
  - recently used chips
  - starter color chips
- Smoothed homepage card interactions by replacing the abrupt lift effect with a softer scale-based hover animation on:
  - the 4 featured cards in the landing section
  - the `Popular tools` cards
  - the cards inside the large searchable tools section below the landing card
- Fixed long example token overflow on tool pages by wrapping long strings like the JWT sample token inside the examples box.
- Temporarily hid the affiliate box at the shared tool layout level while keeping the underlying affiliate code available for future re-enabling.
- Replaced the native select in the UUID generator with a reusable custom dropdown component in `src/components/tool-ui.tsx` so the control fits the responsive product UI more cleanly.
- Fixed the reusable dropdown layering and menu surface so option lists render above neighboring cards and use an opaque background instead of showing text through the panel.
- Replaced the native mode select in the URL Encoder tool with the reusable dropdown component and increased spacing between the `Copy output` action row and the encoded output textbox.
- Replaced the native mode select in the HTML Formatter / Minifier tool with the reusable dropdown component and increased spacing between the `Copy output` action row and the transformed output textbox.
- Updated the Color Palette Generator to produce a fuller design-scale ramp from `50` through `900`, added copy-confirmation toast feedback for swatch clicks, added pointer affordances on starter colors and generated swatches, and applied contrast-aware black/white text colors based on swatch brightness.
- Added extra spacing between action rows and output editors in additional tool cards for better visual separation:
  - Gradient Generator `Preview and CSS`
  - Markdown Previewer `Markdown editor`
  - Timestamp Converter `Formatted output`
  - JSON to TypeScript Interface Generator `TypeScript interfaces`
- Added clearer pointer affordances to Gradient Generator interactive controls, including the `Copy output` button and the native color picker opener inputs.

## Step 9 - shadcn/ui migration and Vercel-inspired UI/UX overhaul

- Migrated the UI onto `shadcn/ui` (Radix primitives + Tailwind v4 CSS-first config): `Button`, `Input`, `Textarea`, `Select`, `Command`/`CommandDialog`, `Breadcrumb`, `Card`, `Badge`, `Skeleton`, `ToggleGroup`, `Sheet`, `Accordion`, and `Tooltip`.
  - Rebuilt `ThemeToggle` on `ToggleGroup`, `CommandPalette` on `Command` + `CommandDialog`, `Breadcrumbs` on `Breadcrumb`, and the tool UI primitives (`ActionButton`, `CopyButton`, `InputField`, `TextareaField`, `SelectField`, `DropdownField`) on their shadcn equivalents, preserving existing behavior, props, and PostHog analytics.
  - Deleted the superseded custom components/CSS once each replacement was verified (bespoke button/toggle/command-palette animation classes, `HomeExplorer`).
- Re-themed the app with a Vercel-inspired monochrome palette: near-black/white surfaces, flat 1px borders, minimal shadows, tighter radii, and a single restrained accent, defined via OKLCH CSS variables in `src/app/globals.css` alongside the full shadcn token set.
- Restructured navigation and the home page:
  - Trimmed the nav to `Categories` + `About` (logo still links home) and added a `Sheet`-based mobile menu.
  - Removed the flat `HomeExplorer` tool list and replaced it with `CategoryExplorer`, which folds search directly into the category browsing cards.
  - Added an AI-generated (Nano Banana) monochrome line-art hero illustration, rendered with `next/image` as a subtle background accent behind the hero copy.
- Simplified the tool detail page (`ToolLayout`): shrank the hero, removed the "Related developer tools" section, added a **Tags** block sourced from each tool's keyword cluster, and converted the FAQ section into a shadcn `Accordion`.
- Refreshed the footer and about page with a personal-info/social block: `siteConfig.social` links (email, LinkedIn, X, GitHub), a "Connect" icon-link column in the footer, and a "Built by" section on the About page.
- Removed remaining dead CSS (`.text-gradient`, unused `.tool-card-interactive` hover rules) left over from the pre-shadcn theme.
- Added a first-time test setup with Vitest + React Testing Library (`vitest.config.mts`, `npm run test`) and smoke tests covering theme preference cycling, category search filtering, and FAQ accordion expand/collapse — wired into `npm run validate`.

## Step 10 - Home, about, and tool-page polish after the overhaul

- Simplified the homepage hero CTA to a single **Browse all tools** button (removed the JSON Formatter and search-shortcut CTAs).
- Fixed Categories nav scrolling when the category section is still deferred: stable `#categories` hash target always mounts, `LazyWhenVisible` supports `forceVisible`, and same-page `/#categories` clicks update the hash so the section loads and scrolls.
- Tuned the hero illustration for both themes: soft light-grey in light mode, soft white in dark mode (`invert`), with lower opacity, blend modes, and a right-side mask so it sits behind the copy instead of competing with it.
- Filled in the About page bio (casual, ~110 words) and real social links in `siteConfig.social` / footer Connect icons.
- Added `cursor-pointer` to shared `Button`, `Toggle`, and `CommandItem` primitives so theme toggles, tool actions (Copy / Load example / Clear), and command-palette results show a pointer cursor.
- Fixed the footer heart icon color (`text-danger`) so it is visible in light and dark mode (it previously used near-invisible `text-accent`).
- Polished the FAQ accordion: horizontal padding on titles and answers, more space between title and body, and removed divider lines between items.
