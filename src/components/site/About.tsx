import type { SiteContent } from "@/lib/types";
import Reveal from "@/components/Reveal";
import SectionHead from "./SectionHead";
import { Icon } from "@/components/Icon";
import { Rings } from "@/components/BrandShapes";
import SectionDecor from "@/components/SectionDecor";

export default function About({ about }: { about: SiteContent["about"] }) {
  return (
    <section id="about" className="section">
      <SectionDecor variant="a" />
      <div className="container-x">
        <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Intro column */}
          <div className="relative">
            <Rings
              className="pointer-events-none absolute -right-16 -top-16 -z-10 hidden opacity-50 lg:block"
              size={200}
              stroke="var(--red-100)"
            />
            <SectionHead kicker={about.kicker} title={about.title} />
          </div>

          {/* Body column */}
          <div className="max-w-2xl">
            {about.body.map((p, i) => (
              <Reveal
                as="p"
                key={i}
                delay={i * 80}
                className="mb-4 text-[1.05rem] leading-relaxed text-ink-soft"
              >
                {p}
              </Reveal>
            ))}
          </div>
        </div>

        {/* Pillars */}
        {about.pillars.length > 0 && (
        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {about.pillars.map((p, i) => (
            <Reveal key={p.id} delay={i * 100}>
              <article className="card group h-full p-7 transition-transform duration-300 hover:-translate-y-1">
                <span
                  className="inline-flex h-13 w-13 items-center justify-center rounded-2xl"
                  style={{ width: 52, height: 52, background: "var(--red-50)", color: "var(--red-700)" }}
                >
                  <Icon name={p.icon} size={26} />
                </span>
                <h3 className="mt-5 font-display text-xl font-bold text-ink">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{p.body}</p>
                <span
                  className="mt-5 block h-1 w-10 rounded-full transition-all duration-300 group-hover:w-16"
                  style={{ background: "var(--accent)" }}
                  aria-hidden="true"
                />
              </article>
            </Reveal>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}
