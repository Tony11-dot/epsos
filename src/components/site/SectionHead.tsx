import Reveal from "@/components/Reveal";

// Unified section header. The kicker is tied to the brand's concentric-ring
// motif (not the generic tracked-uppercase eyebrow), the title balances its
// lines, and the optional intro is width-capped for readable measure.
export default function SectionHead({
  kicker,
  title,
  intro,
  align = "start",
  tone = "dark",
}: {
  kicker?: string;
  title: string;
  intro?: string;
  align?: "start" | "center";
  tone?: "dark" | "light";
}) {
  const centered = align === "center";
  const light = tone === "light";
  const ring = light ? "var(--accent)" : "var(--red-600)";
  const kickerColor = light ? "var(--accent)" : "var(--red-700)";

  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {kicker ? (
        <Reveal
          as="div"
          className={`flex items-center gap-2 ${centered ? "justify-center" : ""}`}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="3.2" stroke={ring} strokeWidth="1.6" />
            <circle cx="10" cy="10" r="7.2" stroke={ring} strokeWidth="1.6" opacity="0.55" />
          </svg>
          <span className="text-sm font-semibold" style={{ color: kickerColor }}>
            {kicker}
          </span>
        </Reveal>
      ) : null}

      <Reveal
        as="h2"
        delay={60}
        className="mt-4 font-display text-[clamp(1.95rem,4vw,2.9rem)] font-bold leading-[1.12] text-balance"
        style={{ color: light ? "white" : "var(--ink)" }}
      >
        {title}
      </Reveal>

      {intro ? (
        <Reveal
          as="p"
          delay={120}
          className="mt-4 text-[1.06rem] leading-relaxed text-pretty"
          style={{ color: light ? "oklch(1 0 0 / 0.82)" : "var(--ink-soft)" }}
        >
          {intro}
        </Reveal>
      ) : null}
    </div>
  );
}
