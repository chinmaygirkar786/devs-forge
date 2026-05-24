"use client";

import { capturePosthog } from "@/lib/posthog";
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
import { inspectJwt } from "@/lib/tool-helpers";

const sampleToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEyMyIsIm5hbWUiOiJEZXYgVXNlciIsImlhdCI6MTcxNTYxOTYwMCwiZXhwIjoxNzE1NjIzMjAwLCJpc3MiOiJkZXZlbG9wZXItdG9vbHMtaHViIn0.signature";

export default function JwtDecoderTool() {
  const [input, setInput] = useState(sampleToken);

  const result = useMemo(() => {
    try {
      return {
        data: inspectJwt(input),
        error: "",
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "Invalid token.",
      };
    }
  }, [input]);

  const output = result.data
    ? JSON.stringify(
        {
          header: result.data.header,
          payload: result.data.payload,
          signature: result.data.signature,
        },
        null,
        2,
      )
    : "";

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
        title="JWT token"
        description="Paste a bearer token to inspect header and payload claims locally."
      >
        <FieldLabel label="Encoded token" hint="No network requests" />
        <TextareaField
          value={input}
          onChange={(event) => setInput(event.target.value)}
          spellCheck={false}
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <ActionButton
            variant="ghost"
            onClick={() => {
              setInput(sampleToken);
              capturePosthog("jwt_example_loaded");
            }}
          >
            Load example
          </ActionButton>
          <ActionButton
            variant="ghost"
            onClick={() => {
              setInput("");
              capturePosthog("jwt_input_cleared");
            }}
          >
            Clear
          </ActionButton>
        </div>
      </SectionCard>

      <SectionCard
        title="Decoded token"
        description="Review standard claims like issuer, subject, issued at, and expiration."
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <FieldLabel label="Decoded JSON" />
          <CopyButton value={output} />
        </div>
        <TextareaField value={output} readOnly spellCheck={false} />
        <div className="mt-4">
          {result.error ? (
            <StatusBanner tone="danger" text={result.error} />
          ) : (
            <StatusBanner tone="success" text="Header and payload decoded successfully." />
          )}
        </div>
      </SectionCard>
    </ToolGrid>
  );
}
