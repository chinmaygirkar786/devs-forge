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
          <span className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">
            {eyebrow}
          </span>
        ) : null}
        <span
          className={cn(
            "text-foreground block font-semibold",
            eyebrow ? "mt-3 text-lg" : "text-lg",
          )}
        >
          {title}
        </span>
        {description ? (
          <span className="text-muted-foreground mt-2 block text-sm leading-6">{description}</span>
        ) : null}
        {children}
      </span>
    </Link>
  );
}
