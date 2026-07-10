import { Rings, Disc, PenTick, Frame, Plus, DotField } from "@/components/BrandShapes";

// Fills a section's negative space with a curated arrangement of brand marks.
// Sits behind the content (-z-10, above the section's own background), is fully
// clipped to the section box (no horizontal scroll), pointer-transparent, and
// aria-hidden. Colours follow the active theme ramp, so it recolours on /control
// and whenever the admin changes the seed colour. Several variants keep adjacent
// sections from looking identical without being noisy.

type Variant = "a" | "b" | "c" | "d" | "e";

export default function SectionDecor({
  variant = "a",
  tone = "dark",
}: {
  variant?: Variant;
  tone?: "dark" | "light";
}) {
  // "light" tone = for the drenched-red section (white marks on red paper).
  const outline = tone === "light" ? "oklch(1 0 0 / 0.4)" : "var(--red-200)";
  const outlineSoft = tone === "light" ? "oklch(1 0 0 / 0.25)" : "var(--red-100)";
  const dot = tone === "light" ? "oklch(1 0 0 / 0.55)" : "var(--red-300)";
  const accent = "var(--accent)";
  const dotFieldClass =
    tone === "light" ? "opacity-[0.18]" : "opacity-70";

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {variant === "a" && (
        <>
          <Rings className="absolute -left-24 top-12 opacity-60 spin-slow" size={240} stroke={outlineSoft} />
          <Frame className="absolute right-[7%] top-[18%] hidden rotate-12 opacity-70 float-soft md:block" size={104} stroke={outline} />
          <Disc className="absolute right-[16%] bottom-[20%] float-soft" size={12} color={accent} />
          <Plus className="absolute left-[10%] bottom-[24%] hidden opacity-80 md:block" size={20} color={dot} />
          <DotField className={`absolute -right-6 bottom-0 h-40 w-56 ${dotFieldClass}`} />
        </>
      )}

      {variant === "b" && (
        <>
          <Frame className="absolute -right-14 top-16 -rotate-6 opacity-70 float-soft" size={150} stroke={outlineSoft} />
          <Rings className="absolute left-[4%] bottom-[-40px] hidden opacity-50 spin-slow md:block" size={200} stroke={outline} />
          <Disc className="absolute left-[14%] top-[22%] float-soft" size={10} color={accent} />
          <Plus className="absolute right-[12%] bottom-[26%] hidden opacity-80 md:block" size={22} color={dot} />
          <DotField className={`absolute left-0 top-8 h-44 w-48 ${dotFieldClass}`} />
        </>
      )}

      {variant === "c" && (
        <>
          <PenTick className="absolute left-[8%] top-[14%] hidden opacity-70 md:block" width={110} color={outline} />
          <Rings className="absolute -right-20 bottom-[-30px] opacity-55 spin-slow" size={220} stroke={outlineSoft} />
          <Frame className="absolute left-[6%] bottom-[12%] hidden rotate-6 opacity-60 float-soft lg:block" size={92} stroke={outline} />
          <Disc className="absolute right-[10%] top-[26%] float-soft" size={13} color={accent} />
          <Plus className="absolute right-[22%] bottom-[30%] hidden opacity-80 lg:block" size={18} color={dot} />
        </>
      )}

      {variant === "d" && (
        <>
          <Rings className="absolute right-[6%] top-10 opacity-55 spin-slow" size={210} stroke={outlineSoft} />
          <Frame className="absolute -left-12 bottom-10 rotate-12 opacity-70 float-soft" size={128} stroke={outline} />
          <Disc className="absolute left-[20%] top-[18%] float-soft" size={11} color={accent} />
          <Plus className="absolute right-[18%] bottom-[22%] hidden opacity-80 md:block" size={20} color={dot} />
          <DotField className={`absolute right-0 bottom-4 h-40 w-52 ${dotFieldClass}`} />
        </>
      )}

      {variant === "e" && (
        <>
          <PenTick className="absolute right-[10%] top-[16%] hidden opacity-70 md:block" width={120} color={outline} />
          <Frame className="absolute -left-10 top-1/3 -rotate-6 opacity-60 float-soft" size={110} stroke={outlineSoft} />
          <Rings className="absolute right-[-40px] bottom-[-20px] hidden opacity-50 spin-slow lg:block" size={190} stroke={outline} />
          <Disc className="absolute left-[12%] bottom-[24%] float-soft" size={12} color={accent} />
          <Plus className="absolute left-[26%] top-[20%] hidden opacity-80 md:block" size={18} color={dot} />
        </>
      )}
    </div>
  );
}
