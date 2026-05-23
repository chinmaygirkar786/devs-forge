import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

type SiteLogoSize = "sm" | "md" | "lg";

const sizeClasses: Record<SiteLogoSize, string> = {
  sm: "h-9 w-9 rounded-xl text-xs",
  md: "h-11 w-11 rounded-2xl text-sm",
  lg: "h-14 w-14 rounded-2xl text-base",
};

type SiteLogoProps = {
  size?: SiteLogoSize;
  className?: string;
};

export function SiteLogo({ size = "md", className }: SiteLogoProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "from-primary to-accent shadow-primary/25 flex shrink-0 items-center justify-center bg-gradient-to-br font-black text-white shadow-lg",
        sizeClasses[size],
        className,
      )}
    >
      {siteConfig.logoMark}
    </span>
  );
}
