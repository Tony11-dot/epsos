import type { SiteContent } from "@/lib/types";
import Reveal from "@/components/Reveal";
import SectionHead from "./SectionHead";
import { Icon } from "@/components/Icon";
import { Rings } from "@/components/BrandShapes";
import SectionDecor from "@/components/SectionDecor";

export default function Contact({ contact }: { contact: SiteContent["contact"] }) {
  const { info } = contact;
  const rows: { icon: string; label: string; value: string; href?: string }[] = [
    info.phone ? { icon: "phone", label: "هاتف", value: info.phone, href: `tel:${info.phone.replace(/[^\d+]/g, "")}` } : null,
    info.whatsapp ? { icon: "whatsapp", label: "واتساب", value: "راسلنا على واتساب", href: `https://wa.me/${info.whatsapp}` } : null,
    info.email ? { icon: "mail", label: "بريد", value: info.email, href: `mailto:${info.email}` } : null,
    info.address ? { icon: "pin", label: "العنوان", value: info.address, href: info.mapUrl || undefined } : null,
    info.hours ? { icon: "clock", label: "ساعات العمل", value: info.hours } : null,
  ].filter(Boolean) as { icon: string; label: string; value: string; href?: string }[];

  return (
    <section id="contact" className="section" style={{ background: "var(--paper-2)" }}>
      <SectionDecor variant="e" />
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[1.6rem] border border-line bg-[var(--paper)] p-8 shadow-[var(--shadow-card)] sm:p-12">
          <Rings
            className="pointer-events-none absolute -left-16 -bottom-16 opacity-50"
            size={240}
            stroke="var(--red-100)"
          />
          <div className="relative grid gap-10 lg:grid-cols-2">
            <div className="max-w-md">
              <SectionHead kicker={contact.kicker} title={contact.title} intro={contact.intro} />

              <div className="mt-8 flex flex-wrap gap-3">
                {info.whatsapp ? (
                  <a href={`https://wa.me/${info.whatsapp}`} target="_blank" rel="noreferrer" className="btn btn-primary">
                    <Icon name="whatsapp" size={18} /> تواصل عبر واتساب
                  </a>
                ) : null}
                {info.phone ? (
                  <a href={`tel:${info.phone.replace(/[^\d+]/g, "")}`} className="btn btn-ghost">
                    <Icon name="phone" size={18} /> اتصل بنا
                  </a>
                ) : null}
              </div>

              {info.socials.length > 0 && (
                <div className="mt-8 flex items-center gap-3">
                  {info.socials.map((s) => (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={s.label}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line-strong text-ink transition-colors hover:border-red-400 hover:text-red-700"
                    >
                      <Icon name={s.icon} size={20} />
                    </a>
                  ))}
                </div>
              )}
            </div>

            <Reveal delay={120}>
              <ul className="flex flex-col divide-y divide-[var(--line)]">
                {rows.map((r, i) => {
                  const body = (
                    <>
                      <span
                        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                        style={{ background: "var(--red-50)", color: "var(--red-700)" }}
                      >
                        <Icon name={r.icon} size={20} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm text-muted">{r.label}</span>
                        <span className="block font-medium text-ink">{r.value}</span>
                      </span>
                    </>
                  );
                  return (
                    <li key={i}>
                      {r.href ? (
                        <a
                          href={r.href}
                          target={r.href.startsWith("http") ? "_blank" : undefined}
                          rel="noreferrer"
                          className="flex items-center gap-4 py-4 transition-colors hover:text-red-700"
                        >
                          {body}
                        </a>
                      ) : (
                        <div className="flex items-center gap-4 py-4">{body}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
