import Link from "next/link";
import type { SiteContent } from "@/lib/types";
import Reveal from "@/components/Reveal";
import SectionHead from "./SectionHead";
import { Icon } from "@/components/Icon";
import SectionDecor from "@/components/SectionDecor";

// Teaser on the main Epsos site — the full كونترول experience lives at /control.
export default function Control({ control }: { control: SiteContent["control"] }) {
  const grades = control.grades ?? [];

  return (
    <section id="control" className="section">
      <SectionDecor variant="c" />
      <div className="container-x">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="max-w-xl">
            <SectionHead kicker={control.kicker} title={control.title} intro={control.intro} />
            <Reveal delay={160} className="mt-8">
              <Link href="/control" className="btn btn-primary text-[1rem]">
                {control.ctaLabel || "ادخل عالم كونترول"}
                <Icon name="arrow" size={18} />
              </Link>
            </Reveal>
          </div>

          {/* Playful grade-chip preview that links through */}
          <Reveal delay={80}>
            <Link
              href="/control"
              className="card group relative block overflow-hidden p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)]"
            >
              <div className="flex flex-wrap gap-2.5">
                {grades.map((g, i) => (
                  <span
                    key={g.id}
                    className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold text-white"
                    style={{ background: g.color }}
                  >
                    <span className="num">{i + 1}</span>
                    {g.label}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="font-display text-lg font-bold text-ink">
                  {control.coursesTitle || "دورات كونترول"}
                </span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-red-700 transition-transform duration-300 group-hover:-translate-x-1">
                  اكتشف <Icon name="arrow" size={16} />
                </span>
              </div>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
