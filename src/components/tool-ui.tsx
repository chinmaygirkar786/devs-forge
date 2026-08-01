"use client";

import { cloneElement, isValidElement, useEffect, useId, useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { capturePosthog } from "@/lib/posthog";
import { cn } from "@/lib/utils";

type SectionCardProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function SectionCard({ title, description, children, className }: SectionCardProps) {
  return (
    <section className={cn("surface-card rounded-2xl p-5 sm:p-6", className)}>
      <div className="mb-4">
        <h3 className="text-foreground text-lg font-semibold">{title}</h3>
        {description ? (
          <p className="text-muted-foreground mt-1 text-sm leading-6">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

type FieldLabelProps = {
  label: string;
  hint?: string;
  htmlFor?: string;
};

export function FieldLabel({ label, hint, htmlFor }: FieldLabelProps) {
  return (
    <div className="mb-2 flex items-center justify-between gap-3">
      <Label htmlFor={htmlFor} className="text-foreground text-sm font-semibold">
        {label}
      </Label>
      {hint ? <span className="text-muted-foreground text-xs">{hint}</span> : null}
    </div>
  );
}

type FieldProps = {
  label: string;
  hint?: string;
  children: React.ReactElement<{ id?: string; "aria-label"?: string }>;
};

export function Field({ label, hint, children }: FieldProps) {
  const id = useId();

  return (
    <div>
      <FieldLabel label={label} hint={hint} htmlFor={id} />
      {isValidElement(children)
        ? cloneElement(children, {
            id,
            "aria-label": children.props["aria-label"] ?? label,
          })
        : children}
    </div>
  );
}

type TextareaFieldProps = React.ComponentProps<typeof Textarea> & {
  minHeight?: string;
};

export function TextareaField({
  className,
  minHeight = "min-h-[220px]",
  ...props
}: TextareaFieldProps) {
  return (
    <Textarea
      {...props}
      className={cn("w-full resize-y font-mono text-sm leading-6", minHeight, className)}
    />
  );
}

export function InputField(props: React.ComponentProps<typeof Input>) {
  return <Input {...props} className={cn("w-full", props.className)} />;
}

export function SelectField(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "border-input focus-visible:border-ring focus-visible:ring-ring/50 h-8 w-full min-w-0 rounded-lg border bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:ring-3",
        props.className,
      )}
    />
  );
}

type DropdownOption = {
  label: string;
  value: string;
};

type DropdownFieldProps = {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function DropdownField({
  value,
  options,
  onChange,
  placeholder = "Select an option",
  className,
}: DropdownFieldProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cn("w-full", className)} aria-label={placeholder}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

type ActionButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  /** Ghost only: accent for Load example vs Clear (auto-detected from label when omitted). */
  intent?: "load" | "clear";
};

function getButtonLabel(children: React.ReactNode, ariaLabel?: string): string {
  if (typeof children === "string") {
    return children;
  }

  if (Array.isArray(children)) {
    return children.map((child) => getButtonLabel(child)).join("");
  }

  if (isValidElement<{ children?: React.ReactNode }>(children)) {
    return getButtonLabel(children.props.children, ariaLabel);
  }

  return ariaLabel ?? "";
}

function resolveActionIntent(
  intent: ActionButtonProps["intent"],
  children: React.ReactNode,
  ariaLabel?: string,
): "load" | "clear" {
  if (intent) {
    return intent;
  }

  const text = `${getButtonLabel(children, ariaLabel)} ${ariaLabel ?? ""}`.toLowerCase();
  if (/\bclear\b|\breset\b|\bempty\b/.test(text)) {
    return "clear";
  }

  return "load";
}

export function ActionButton({
  variant = "secondary",
  className,
  children,
  intent,
  "aria-label": ariaLabel,
  ...props
}: ActionButtonProps) {
  if (variant === "ghost") {
    const action = resolveActionIntent(intent, children, ariaLabel);

    return (
      <Button
        type="button"
        variant="outline"
        data-action={action}
        aria-label={ariaLabel}
        className={cn(
          "rounded-full",
          action === "clear"
            ? "hover:border-destructive/40 hover:text-destructive"
            : "hover:border-primary/40",
          className,
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant={variant === "primary" ? "default" : "default"}
      aria-label={ariaLabel}
      className={cn("rounded-full", className)}
      {...props}
    >
      {children}
    </Button>
  );
}

type CopyButtonProps = {
  value: string;
  label?: string;
  className?: string;
};

export function CopyButton({ value, label = "Copy output", className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timer = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <Button
      type="button"
      variant={copied ? "default" : "outline"}
      size="sm"
      className={cn("rounded-full", copied && "bg-success text-white", className)}
      aria-label={copied ? "Copied to clipboard" : label}
      disabled={!value}
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        capturePosthog("tool_output_copied", { method: "button", output_length: value.length });
      }}
    >
      {copied ? (
        <Check className="size-3.5" strokeWidth={2.5} aria-hidden />
      ) : (
        <Copy className="size-3.5" strokeWidth={2.25} aria-hidden />
      )}
      <span>{copied ? "Copied!" : label}</span>
    </Button>
  );
}

type StatusBannerProps = {
  tone: "neutral" | "success" | "danger";
  text: string;
};

export function StatusBanner({ tone, text }: StatusBannerProps) {
  const colors = {
    neutral: "bg-background-soft text-muted-foreground",
    success: "bg-emerald-500/10 text-success",
    danger: "bg-rose-500/10 text-danger",
  };

  return (
    <div className={cn("rounded-2xl px-4 py-3 text-sm font-medium", colors[tone])}>{text}</div>
  );
}

type StatPillProps = {
  label: string;
  value: string | number;
};

export function StatPill({ label, value }: StatPillProps) {
  return (
    <div className="bg-background-soft rounded-2xl px-4 py-3">
      <p className="text-muted-foreground text-xs tracking-[0.18em] uppercase">{label}</p>
      <p className="text-foreground mt-2 text-lg font-semibold">{value}</p>
    </div>
  );
}

type ToolGridProps = {
  children: React.ReactNode;
  columns?: "two" | "three";
};

export function ToolGrid({ children, columns = "two" }: ToolGridProps) {
  return (
    <div
      className={cn(
        "grid gap-6",
        columns === "three" ? "lg:grid-cols-3" : "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]",
      )}
    >
      {children}
    </div>
  );
}

type ToolShortcutsOptions = {
  onCopy?: () => void;
  onClear?: () => void;
};

export function useToolShortcuts({ onCopy, onClear }: ToolShortcutsOptions) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === "c") {
        event.preventDefault();
        onCopy?.();
        capturePosthog("tool_output_copied", { method: "keyboard_shortcut" });
      }

      if ((event.ctrlKey || event.metaKey) && event.key === "Backspace") {
        event.preventDefault();
        onClear?.();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClear, onCopy]);
}
