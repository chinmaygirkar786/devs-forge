"use client";

import { useEffect, useMemo, useState } from "react";

import {
  ActionButton,
  CopyButton,
  FieldLabel,
  InputField,
  SectionCard,
  ToolGrid,
} from "@/components/tool-ui";
import { generatePalette, getReadableTextColor } from "@/lib/tool-helpers";

const starterColors = ["#4F46E5", "#06B6D4", "#14B8A6", "#F97316"];
const defaultColorName = "primary";

function normalizeSwatchColorName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatSwatchToken(colorName: string, shade: string) {
  return colorName ? `${colorName}-${shade}` : shade;
}

function formatCssVariable(colorName: string, shade: string, hex: string) {
  return `--color-${formatSwatchToken(colorName, shade)}: ${hex};`;
}

export default function ColorPaletteGeneratorTool() {
  const [color, setColor] = useState("#4F46E5");
  const [colorName, setColorName] = useState(defaultColorName);
  const [toastMessage, setToastMessage] = useState("");
  const palette = useMemo(() => generatePalette(color), [color]);
  const normalizedColorName = useMemo(() => normalizeSwatchColorName(colorName), [colorName]);
  const paletteListOutput = useMemo(
    () =>
      palette
        .map((swatch) => formatCssVariable(normalizedColorName, swatch.label, swatch.value))
        .join("\n"),
    [normalizedColorName, palette],
  );

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timer = window.setTimeout(() => setToastMessage(""), 1800);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  async function copySwatchColor(value: string, shade: string) {
    const cssVariable = formatCssVariable(normalizedColorName, shade, value);
    const swatchName = formatSwatchToken(normalizedColorName, shade);

    try {
      await navigator.clipboard.writeText(cssVariable);
      setToastMessage(`Copied ${swatchName} (${cssVariable}) to your clipboard.`);
    } catch {
      setToastMessage(`Couldn't copy ${swatchName}. Please try again.`);
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
              className="border-border h-12 w-16 cursor-pointer rounded-2xl border bg-transparent"
            />
            <InputField
              value={color}
              onChange={(event) => setColor(event.target.value.toUpperCase())}
            />
          </div>

          <div className="mt-4">
            <FieldLabel label="Swatch color name" />
            <InputField
              value={colorName}
              onChange={(event) => setColorName(event.target.value)}
              placeholder={defaultColorName}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {starterColors.map((starter) => (
              <button
                key={starter}
                type="button"
                onClick={() => setColor(starter)}
                className="border-border text-foreground inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap"
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
          description="Click a swatch to copy one CSS variable, or copy the full list."
        >
          <div className="mb-5 flex items-center justify-between gap-3">
            <FieldLabel label="CSS variables" />
            <CopyButton value={paletteListOutput} label="Copy list" />
          </div>
          <div className="grid gap-3">
            {palette.map((swatch) => (
              <button
                key={swatch.label}
                type="button"
                onClick={() => void copySwatchColor(swatch.value, swatch.label)}
                className="border-border flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-4 text-left"
                style={{
                  backgroundColor: swatch.value,
                  color: getReadableTextColor(swatch.value),
                }}
              >
                <span className="font-semibold">
                  {formatSwatchToken(normalizedColorName, swatch.label)}
                </span>
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
