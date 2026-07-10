"use client";

import { useState } from "react";
import type { SiteContent, Mentor } from "@/lib/types";
import Modal from "@/components/Modal";
import Marquee from "@/components/Marquee";
import { Avatar } from "@/components/Placeholder";
import SectionHead from "./SectionHead";
import { Icon } from "@/components/Icon";

export default function Mentors({ mentors }: { mentors: SiteContent["mentors"] }) {
  const [active, setActive] = useState<Mentor | null>(null);
  if (mentors.items.length === 0) return null;

  return (
    <section id="mentors" className="section" style={{ background: "var(--paper-2)" }}>
      <div className="container-x">
        <SectionHead kicker={mentors.kicker} title={mentors.title} intro={mentors.intro} />
      </div>

      <div className="mt-14">
        <Marquee speed={Math.max(26, mentors.items.length * 9)}>
          {mentors.items.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setActive(m)}
              className="card group flex w-[19rem] shrink-0 items-center gap-4 p-5 text-start transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)]"
            >
              <div className="relative shrink-0">
                <Avatar image={m.portrait} name={m.name} size={72} />
                <span
                  className="absolute -bottom-1 -left-1 flex h-6 w-6 items-center justify-center rounded-full ring-2 ring-[var(--paper)]"
                  style={{ background: "var(--red-600)", color: "white" }}
                  aria-hidden="true"
                >
                  <Icon name="pen" size={13} />
                </span>
              </div>
              <div className="min-w-0">
                <h3 className="truncate font-display text-lg font-bold text-ink">{m.name}</h3>
                <p className="text-sm font-medium text-red-700">{m.role}</p>
                {m.tagline ? <p className="mt-1 line-clamp-1 text-sm text-muted">{m.tagline}</p> : null}
              </div>
            </button>
          ))}
        </Marquee>
      </div>

      <Modal open={Boolean(active)} onClose={() => setActive(null)} labelledBy="mentor-title">
        {active ? (
          <div className="p-7 sm:p-9">
            <div className="flex flex-col items-center text-center sm:flex-row sm:items-end sm:gap-6 sm:text-start">
              <Avatar image={active.portrait} name={active.name} size={120} className="ring-4 ring-[var(--red-50)]" />
              <div className="mt-4 sm:mt-0">
                <h3 id="mentor-title" className="font-display text-2xl font-bold text-ink">
                  {active.name}
                </h3>
                <p className="font-semibold text-red-700">{active.role}</p>
                {active.tagline ? <p className="mt-1 text-muted">{active.tagline}</p> : null}
              </div>
            </div>
            <div className="mt-6 hairline" />
            <p className="mt-6 text-[1.03rem] leading-relaxed text-ink-soft">{active.bio}</p>
          </div>
        ) : null}
      </Modal>
    </section>
  );
}
