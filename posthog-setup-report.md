<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into devs-forge. Client-side tracking is initialized via `instrumentation-client.ts` (Next.js 15.3+ convention), routing through a `/ingest` reverse proxy added to `next.config.ts`. Environment variables are stored in `.env.local`. Eleven events are captured across seven files, covering tool usage, output copying, command palette interactions, home search, and per-tool actions. No user authentication exists in this project, so no `identify()` calls were added.

| Event | Description | File |
|---|---|---|
| `tool_used` | User activates a tool page — primary funnel entry event. Captures `tool_slug`, `tool_title`, `tool_category`. | `src/components/ToolPageClient.tsx` |
| `tool_output_copied` | User copies tool output via the Copy button or Ctrl+Shift+C shortcut. Captures `method` and `output_length`. | `src/components/tool-ui.tsx` |
| `command_palette_opened` | User opens the Ctrl+K command palette. Captures `trigger` (`button` or `keyboard`). | `src/components/Navbar.tsx` |
| `command_palette_tool_selected` | User selects a tool from the palette. Captures `tool_slug`, `tool_title`, `search_query`, `source` (`search` or `recent`). | `src/components/CommandPalette.tsx` |
| `home_explorer_searched` | User types a search query in the home page explorer (debounced 600 ms, min 2 chars). Captures `query` and `results_count`. | `src/components/HomeExplorer.tsx` |
| `tool_example_loaded` | User loads example JSON in the JSON Formatter tool. Captures `tool_slug`. | `src/tools/json-formatter/Tool.tsx` |
| `tool_input_cleared` | User clears JSON Formatter input. Captures `tool_slug`. | `src/tools/json-formatter/Tool.tsx` |
| `jwt_example_loaded` | User loads the sample JWT token in the JWT Decoder tool. | `src/tools/jwt-decoder/Tool.tsx` |
| `jwt_input_cleared` | User clears the JWT Decoder input. | `src/tools/jwt-decoder/Tool.tsx` |
| `uuid_batch_generated` | User clicks "Generate fresh UUIDs". Captures `count`. | `src/tools/uuid-generator/Tool.tsx` |
| `uuid_count_changed` | User changes the UUID batch count. Captures `previous_count` and `new_count`. | `src/tools/uuid-generator/Tool.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/436322/dashboard/1619134)
- [Daily active tool users](https://us.posthog.com/project/436322/insights/Q0xiW1Sc) — unique users activating any tool per day
- [Tool-to-copy conversion funnel](https://us.posthog.com/project/436322/insights/gGNwfDd6) — conversion from tool activation to copying output
- [Most popular tools](https://us.posthog.com/project/436322/insights/eWeo84gf) — tool activations broken down by slug
- [Command palette usage](https://us.posthog.com/project/436322/insights/rPMX5P9P) — palette opens vs. tool selections
- [Copy conversion rate](https://us.posthog.com/project/436322/insights/dochDNGr) — daily % of tool users who copy output

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
