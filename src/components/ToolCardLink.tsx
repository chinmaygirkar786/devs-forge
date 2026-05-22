import Link from "next/link";
import type { ComponentProps } from "react";

import { ToolIcon } from "@/components/ToolIcon";
import { cn } from "@/lib/utils";

type ToolCardLinkProps = ComponentProps<typeof Link> & {
  slug: string;
  title: string;
  description?: string;
  eyebrow?: string;
  tooltip?: string;
  iconSize?: "sm" | "md" | "lg";
  layout?: "horizontal" | "stacked";
  /** Perceptible hover lift on home-style tool cards (no scale/will-change). */
  interactive?: boolean;
};

export function ToolCardLink({
  slug,
  title,
  description,
  eyebrow,
  tooltip,
  iconSize = "md",
  layout = "horizontal",
  interactive = false,
  className,
  children,
  ...props
}: ToolCardLinkProps) {
  return (
    <Link
      title={tooltip}
      className={cn(
        layout === "horizontal" && "flex gap-4",
        interactive && "home-card-interactive",
        className,
      )}
      {...props}
    >
      <ToolIcon slug={slug} size={iconSize} />
      <span className={cn(layout === "horizontal" && "min-w-0 flex-1")}>
        {eyebrow ? (
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </span>
        ) : null}
        <span
          className={cn(
            "block font-semibold text-foreground",
            eyebrow ? "mt-3 text-lg" : "text-lg",
          )}
        >
          {title}
        </span>
        {description ? (
          <span className="mt-2 block text-sm leading-6 text-muted-foreground">
            {description}
          </span>
        ) : null}
        {children}
      </span>
    </Link>
  );
}
