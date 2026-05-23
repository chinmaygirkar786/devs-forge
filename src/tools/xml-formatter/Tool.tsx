"use client";

import { useMemo, useState } from "react";

import {
  ActionButton,
  CopyButton,
  DropdownField,
  Field,
  FieldLabel,
  SectionCard,
  StatusBanner,
  TextareaField,
  ToolGrid,
  useToolShortcuts,
} from "@/components/tool-ui";
import { formatXml, minifyXml } from "@/lib/tool-helpers";

const sampleRss = `<?xml version="1.0"?><rss version="2.0"><channel><title>Devs Forge</title><item><title>JSON Formatter</title><link>https://devs-forge.com/tools/json-formatter</link></item></channel></rss>`;

const sampleSoap = `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><GetUser><id>42</id></GetUser></soap:Body></soap:Envelope>`;

const sampleInvalid = `<root><item>open</root>`;

const sampleLayout = `<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android" android:orientation="vertical"><TextView android:text="Hello"/></LinearLayout>`;

const xmlModeOptions = [
  { label: "Format XML", value: "format" },
  { label: "Minify XML", value: "minify" },
] as const;

const indentOptions = [
  { label: "2 spaces", value: "2" },
  { label: "4 spaces", value: "4" },
] as const;

export default function XmlFormatterTool() {
  const [mode, setMode] = useState<"format" | "minify">("format");
  const [space, setSpace] = useState("2");
  const [input, setInput] = useState(sampleRss);

  const result = useMemo(() => {
    try {
      const indent = Number(space);
      return {
        output: mode === "format" ? formatXml(input, indent) : minifyXml(input),
        error: "",
      };
    } catch (error) {
      return {
        output: "",
        error: error instanceof Error ? error.message : "Invalid XML.",
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
        title="Source XML"
        description="Pretty-print or minify XML documents with local validation—ideal for RSS, SOAP, and config snippets."
      >
        <FieldLabel label="Mode" />
        <DropdownField
          value={mode}
          options={[...xmlModeOptions]}
          onChange={(value) => setMode(value as "format" | "minify")}
        />

        {mode === "format" ? (
          <div className="mt-4">
            <Field label="Indentation">
              <DropdownField value={space} options={[...indentOptions]} onChange={setSpace} />
            </Field>
          </div>
        ) : null}

        <div className="mt-4">
          <FieldLabel label="XML input" />
          <TextareaField value={input} onChange={(event) => setInput(event.target.value)} />
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <ActionButton variant="ghost" onClick={() => setInput(sampleRss)}>
            RSS example
          </ActionButton>
          <ActionButton variant="ghost" onClick={() => setInput(sampleSoap)}>
            SOAP example
          </ActionButton>
          <ActionButton variant="ghost" onClick={() => setInput(sampleLayout)}>
            Layout example
          </ActionButton>
          <ActionButton variant="ghost" onClick={() => setInput(sampleInvalid)}>
            Invalid example
          </ActionButton>
          <ActionButton variant="ghost" onClick={() => setInput("")}>
            Clear
          </ActionButton>
        </div>
      </SectionCard>

      <SectionCard
        title="Transformed output"
        description="Copy formatted XML into tickets, documentation, or deployment configs."
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <FieldLabel label="Output" />
          <CopyButton value={result.output} />
        </div>
        <TextareaField value={result.output} readOnly spellCheck={false} />
        <div className="mt-4">
          {result.error ? (
            <StatusBanner tone="danger" text={result.error} />
          ) : (
            <StatusBanner tone="success" text="XML transformed successfully." />
          )}
        </div>
      </SectionCard>
    </ToolGrid>
  );
}
