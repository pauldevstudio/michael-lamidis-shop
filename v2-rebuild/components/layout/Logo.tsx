import Link from "next/link";

interface Props { dark?: boolean; }

export function Logo({ dark = false }: Props) {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5 group">
      <span
        className={
          "grid h-9 w-9 place-items-center rounded-md font-heading text-sm font-bold tracking-tight " +
          (dark ? "bg-bone text-ink-900" : "bg-ink-900 text-bone")
        }
      >
        ML
      </span>
      <span
        className={
          "font-heading text-base font-semibold tracking-tight transition-colors " +
          (dark ? "text-bone group-hover:text-gold-300" : "text-ink-900 group-hover:text-gold-600")
        }
      >
        Michael Lamidis
      </span>
    </Link>
  );
}
