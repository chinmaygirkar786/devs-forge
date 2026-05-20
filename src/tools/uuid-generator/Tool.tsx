"use client";

import { useState } from "react";

import {
  ActionButton,
  CopyButton,
  DropdownField,
  FieldLabel,
  SectionCard,
  StatPill,
  TextareaField,
} from "@/components/tool-ui";

function generateUuids(count: number) {
  return Array.from({ length: count }, () => crypto.randomUUID());
}

const uuidCountOptions = [1, 3, 5, 10, 20].map((value) => ({
  label: `${value}`,
  value: `${value}`,
}));

export default function UuidGeneratorTool() {
  const [count, setCount] = useState("5");
  const [uuids, setUuids] = useState(() => generateUuids(5));
  const output = uuids.join("\n");

  return (
    <div className="space-y-6">
      <SectionCard
        className="relative z-20 overflow-visible"
        title="UUID generator"
        description="Generate RFC 4122 UUID v4 values with the browser crypto API."
      >
        <div className="grid gap-4 sm:grid-cols-[180px_1fr] sm:items-start">
          <div>
            <FieldLabel label="How many UUIDs?" />
            <DropdownField
              value={count}
              options={uuidCountOptions}
              onChange={(nextCount) => {
                setCount(nextCount);
                setUuids(generateUuids(Number(nextCount)));
              }}
            />
          </div>

          <div className="sm:pt-9">
            <ActionButton
              variant="secondary"
              onClick={() => setUuids(generateUuids(Number(count)))}
            >
              Generate fresh UUIDs
            </ActionButton>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <SectionCard
          title="Batch details"
          description="Use smaller batches for single identifiers or larger batches for fixtures."
        >
          <div className="grid gap-4">
            <StatPill label="Version" value="UUID v4" />
            <StatPill label="Count" value={uuids.length} />
            <StatPill label="Generator" value="crypto.randomUUID()" />
          </div>
        </SectionCard>

        <SectionCard
          title="Generated values"
          description="Copy one by one or use the full list for test data and seed content."
        >
          <div className="mb-5 flex items-center justify-between gap-3">
            <FieldLabel label="UUID list" />
            <CopyButton value={output} label="Copy list" />
          </div>
          <TextareaField value={output} readOnly spellCheck={false} />
        </SectionCard>
      </div>
    </div>
  );
}
