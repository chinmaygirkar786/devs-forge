import Link from "next/link";

export default function NotFound() {
  return (
    <div className="surface-card rounded-[2rem] p-8 text-center">
      <p className="text-primary text-sm font-semibold tracking-[0.24em] uppercase">Not found</p>
      <h1 className="text-foreground mt-4 text-4xl font-black tracking-tight">
        This tool does not exist.
      </h1>
      <p className="text-muted-foreground mt-4 text-base leading-8">
        Head back to Devs Forge to find JSON, JWT, regex, timestamp, and formatting tools that are
        available now.
      </p>
      <Link
        href="/"
        className="bg-foreground text-background mt-6 inline-flex rounded-full px-5 py-3 text-sm font-semibold"
      >
        Back to homepage
      </Link>
    </div>
  );
}
