"use client";

import { useState } from "react";
import type { SiteContent, NewsItem } from "@/lib/types";
import Reveal from "@/components/Reveal";
import Modal from "@/components/Modal";
import { CoverImage } from "@/components/Placeholder";
import SectionHead from "./SectionHead";
import { Icon } from "@/components/Icon";

// Deterministic Arabic date — identical on server and client (Intl's ICU
// output differs between Node and browsers, which caused a hydration mismatch).
const AR_MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];
function formatDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || "");
  if (!m) return iso;
  const [, y, mo, d] = m;
  const month = AR_MONTHS[Number(mo) - 1] ?? mo;
  return `${Number(d)} ${month} ${y}`;
}

export default function News({ news }: { news: SiteContent["news"] }) {
  const [active, setActive] = useState<NewsItem | null>(null);
  if (news.items.length === 0) return null;

  const featured = news.items.find((n) => n.featured) ?? news.items[0];
  const rest = news.items.filter((n) => n.id !== featured.id);

  return (
    <section id="news" className="section">
      <div className="container-x">
        <SectionHead kicker={news.kicker} title={news.title} />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Featured */}
          <Reveal>
            <button
              type="button"
              onClick={() => setActive(featured)}
              className="card group flex h-full w-full flex-col overflow-hidden text-start transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)]"
            >
              <CoverImage
                image={featured.cover}
                label={featured.title}
                ratio="16 / 9"
                className="w-full"
                sizes="(max-width: 1024px) 100vw, 620px"
              />
              <div className="flex flex-1 flex-col p-7">
                <div className="flex items-center gap-3 text-sm text-muted">
                  {featured.tag ? <span className="chip">{featured.tag}</span> : null}
                  <span className="num">{formatDate(featured.date)}</span>
                </div>
                <h3 className="mt-3 font-display text-2xl font-bold leading-snug text-ink">
                  {featured.title}
                </h3>
                <p className="mt-2 text-ink-soft">{featured.excerpt}</p>
                <span className="mt-auto pt-5 inline-flex items-center gap-1.5 font-semibold text-red-700 group-hover:-translate-x-1 transition-transform">
                  اقرأ المزيد <Icon name="arrow" size={16} />
                </span>
              </div>
            </button>
          </Reveal>

          {/* List */}
          <div className="flex flex-col gap-4">
            {rest.map((item, i) => (
              <Reveal key={item.id} delay={i * 80}>
                <button
                  type="button"
                  onClick={() => setActive(item)}
                  className="card group flex w-full items-center gap-4 overflow-hidden p-3 text-start transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
                >
                  <CoverImage
                    image={item.cover}
                    label=""
                    ratio="1 / 1"
                    className="w-24 shrink-0 overflow-hidden rounded-xl"
                    sizes="96px"
                  />
                  <div className="min-w-0 py-1 pl-2">
                    <div className="flex items-center gap-2 text-xs text-muted">
                      {item.tag ? <span className="font-semibold text-red-700">{item.tag}</span> : null}
                      <span className="num">{formatDate(item.date)}</span>
                    </div>
                    <h4 className="mt-1 line-clamp-2 font-display text-lg font-bold leading-snug text-ink">
                      {item.title}
                    </h4>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <Modal open={Boolean(active)} onClose={() => setActive(null)} labelledBy="news-title">
        {active ? (
          <article>
            <CoverImage
              image={active.cover}
              label={active.title}
              ratio="21 / 9"
              className="w-full"
              sizes="(max-width: 900px) 100vw, 830px"
            />
            <div className="p-7 sm:p-9">
              <div className="flex items-center gap-3 text-sm text-muted">
                {active.tag ? <span className="chip">{active.tag}</span> : null}
                <span className="num">{formatDate(active.date)}</span>
              </div>
              <h3 id="news-title" className="mt-3 font-display text-3xl font-bold text-ink">
                {active.title}
              </h3>
              <div className="mt-4 space-y-3 text-[1.03rem] leading-relaxed text-ink-soft">
                {active.body.split("\n").filter(Boolean).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </article>
        ) : null}
      </Modal>
    </section>
  );
}
