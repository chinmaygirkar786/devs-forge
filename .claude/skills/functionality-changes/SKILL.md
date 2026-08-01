# Devs Forge Claude Skill - Clarification Questions

Before implementing the requested UI/UX improvements, please answer the following questions. These answers will allow the Claude Skill to work autonomously without requiring further clarification.

---

## 1. Skill Behavior

What should this Claude Skill do?

- [ ] Execute all UI/UX improvements automatically.
- [ ] Analyze the project, create an implementation plan, then make changes.
- [ ] Both (Recommended).

---

## 2. Assumed Tech Stack

Should the skill assume the project always uses the following technologies?

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

- [ ] Yes
- [ ] No (Please specify.)

---

## 3. Landing Page Images

One of the requirements says:

> Add image using Nano.

What does **Nano** refer to?

- Google Nano AI
- Nano Banana
- Another image generation tool
- Existing project asset
- Something else

Please specify.

---

## 4. Theme Direction

The requirement says:

> Change web app theme

What should the new visual style be?

Examples:

- Dark only
- Light only
- GitHub inspired
- Vercel inspired
- Apple inspired
- Linear inspired
- Raycast inspired
- Modern glassmorphism
- Minimal monochrome
- Other

---

## 5. Home Page Layout

The requirements mention replacing the "All Tools" section with category-based browsing.

How should categories be displayed?

Example:

```text
AI Coding
  Cursor
  Claude Code
  Windsurf

Frontend
  React
  Next.js
  Tailwind

Backend
  Node.js
  Fastify

Testing
  Playwright
  Cypress
```

Or should categories be collapsible?

---

## 6. Navigation

Two requirements appear to overlap:

- Remove "Home" from navigation when already on Home.
- Remove all navigation items.

What should the final navigation contain?

Examples:

Option A

- Logo
- Compare
- Collections
- About
- Theme Toggle

Option B

- Logo
- Theme Toggle
- GitHub

Option C

Please describe your preferred navigation.

---

## 7. Tool Detail Page

Besides the following changes:

- Remove Related Tools
- Reduce hero/header height
- Convert FAQ into an accordion

Should the following sections remain?

- Reviews
- Alternatives
- Pricing
- Features
- Tags
- Similar tools

Please specify if anything else should be removed or redesigned.

---

## 8. Footer

The new footer should include:

- Portfolio
- Gmail
- LinkedIn
- X (Twitter)
- About Site
- Chinmay Girkar

Should it also include?

- GitHub
- Privacy Policy
- Terms
- RSS
- Sitemap

Or should the footer remain minimal?

---

## 9. About Page

The requirement says:

> Add my information.

Should the skill:

- Insert actual project information directly.
- Leave placeholders such as:

```text
{{NAME}}
{{PORTFOLIO}}
{{BIO}}
{{SOCIAL_LINKS}}
```

- Other

---

## 10. Scope of the Skill

Besides UI improvements, should the skill also:

- Refactor components
- Remove unused code
- Delete obsolete files
- Improve accessibility
- Improve SEO
- Improve performance
- Improve responsive layouts
- Update documentation
- Update tests

Select all that apply.

---

## 11. Autonomy Level

How opinionated should the Claude Skill be?

### Recommended

The skill should act like an experienced frontend engineer by:

- Understanding the existing project structure.
- Creating an implementation plan.
- Preserving the current architecture.
- Refactoring when beneficial.
- Removing dead code.
- Avoiding regressions.
- Maintaining consistent UI patterns.
- Updating documentation when needed.
- Providing a summary of all changes after completion.

Is this the expected behavior?

- [ ] Yes (Recommended)
- [ ] No (Please specify.)
