import Link from "next/link";
import Image from "next/image";
import type { ControlSite } from "@/lib/types";
import { BrandMark } from "@/components/Wordmark";
import { Icon } from "@/components/Icon";

export default function ControlNav({
  brand,
  familyNote,
  registerLabel,
}: {
  brand: ControlSite["brand"];
  familyNote: string;
  registerLabel: string;
}) {
  return (
    <header
      className="fixed inset-x-0 top-0 z-50"
      style={{
        background: "oklch(0.992 0.003 90 / 0.85)",
        backdropFilter: "saturate(140%) blur(12px)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <nav className="container-x flex h-[86px] items-center justify-between gap-4">
        <a href="#top" className="inline-flex items-center gap-2.5" aria-label={brand.name}>
          {brand.logo?.url ? (
            <Image src={brand.logo.url} alt={brand.logo.alt || brand.name} width={180} height={48} className="h-12 w-auto object-contain" priority />
          ) : (
            <>
              <BrandMark size={44} />
              <span className="inline-flex flex-col leading-none">
                <span className="font-display text-[1.85rem] font-bold text-ink">{brand.name}</span>
                <span className="mt-1 text-[0.66rem] font-semibold tracking-[0.24em] text-muted">{familyNote}</span>
              </span>
            </>
          )}
        </a>

        <div className="flex items-center gap-2.5">
          <Link href="/" className="hidden items-center gap-1.5 rounded-full px-3.5 py-2 text-[0.92rem] font-medium text-ink-soft transition-colors hover:text-red-700 sm:inline-flex">
            <Icon name="arrowRight" size={16} />
            العودة لإبسوس
          </Link>
          <a href="#register" className="btn btn-primary text-[0.92rem]">
            {registerLabel}
          </a>
        </div>
      </nav>
    </header>
  );
}
