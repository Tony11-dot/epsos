import Image from "next/image";
import type { SiteContent, ImageRef } from "@/lib/types";
import Reveal from "@/components/Reveal";
import SectionHead from "./SectionHead";
import { Icon } from "@/components/Icon";
import { Disc } from "@/components/BrandShapes";

function PhoneFrame({ shot }: { shot: ImageRef }) {
  return (
    <div className="phone float-soft">
      <span className="phone-notch" aria-hidden="true" />
      <div className="phone-screen">
        {shot?.url ? (
          <Image src={shot.url} alt={shot.alt || ""} fill sizes="240px" className="object-cover" />
        ) : (
          <div className="phone-placeholder">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.4" />
              <circle cx="12" cy="12" r="8" stroke="white" strokeWidth="1.4" opacity="0.6" />
              <circle cx="12" cy="12" r="1.4" fill="white" />
            </svg>
            <span className="font-display text-lg font-bold">إبسوس</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AppShowcase({ app }: { app: SiteContent["app"] }) {
  const screens = app.screens ?? [];
  if (screens.length === 0) return null;

  return (
    <section id="app" className="section relative overflow-hidden" style={{ background: "var(--paper-2)" }}>
      <Disc className="pointer-events-none absolute right-[8%] top-24 opacity-90 float-soft" size={12} color="var(--accent)" />
      <div className="container-x">
        <SectionHead kicker={app.kicker} title={app.title} intro={app.intro} align="center" />

        {app.storeLinks.length > 0 && (
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {app.storeLinks.map((s) => (
              <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="btn btn-ghost text-sm">
                <Icon name={s.icon} size={18} /> {s.label}
              </a>
            ))}
          </div>
        )}

        <div className="mt-16 flex flex-col gap-16 sm:gap-20">
          {screens.map((screen, i) => {
            const flip = i % 2 === 1;
            return (
              <div
                key={screen.id}
                className="grid items-center gap-8 sm:gap-12 md:grid-cols-2"
              >
                <Reveal className={`flex justify-center ${flip ? "md:order-2" : ""}`}>
                  <PhoneFrame shot={screen.shot} />
                </Reveal>
                <Reveal delay={80} className={flip ? "md:order-1" : ""}>
                  <div className="max-w-md">
                    <span
                      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl"
                      style={{ background: "var(--red-50)", color: "var(--red-700)" }}
                    >
                      <span className="num text-lg font-bold">{i + 1}</span>
                    </span>
                    <h3 className="mt-4 font-display text-2xl font-bold text-ink">{screen.title}</h3>
                    <p className="mt-3 text-[1.05rem] leading-relaxed text-ink-soft">{screen.body}</p>
                  </div>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
