"use client";

import { useMemo, useState } from "react";

import {
  CopyButton,
  FieldLabel,
  InputField,
  SectionCard,
  StatPill,
  ToolGrid,
} from "@/components/tool-ui";

export default function GradientGeneratorTool() {
  const [firstColor, setFirstColor] = useState("#4F46E5");
  const [secondColor, setSecondColor] = useState("#06B6D4");
  const [angle, setAngle] = useState("135");

  const cssGradient = useMemo(
    () => `background: linear-gradient(${angle}deg, ${firstColor}, ${secondColor});`,
    [angle, firstColor, secondColor],
  );

  return (
    <ToolGrid>
      <SectionCard
        title="Gradient controls"
        description="Tune your CSS gradient visually, then copy production-ready code."
      >
        <div className="grid gap-4">
          <div>
            <FieldLabel label="First color" />
            <div className="flex gap-3">
              <input
                type="color"
                value={firstColor}
                onChange={(event) => setFirstColor(event.target.value.toUpperCase())}
                className="h-12 w-16 cursor-pointer rounded-2xl border border-border bg-transparent"
              />
              <InputField
                value={firstColor}
                onChange={(event) => setFirstColor(event.target.value.toUpperCase())}
              />
            </div>
          </div>

          <div>
            <FieldLabel label="Second color" />
            <div className="flex gap-3">
              <input
                type="color"
                value={secondColor}
                onChange={(event) => setSecondColor(event.target.value.toUpperCase())}
                className="h-12 w-16 cursor-pointer rounded-2xl border border-border bg-transparent"
              />
              <InputField
                value={secondColor}
                onChange={(event) => setSecondColor(event.target.value.toUpperCase())}
              />
            </div>
          </div>

          <div>
            <FieldLabel label="Angle" hint="Degrees" />
            <InputField value={angle} onChange={(event) => setAngle(event.target.value)} />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Preview and CSS"
        description="Use the live preview to compare direction and contrast before copying."
      >
        <div
          className="h-52 rounded-3xl border border-border"
          style={{ background: `linear-gradient(${angle}deg, ${firstColor}, ${secondColor})` }}
        />

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <StatPill label="Angle" value={`${angle}deg`} />
          <StatPill label="Start" value={firstColor} />
          <StatPill label="End" value={secondColor} />
        </div>

        <div className="mt-4 mb-3 flex items-center justify-between gap-3">
          <FieldLabel label="CSS output" />
          <CopyButton value={cssGradient} />
        </div>
        <InputField readOnly value={cssGradient} className="font-mono text-sm" />
      </SectionCard>
    </ToolGrid>
  );
}
