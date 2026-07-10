import type { SiteContent } from "@/lib/types";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import HeroUnderline from "@/components/HeroUnderline";
import { Rings, Disc, Frame, Plus } from "@/components/BrandShapes";
import { Icon } from "@/components/Icon";

export default function Hero({
  brand,
  hero,
}: {
  brand: SiteContent["brand"];
  hero: SiteContent["hero"];
}) {
  const lines = hero.headlineLines.length ? hero.headlineLines : [brand.tagline];
  const lastIndex = lines.length - 1;

  return (
    <section id="top" className="relative overflow-hidden pt-[86px]">
      {/* Quiet brand marks filling negative space */}
      <Rings
        className="pointer-events-none absolute -top-10 left-[-90px] opacity-60 spin-slow"
        size={300}
        stroke="var(--red-200)"
      />
      <Disc
        className="pointer-events-none absolute right-[8%] top-[22%] opacity-90 float-soft"
        size={14}
        color="var(--accent)"
      />
      <Disc
        className="pointer-events-none absolute left-[12%] bottom-[16%] hidden md:block"
        size={10}
        color="var(--red-400)"
      />
      <Frame
        className="pointer-events-none absolute left-[6%] top-[30%] hidden -rotate-12 opacity-70 float-soft lg:block"
        size={120}
        stroke="var(--red-100)"
      />
      <Frame
        className="pointer-events-none absolute -right-12.5 bottom-[8%] rotate-12 opacity-60 float-soft"
        size={160}
        stroke="var(--red-100)"
      />
      <Plus
        className="pointer-events-none absolute right-[22%] top-[14%] hidden opacity-80 md:block"
        size={22}
        color="var(--red-300)"
      />
      <Plus
        className="pointer-events-none absolute left-[24%] top-[10%] hidden opacity-70 lg:block"
        size={16}
        color="var(--accent)"
      />

      <div className="container-x relative flex flex-col items-center pb-20 pt-16 text-center sm:pt-24">
        <Reveal>
          <span className="chip">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--red-600)" }}
            />
            {brand.tagline}
          </span>
        </Reveal>

        <Reveal delay={80} as="h1" className="mt-7 max-w-3xl">
          <span className="block font-display text-[clamp(2.6rem,7vw,5rem)] font-bold leading-[1.05] text-ink">
            {lines.map((line, i) => (
              <span key={i} className="relative block">
                {line}
                {i === lastIndex ? (
                  <HeroUnderline className="absolute inset-x-0 -bottom-3 mx-auto block h-[26px] w-[min(88%,26rem)]" />
                ) : null}
              </span>
            ))}
          </span>
        </Reveal>

        <Reveal delay={160} as="p" className="mt-10 max-w-xl text-lg leading-relaxed text-ink-soft">
          {hero.subhead}
        </Reveal>

        <Reveal delay={240} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a href={hero.primaryCtaHref} className="btn btn-primary text-[1rem]">
            {hero.primaryCtaLabel}
            <Icon name="arrow" size={18} />
          </a>
          <a href={hero.secondaryCtaHref} className="btn btn-ghost text-[1rem]">
            {hero.secondaryCtaLabel}
          </a>
        </Reveal>

        {/* Stats — always centred & symmetric for any count */}
        {hero.stats.length > 0 && (
          <Reveal delay={320} className="mt-16 w-full">
            <div className="mx-auto flex max-w-3xl flex-wrap items-stretch justify-center gap-y-8">
              {hero.stats.map((s, i) => (
                <div
                  key={s.id}
                  className="flex min-w-[9rem] flex-col items-center px-6 sm:px-8"
                  style={
                    i > 0
                      ? { borderInlineStart: "1px solid var(--line-strong)" }
                      : undefined
                  }
                >
                  <span className="num text-[clamp(1.9rem,4.5vw,2.9rem)] font-bold leading-none text-red-700">
                    <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
                  </span>
                  <span className="mt-2 text-center text-sm text-muted">{s.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        )}
      </div>

      {/* soft paper divider */}
      <div className="container-x">
        <div className="hairline" />
      </div>
    </section>
  );
}
