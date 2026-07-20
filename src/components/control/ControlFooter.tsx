import Link from "next/link";
import type { ControlSite } from "@/lib/types";
import { BrandMark } from "@/components/Wordmark";
import { Icon } from "@/components/Icon";
import { LEGAL_LINKS } from "@/lib/legal";

export default function ControlFooter({ site }: { site: ControlSite }) {
  const { contact } = site;
  return (
    <footer style={{ background: "var(--red-950)", color: "oklch(0.94 0.01 40)" }}>
      <div className="container-x py-14">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <BrandMark size={40} />
              <span className="font-display text-2xl font-bold text-white">{site.brand.name}</span>
            </div>
            <p className="mt-4 leading-relaxed text-white/70">{site.footerNote}</p>
          </div>

          <div className="flex flex-col gap-3">
            {contact.phone ? (
              <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-2 text-white/85 hover:text-white">
                <Icon name="phone" size={18} /> {contact.phone}
              </a>
            ) : null}
            {contact.whatsapp ? (
              <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-white/85 hover:text-white">
                <Icon name="whatsapp" size={18} /> واتساب
              </a>
            ) : null}
            {contact.email ? (
              <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-2 text-white/85 hover:text-white">
                <Icon name="mail" size={18} /> {contact.email}
              </a>
            ) : null}
          </div>
        </div>

        <nav
          aria-label="مستندات قانونية"
          className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/12 pt-6 text-sm"
        >
          {LEGAL_LINKS.map((l) => (
            <Link
              key={l.slug}
              href={l.href}
              className="text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="mt-5 flex flex-col items-center justify-between gap-3 text-sm text-white/55 sm:flex-row">
          <Link href="/" className="inline-flex items-center gap-1.5 hover:text-white/85">
            <Icon name="arrowRight" size={15} /> {site.familyNote} — العودة للموقع الرئيسي
          </Link>
          <span>© {site.brand.name}. جميع الحقوق محفوظة.</span>
        </div>
      </div>
    </footer>
  );
}
