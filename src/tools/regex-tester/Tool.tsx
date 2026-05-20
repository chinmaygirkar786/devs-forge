"use client";

import { useMemo, useState } from "react";

import {
  ActionButton,
  CopyButton,
  FieldLabel,
  InputField,
  SectionCard,
  StatPill,
  StatusBanner,
  TextareaField,
  ToolGrid,
  useToolShortcuts,
} from "@/components/tool-ui";
import { explainRegex } from "@/lib/tool-helpers";

const samplePattern = "[A-Z]{2,}-\\d+";
const sampleText = `Release notes:
- Fix AUTH-101 before merging
- Link API-42 in the changelog
- Ignore plain text that does not match`;

export default function RegexTesterTool() {
  const [pattern, setPattern] = useState(samplePattern);
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState(sampleText);

  const result = useMemo(() => {
    try {
      const regex = new RegExp(pattern, flags);
      const matchRegex = flags.includes("g")
        ? regex
        : new RegExp(pattern, `${flags}g`);
      const matches = [...text.matchAll(matchRegex)].map((match) => ({
        value: match[0],
        index: match.index ?? 0,
        groups: match.slice(1).filter(Boolean),
      }));

      return {
        matches,
        explanation: explainRegex(pattern),
        error: "",
      };
    } catch (error) {
      return {
        matches: [] as Array<{ value: string; index: number; groups: string[] }>,
        explanation: [] as string[],
        error: error instanceof Error ? error.message : "Invalid regex pattern.",
      };
    }
  }, [flags, pattern, text]);

  const matchesOutput = JSON.stringify(result.matches, null, 2);

  useToolShortcuts({
    onCopy: () => {
      if (matchesOutput) {
        void navigator.clipboard.writeText(matchesOutput);
      }
    },
    onClear: () => {
      setPattern("");
      setText("");
      setFlags("");
    },
  });

  return (
    <div className="space-y-6">
      <ToolGrid>
        <SectionCard
          title="Pattern setup"
          description="Test a regular expression against sample text and review matches instantly."
        >
          <FieldLabel label="Regex pattern" hint="Without surrounding slashes" />
          <InputField value={pattern} onChange={(event) => setPattern(event.target.value)} />

          <div className="mt-4">
            <FieldLabel label="Flags" hint="Example: g, i, m" />
            <InputField value={flags} onChange={(event) => setFlags(event.target.value)} />
          </div>

          <div className="mt-4">
            <FieldLabel label="Sample text" />
            <TextareaField value={text} onChange={(event) => setText(event.target.value)} />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <ActionButton
              variant="ghost"
              onClick={() => {
                setPattern(samplePattern);
                setFlags("g");
                setText(sampleText);
              }}
            >
              Load example
            </ActionButton>
            <ActionButton
              variant="ghost"
              onClick={() => {
                setPattern("");
                setFlags("");
                setText("");
              }}
            >
              Clear
            </ActionButton>
          </div>
        </SectionCard>

        <SectionCard
          title="Regex explanation"
          description="A lightweight token summary to help review the shape of your pattern."
        >
          {result.error ? (
            <StatusBanner tone="danger" text={result.error} />
          ) : (
            <div className="space-y-3">
              {result.explanation.map((item) => (
                <div
                  key={item}
                  className="surface-muted rounded-2xl px-4 py-3 text-sm text-muted-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </ToolGrid>

      <SectionCard
        title="Match inspector"
        description="Review every match and capture group without leaving the browser."
      >
        <div className="mb-4 grid gap-4 sm:grid-cols-3">
          <StatPill label="Matches" value={result.matches.length} />
          <StatPill label="Flags" value={flags || "none"} />
          <StatPill label="Pattern length" value={pattern.length} />
        </div>

        <div className="mb-5 flex items-center justify-between gap-3">
          <FieldLabel label="Match output" />
          <CopyButton value={matchesOutput} />
        </div>
        <TextareaField value={matchesOutput} readOnly spellCheck={false} />
      </SectionCard>
    </div>
  );
}
