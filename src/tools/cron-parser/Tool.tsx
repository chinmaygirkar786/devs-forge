"use client";

import { useMemo, useState } from "react";

import {
  ActionButton,
  CopyButton,
  FieldLabel,
  SectionCard,
  StatusBanner,
  TextareaField,
  ToolGrid,
  useToolShortcuts,
} from "@/components/tool-ui";
import { describeCron } from "@/lib/tool-helpers";

const sampleCron = "0 */6 * * *";

export default function CronParserTool() {
  const [input, setInput] = useState(sampleCron);

  const result = useMemo(() => {
    try {
      return {
        output: describeCron(input),
        error: "",
      };
    } catch (error) {
      return {
        output: "",
        error: error instanceof Error ? error.message : "Invalid cron expression.",
      };
    }
  }, [input]);

  useToolShortcuts({
    onCopy: () => {
      if (result.output) {
        void navigator.clipboard.writeText(result.output);
      }
    },
    onClear: () => setInput(""),
  });

  return (
    <ToolGrid>
      <SectionCard
        title="Cron expression"
        description="Translate standard 5-field cron syntax into plain English."
      >
        <FieldLabel label="Expression" />
        <TextareaField
          value={input}
          onChange={(event) => setInput(event.target.value)}
          spellCheck={false}
        />

        <div className="mt-4 flex flex-wrap gap-3">
          <ActionButton variant="ghost" onClick={() => setInput(sampleCron)}>
            Load example
          </ActionButton>
          <ActionButton variant="ghost" onClick={() => setInput("15 2 * * 1-5")}>
            Weekday example
          </ActionButton>
          <ActionButton variant="ghost" onClick={() => setInput("")}>
            Clear
          </ActionButton>
        </div>
      </SectionCard>

      <SectionCard
        title="Human-readable schedule"
        description="Use when reviewing jobs, crontab entries, or CI schedules."
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <FieldLabel label="Description" />
          <CopyButton value={result.output} />
        </div>
        <TextareaField value={result.output} readOnly spellCheck={false} />
        <div className="mt-4">
          {result.error ? (
            <StatusBanner tone="danger" text={result.error} />
          ) : (
            <StatusBanner tone="success" text="Cron expression parsed successfully." />
          )}
        </div>
      </SectionCard>
    </ToolGrid>
  );
}
