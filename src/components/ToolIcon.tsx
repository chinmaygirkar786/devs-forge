import { ToolIconGlyph } from "@/lib/tool-icons";
import { cn } from "@/lib/utils";

type ToolIconProps = {
  slug: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  iconClassName?: string;
};

const containerSizes = {
  sm: "h-9 w-9 rounded-xl",
  md: "h-11 w-11 rounded-2xl",
  lg: "h-14 w-14 rounded-2xl",
} as const;

const iconSizes = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-7 w-7",
} as const;

export function ToolIcon({
  slug,
  size = "md",
  className,
  iconClassName,
}: ToolIconProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center bg-primary-soft text-primary",
        containerSizes[size],
        className,
      )}
    >
      <ToolIconGlyph slug={slug} className={cn(iconSizes[size], iconClassName)} />
    </span>
  );
}
