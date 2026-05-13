"use client";

import { useEffect, useMemo, useState } from "react";

import {
  ActionButton,
  FieldLabel,
  InputField,
  SectionCard,
  ToolGrid,
} from "@/components/tool-ui";
import { generatePalette, getReadableTextColor } from "@/lib/tool-helpers";

const starterColors = ["#4F46E5", "#06B6D4", "#14B8A6", "#F97316"];

export default function ColorPaletteGeneratorTool() {
  const [color, setColor] = useState("#4F46E5");
  const [toastMessage, setToastMessage] = useState("");
  const palette = useMemo(() => generatePalette(color), [color]);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timer = window.setTimeout(() => setToastMessage(""), 1800);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  async function copySwatchColor(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setToastMessage(`Copied ${label} swatch ${value} to your clipboard.`);
    } catch {
      setToastMessage(`Could not copy ${value}. Please try again.`);
    }
  }

  return (
    <div className="space-y-4">
      <ToolGrid>
        <SectionCard
          title="Base color"
          description="Generate a ready-to-use color ramp for product UI, dashboards, or design systems."
        >
          <FieldLabel label="Hex value" />
          <div className="flex gap-3">
            <input
              type="color"
              value={color}
              onChange={(event) => setColor(event.target.value.toUpperCase())}
              className="h-12 w-16 rounded-2xl border border-border bg-transparent"
            />
            <InputField
              value={color}
              onChange={(event) => setColor(event.target.value.toUpperCase())}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {starterColors.map((starter) => (
              <button
                key={starter}
                type="button"
                onClick={() => setColor(starter)}
                className="inline-flex cursor-pointer shrink-0 items-center justify-center rounded-full border border-border px-4 py-2 text-sm font-medium whitespace-nowrap text-foreground"
              >
                {starter}
              </button>
            ))}
            <ActionButton
              variant="ghost"
              onClick={() =>
                setColor(
                  starterColors[Math.floor(Math.random() * starterColors.length)] ?? "#4F46E5",
                )
              }
            >
              Randomize
            </ActionButton>
          </div>
        </SectionCard>

        <SectionCard
          title="Generated palette"
          description="Click any swatch to copy its hex value."
        >
          <div className="grid gap-3">
            {palette.map((swatch) => (
              <button
                key={swatch.label}
                type="button"
                onClick={() => void copySwatchColor(swatch.value, swatch.label)}
                className="flex cursor-pointer items-center justify-between rounded-2xl border border-border px-4 py-4 text-left"
                style={{
                  backgroundColor: swatch.value,
                  color: getReadableTextColor(swatch.value),
                }}
              >
                <span className="font-semibold">{swatch.label}</span>
                <span className="font-mono text-sm">{swatch.value}</span>
              </button>
            ))}
          </div>
        </SectionCard>
      </ToolGrid>

      {toastMessage ? (
        <div className="fixed right-4 bottom-4 z-40 max-w-sm rounded-2xl border border-emerald-500/20 bg-emerald-500 px-4 py-3 text-sm font-medium text-white shadow-xl shadow-emerald-500/20">
          {toastMessage}
        </div>
      ) : null}
    </div>
  );
}
