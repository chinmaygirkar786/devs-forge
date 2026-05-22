"use client";

import { useMemo, useState } from "react";

import {
  ActionButton,
  CopyButton,
  DropdownField,
  FieldLabel,
  SectionCard,
  StatusBanner,
  TextareaField,
  ToolGrid,
  useToolShortcuts,
} from "@/components/tool-ui";
import { formatYaml, minifyYaml } from "@/lib/tool-helpers";

const sampleYaml = `apiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: app-config\ndata:\n  DEBUG: "true"\n  RETRIES: 3`;

const yamlModeOptions = [
  { label: "Format YAML", value: "format" },
  { label: "Minify YAML", value: "minify" },
] as const;

const indentOptions = [
  { label: "2 spaces", value: "2" },
  { label: "4 spaces", value: "4" },
] as const;

export default function YamlFormatterTool() {
  const [mode, setMode] = useState<"format" | "minify">("format");
  const [space, setSpace] = useState("2");
  const [input, setInput] = useState(sampleYaml);

  const result = useMemo(() => {
    try {
      const indent = Number(space);
      return {
        output: mode === "format" ? formatYaml(input, indent) : minifyYaml(input),
        error: "",
      };
    } catch (error) {
      return {
        output: "",
        error: error instanceof Error ? error.message : "Invalid YAML.",
      };
    }
  }, [input, mode, space]);

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
        title="Source YAML"
        description="Format Kubernetes manifests, Compose files, and CI configs locally."
      >
        <FieldLabel label="Mode" />
        <DropdownField
          value={mode}
          options={[...yamlModeOptions]}
          onChange={(value) => setMode(value as "format" | "minify")}
        />

        {mode === "format" ? (
          <div className="mt-4 w-full sm:w-44">
            <FieldLabel label="Indentation" />
            <DropdownField value={space} options={[...indentOptions]} onChange={setSpace} />
          </div>
        ) : null}

        <div className="mt-4">
          <FieldLabel label="YAML input" />
          <TextareaField value={input} onChange={(event) => setInput(event.target.value)} />
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <ActionButton variant="ghost" onClick={() => setInput(sampleYaml)}>
            Load example
          </ActionButton>
          <ActionButton variant="ghost" onClick={() => setInput("")}>
            Clear
          </ActionButton>
        </div>
      </SectionCard>

      <SectionCard title="Output" description="Copy formatted YAML into repos or tickets.">
        <div className="mb-3 flex items-center justify-between gap-3">
          <FieldLabel label="Result" />
          <CopyButton value={result.output} />
        </div>
        <TextareaField value={result.output} readOnly spellCheck={false} />
        <div className="mt-4">
          {result.error ? (
            <StatusBanner tone="danger" text={result.error} />
          ) : (
            <StatusBanner tone="success" text="YAML transformed successfully." />
          )}
        </div>
      </SectionCard>
    </ToolGrid>
  );
}
