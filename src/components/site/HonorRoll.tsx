import type { SiteContent } from "@/lib/types";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import { Avatar } from "@/components/Placeholder";
import Marquee from "@/components/Marquee";
import SectionHead from "./SectionHead";
import { Icon } from "@/components/Icon";

// The one drenched-red section: white ink on deep red paper. Real student
// scores count up. High-contrast (white on red-800) meets WCAG AA.
export default function HonorRoll({ honorRoll }: { honorRoll: SiteContent["honorRoll"] }) {
  if (honorRoll.items.length === 0) return null;
  return (
    <section
      id="honor"
      className="section relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, var(--red-700), var(--red-900))", color: "white" }}
    >
      {/* faint concentric rings watermark */}
      <svg
        className="pointer-events-none absolute -left-24 -top-24 opacity-[0.12] spin-slow"
        width="420"
        height="420"
        viewBox="0 0 420 420"
        aria-hidden="true"
      >
        <g fill="none" stroke="white" strokeWidth="1.5">
          <circle cx="210" cy="210" r="70" />
          <circle cx="210" cy="210" r="120" />
          <circle cx="210" cy="210" r="170" />
          <circle cx="210" cy="210" r="205" />
        </g>
      </svg>
      <span
        className="pointer-events-none absolute bottom-10 left-[10%] h-3 w-3 rounded-full float-soft"
        style={{ background: "var(--accent)" }}
        aria-hidden="true"
      />

      <div className="container-x relative">
        <SectionHead kicker={honorRoll.kicker} title={honorRoll.title} intro={honorRoll.intro} tone="light" />

      </div>

      <div className="mt-14">
        <Marquee pxPerSecond={38}>
          {honorRoll.items.map((s) => {
            const pct = honorRoll.maxScore > 0 ? Math.min(100, (s.score / honorRoll.maxScore) * 100) : 0;
            return (
              <figure
                key={s.id}
                className="flex w-[15.5rem] shrink-0 flex-col items-center rounded-[var(--radius-card)] p-7 text-center"
                style={{ background: "oklch(1 0 0 / 0.06)", border: "1px solid oklch(1 0 0 / 0.14)" }}
              >
                <Avatar image={s.photo} name={s.name} size={80} className="ring-2 ring-white/25" />
                <span className="num mt-5 text-5xl font-bold leading-none">
                  <CountUp value={s.score} />
                </span>
                <span className="mt-1 text-xs font-medium text-white/60">من {honorRoll.maxScore}</span>

                <span className="mt-4 block h-1 w-full overflow-hidden rounded-full" style={{ background: "oklch(1 0 0 / 0.16)" }}>
                  <span className="block h-full rounded-full" style={{ width: `${pct}%`, background: "var(--accent)" }} />
                </span>

                <figcaption className="mt-4">
                  <span className="block font-display text-lg font-bold">{s.name}</span>
                  {s.note ? <span className="mt-0.5 block text-sm text-white/70">{s.note}</span> : null}
                </figcaption>
              </figure>
            );
          })}
        </Marquee>
      </div>

      <div className="container-x relative">

        <Reveal delay={120} className="mt-12 flex items-center justify-center gap-2 text-white/75">
          <Icon name="medal" size={20} />
          <span>وأنت التالي في القائمة.</span>
        </Reveal>
      </div>
    </section>
  );
}
