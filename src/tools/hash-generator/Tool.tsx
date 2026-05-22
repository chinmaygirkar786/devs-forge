"use client";

import { useEffect, useState } from "react";

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
import { type HashAlgorithm, hashText } from "@/lib/tool-helpers";

const sampleText = "developer-tools-hub";

const algorithmOptions = [
  { label: "SHA-256", value: "SHA-256" },
  { label: "SHA-384", value: "SHA-384" },
  { label: "SHA-512", value: "SHA-512" },
  { label: "SHA-1", value: "SHA-1" },
] as const;

export default function HashGeneratorTool() {
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>("SHA-256");
  const [input, setInput] = useState(sampleText);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!input.trim()) {
        setOutput("");
        setError("");
        return;
      }

      try {
        const digest = await hashText(input, algorithm);
        if (!cancelled) {
          setOutput(digest);
          setError("");
        }
      } catch (hashError) {
        if (!cancelled) {
          setOutput("");
          setError(
            hashError instanceof Error ? hashError.message : "Unable to generate hash.",
          );
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [algorithm, input]);

  useToolShortcuts({
    onCopy: () => {
      if (output) {
        void navigator.clipboard.writeText(output);
      }
    },
    onClear: () => setInput(""),
  });

  return (
    <ToolGrid>
      <SectionCard
        title="Text input"
        description="Generate SHA digests locally for checksums, cache keys, and webhook signatures."
      >
        <FieldLabel label="Algorithm" />
        <DropdownField
          value={algorithm}
          options={[...algorithmOptions]}
          onChange={(value) => setAlgorithm(value as HashAlgorithm)}
        />

        <div className="mt-4">
          <FieldLabel label="Plain text" />
          <TextareaField value={input} onChange={(event) => setInput(event.target.value)} />
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <ActionButton variant="ghost" onClick={() => setInput(sampleText)}>
            Load example
          </ActionButton>
          <ActionButton variant="ghost" onClick={() => setInput("")}>
            Clear
          </ActionButton>
        </div>
      </SectionCard>

      <SectionCard title="Hash output" description="Hex-encoded digest using Web Crypto in your browser.">
        <div className="mb-3 flex items-center justify-between gap-3">
          <FieldLabel label="Digest" />
          <CopyButton value={output} />
        </div>
        <TextareaField value={output} readOnly spellCheck={false} />
        <div className="mt-4">
          {error ? (
            <StatusBanner tone="danger" text={error} />
          ) : (
            <StatusBanner
              tone={output ? "success" : "neutral"}
              text={output ? `${algorithm} hash generated.` : "Enter text to hash."}
            />
          )}
        </div>
      </SectionCard>
    </ToolGrid>
  );
}
