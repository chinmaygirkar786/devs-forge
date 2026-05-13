import Link from "next/link";

export default function NotFound() {
  return (
    <div className="surface-card rounded-[2rem] p-8 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
        Not found
      </p>
      <h1 className="mt-4 text-4xl font-black tracking-tight text-foreground">
        This tool does not exist.
      </h1>
      <p className="mt-4 text-base leading-8 text-muted-foreground">
        Head back to the developer tools hub to find JSON, JWT, regex, timestamp,
        and formatting tools that are available now.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background"
      >
        Back to homepage
      </Link>
    </div>
  );
}
