"use client";

import { cloneElement, isValidElement, useEffect, useId, useRef, useState } from "react";

import posthog from "posthog-js";

import { cn } from "@/lib/utils";

type SectionCardProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function SectionCard({ title, description, children, className }: SectionCardProps) {
  return (
    <section className={cn("surface-card rounded-3xl p-5 sm:p-6", className)}>
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
      <label htmlFor={htmlFor} className="text-foreground text-sm font-semibold">
        {label}
      </label>
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

type TextareaFieldProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  minHeight?: string;
};

export function TextareaField({
  className,
  minHeight = "min-h-[220px]",
  ...props
}: TextareaFieldProps) {
  return (
    <textarea
      {...props}
      className={cn(
        "border-border bg-background focus:border-primary focus:ring-primary-soft w-full rounded-2xl border px-4 py-3 font-mono text-sm leading-6 outline-none focus:ring-2",
        minHeight,
        className,
      )}
    />
  );
}

export function InputField(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "border-border bg-background focus:border-primary focus:ring-primary-soft w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2",
        props.className,
      )}
    />
  );
}

export function SelectField(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "border-border bg-background focus:border-primary focus:ring-primary-soft w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2",
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
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={placeholder}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "border-border bg-background flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-sm outline-none",
          "focus:border-primary focus:ring-primary-soft focus:ring-2",
          open && "border-primary ring-primary-soft ring-2",
        )}
      >
        <span className="text-foreground truncate">{selectedOption?.label ?? placeholder}</span>
        <span
          className={cn(
            "text-muted-foreground shrink-0 transition-transform duration-200 ease-out",
            open && "rotate-180",
          )}
          aria-hidden="true"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="block"
          >
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {open ? (
        <div
          id={listboxId}
          role="listbox"
          className="border-border bg-card absolute top-[calc(100%+0.5rem)] z-30 w-full rounded-2xl border p-2 shadow-xl"
        >
          <div className="max-h-64 overflow-y-auto">
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm",
                    isSelected
                      ? "bg-primary-soft text-primary font-semibold"
                      : "text-foreground hover:bg-background-soft",
                  )}
                >
                  <span className="min-w-0 truncate">{option.label}</span>
                  {isSelected ? (
                    <span className="ml-3 shrink-0" aria-hidden="true">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="block"
                      >
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

type ActionButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function ActionButton({ variant = "secondary", className, ...props }: ActionButtonProps) {
  const variants = {
    primary:
      "bg-foreground text-background hover:opacity-90 disabled:bg-border disabled:text-muted-foreground",
    secondary:
      "bg-primary text-white hover:shadow-lg hover:shadow-primary/20 disabled:bg-border disabled:text-muted-foreground",
    ghost:
      "border border-border bg-background text-foreground hover:bg-background-soft disabled:text-muted-foreground",
  };

  return (
    <button
      {...props}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed",
        variants[variant],
        className,
      )}
    />
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

    const timer = window.setTimeout(() => setCopied(false), 1400);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <ActionButton
      variant={copied ? "ghost" : "secondary"}
      className={cn(
        "transition-[background-color,border-color,color] duration-200 ease-out",
        copied
          ? "border-success/40 bg-success/10 text-success border"
          : "bg-primary text-white hover:opacity-90",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      aria-label={label}
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        posthog.capture("tool_output_copied", { method: "button", output_length: value.length });
      }}
      disabled={!value}
    >
      {copied ? "Copied" : label}
    </ActionButton>
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
        posthog.capture("tool_output_copied", { method: "keyboard_shortcut" });
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
