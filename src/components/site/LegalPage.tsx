import Link from "next/link";
import type { SiteContent } from "@/lib/types";
import Wordmark from "@/components/Wordmark";
import { Icon } from "@/components/Icon";
import Footer from "@/components/site/Footer";
import {
  LEGAL_LINKS,
  LEGAL_UPDATED,
  LEGAL_UPDATED_ISO,
  type LegalDoc,
  type LegalSection,
} from "@/lib/legal";

// Shared chrome + typography for the three legal documents. Deliberately its
// own header (not the site Nav) — the Nav's links are in-page anchors that mean
// nothing on a sub-route; here a single "back to the site" affordance is right.
export default function LegalPage({ doc, content }: { doc: LegalDoc; content: SiteContent }) {
  const { brand, nav, footer, contact } = content;
  const others = LEGAL_LINKS.filter((l) => l.slug !== doc.slug);

  return (
    <>
      <header
        className="sticky top-0 z-40 border-b"
        style={{
          borderColor: "var(--line)",
          background: "color-mix(in oklch, var(--paper) 88%, transparent)",
          backdropFilter: "saturate(1.6) blur(10px)",
        }}
      >
        <div className="container-x flex items-center justify-between gap-4 py-3">
          <Link href="/" aria-label={`${brand.name} — الصفحة الرئيسية`}>
            <Wordmark brand={brand} />
          </Link>
          <Link href="/" className="btn btn-ghost text-sm">
            <Icon name="arrowRight" size={16} />
            العودة إلى الموقع
          </Link>
        </div>
      </header>

      <main>
        {/* ── Title band ─────────────────────────────────────────────────── */}
        <div className="border-b" style={{ borderColor: "var(--line)", background: "var(--paper-2)" }}>
          <div className="container-x py-14 md:py-20">
            <span className="eyebrow">{doc.kicker}</span>
            <h1 className="mt-4 text-4xl font-bold md:text-5xl">{doc.title}</h1>

            <div className="mt-8 max-w-3xl space-y-4 text-lg leading-relaxed text-ink-soft">
              {doc.intro.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <p className="mt-8 inline-flex items-center gap-2 text-sm text-muted">
              <Icon name="clock" size={16} />
              آخر تحديث:&nbsp;
              <time dateTime={LEGAL_UPDATED_ISO} className="font-semibold text-ink-soft">
                {LEGAL_UPDATED}
              </time>
            </p>
          </div>
        </div>

        {/* ── Table of contents + body ───────────────────────────────────── */}
        <div className="container-x grid gap-12 py-14 md:py-20 lg:grid-cols-[15rem_1fr] lg:gap-16">
          <aside className="hidden lg:block">
            <nav aria-label="محتويات الصفحة" className="sticky top-28">
              <h2 className="font-display text-sm font-bold uppercase tracking-wider text-muted">
                المحتويات
              </h2>
              <ol className="mt-4 space-y-1.5">
                {doc.sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="flex gap-2.5 rounded-lg px-2 py-1.5 text-sm leading-snug text-ink-soft transition-colors hover:bg-red-50 hover:text-red-700"
                    >
                      <span className="num shrink-0 text-xs font-bold text-muted">{i + 1}</span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <article className="max-w-3xl">
            {doc.sections.map((s, i) => (
              <Section key={s.id} section={s} index={i + 1} contact={contact} />
            ))}

            {/* Cross-links to the sibling documents. */}
            <div className="mt-16 border-t pt-8" style={{ borderColor: "var(--line)" }}>
              <h2 className="font-display text-sm font-bold uppercase tracking-wider text-muted">
                مستندات أخرى
              </h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {others.map((l) => (
                  <Link key={l.slug} href={l.href} className="btn btn-ghost text-sm">
                    {l.label}
                    <Icon name="arrow" size={16} />
                  </Link>
                ))}
              </div>
            </div>
          </article>
        </div>
      </main>

      <Footer
        brand={brand}
        nav={nav}
        footer={footer}
        socials={contact.info.socials}
        hashPrefix="/"
      />
    </>
  );
}

function Section({
  section,
  index,
  contact,
}: {
  section: LegalSection;
  index: number;
  contact: SiteContent["contact"];
}) {
  return (
    <section id={section.id} className="scroll-mt-28 border-t py-9 first:border-t-0 first:pt-0" style={{ borderColor: "var(--line)" }}>
      <h2 className="flex items-baseline gap-3 text-2xl font-bold">
        <span
          className="num shrink-0 text-base font-bold"
          style={{ color: "var(--red-600)" }}
          aria-hidden="true"
        >
          {index}.
        </span>
        {section.title}
      </h2>

      <div className="mt-4 space-y-4 leading-relaxed text-ink-soft">
        {section.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}

        {section.bullets?.length ? (
          <ul className="space-y-2.5">
            {section.bullets.map((b, i) => (
              <li key={i} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-[0.62rem] inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: "var(--red-500)" }}
                />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {section.outro?.map((p, i) => <p key={i}>{p}</p>)}

        {section.contact ? <ContactCard contact={contact} /> : null}
      </div>
    </section>
  );
}

/** Live contact details, pulled from the CMS so the legal pages never go stale. */
function ContactCard({ contact }: { contact: SiteContent["contact"] }) {
  const { phone, whatsapp, email, address, hours } = contact.info;

  const rows: { icon: string; label: string; href?: string; external?: boolean }[] = [];
  if (email) rows.push({ icon: "mail", label: email, href: `mailto:${email}` });
  if (phone) rows.push({ icon: "phone", label: phone, href: `tel:${phone.replace(/[^\d+]/g, "")}` });
  if (whatsapp)
    rows.push({ icon: "whatsapp", label: "واتساب", href: `https://wa.me/${whatsapp}`, external: true });
  if (address) rows.push({ icon: "pin", label: address });
  if (hours) rows.push({ icon: "clock", label: hours });

  return (
    <div className="card mt-6 p-6">
      {rows.length ? (
        <ul className="space-y-3">
          {rows.map((r, i) => (
            <li key={i} className="flex items-center gap-3">
              <span style={{ color: "var(--red-600)" }}>
                <Icon name={r.icon} size={18} />
              </span>
              {r.href ? (
                <a
                  href={r.href}
                  {...(r.external ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="font-semibold text-ink transition-colors hover:text-red-700"
                >
                  {r.label}
                </a>
              ) : (
                <span className="font-semibold text-ink">{r.label}</span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-ink-soft">
          تفاصيل الاتّصال الكاملة متوفّرة في قسم التواصل داخل الموقع.
        </p>
      )}

      <Link
        href="/#contact"
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:opacity-80"
        style={{ color: "var(--red-700)" }}
      >
        الانتقال إلى قسم التواصل
        <Icon name="arrow" size={16} />
      </Link>
    </div>
  );
}
