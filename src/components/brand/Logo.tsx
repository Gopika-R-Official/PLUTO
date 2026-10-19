import Link from "next/link";

export function Logo({
  compact = false,
  asLink = true,
}: {
  compact?: boolean;
  asLink?: boolean;
}) {
  const content = (
    <>
      <span
        aria-hidden
        className="relative grid h-8 w-8 place-items-center rounded-full border border-border bg-card-strong"
      >
        <span className="absolute inset-[5px] rounded-full border border-violet/70" />
        <span className="h-1.5 w-1.5 rounded-full bg-violet" />
        <span className="absolute -right-0.5 top-1 h-1.5 w-1.5 rounded-full bg-lavender" />
      </span>
      {!compact && (
        <span className="wordmark text-[1.65rem] leading-none tracking-tight">Pluto</span>
      )}
      <span className="sr-only">Pluto home</span>
    </>
  );

  if (!asLink) {
    return (
      <span className="group flex items-center gap-2.5 rounded-full">
        {content}
      </span>
    );
  }

  return (
    <Link href="/" className="group flex items-center gap-2.5 rounded-full">
      {content}
    </Link>
  );
}
