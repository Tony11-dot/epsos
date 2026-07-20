import Link from "next/link";
import type { SiteContent } from "@/lib/types";
import Wordmark from "@/components/Wordmark";
import { Icon } from "@/components/Icon";
import { LEGAL_LINKS } from "@/lib/legal";

export default function Footer({
  brand,
  nav,
  footer,
  socials,
  hashPrefix = "",
}: {
  brand: SiteContent["brand"];
  nav: SiteContent["nav"];
  footer: SiteContent["footer"];
  socials: SiteContent["contact"]["info"]["socials"];
  /**
   * Prefix for in-page anchors. Empty on the home page (plain "#about" keeps
   * smooth scrolling); "/" on sub-routes so the link navigates home first.
   */
  hashPrefix?: string;
}) {
  return (
    <footer style={{ background: "var(--red-950)", color: "oklch(0.94 0.01 40)" }}>
      <div className="container-x py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_auto]">
          <div className="max-w-sm">
            <Wordmark brand={brand} variant="light" />
            <p className="mt-4 leading-relaxed text-white/70">{footer.note}</p>
          </div>

          <nav aria-label="روابط سريعة">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white/50">
              روابط
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
              {nav.links.map((l) => (
                <li key={l.id}>
                  <a
                    href={l.href.startsWith("#") ? `${hashPrefix}${l.href}` : l.href}
                    className="text-white/80 transition-colors hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white/50">
              تابعنا
            </h3>
            <div className="mt-4 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-white/60 hover:text-white"
                >
                  <Icon name={s.icon} size={20} />
                </a>
              ))}
            </div>
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
          <span>{footer.credit}</span>
          <span className="inline-flex items-center gap-1.5">
            {brand.tagline}
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent)" }} />
          </span>
        </div>
      </div>
    </footer>
  );
}
