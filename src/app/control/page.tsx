import type { Metadata } from "next";
import { getContent } from "@/lib/store";
import { brandCssVars } from "@/lib/color";
import SmoothScroll from "@/components/SmoothScroll";
import CursorGlow from "@/components/CursorGlow";
import ControlNav from "@/components/control/ControlNav";
import ControlFooter from "@/components/control/ControlFooter";
import Hero from "@/components/site/Hero";
import SectionHead from "@/components/site/SectionHead";
import CourseCollection from "@/components/site/CourseCollection";
import Register from "@/components/site/Register";
import RegisterFab from "@/components/site/RegisterFab";
import Reveal from "@/components/Reveal";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  const cs = c.controlSite;
  return {
    title: `${cs.brand.name} — ${cs.brand.tagline}`,
    description: cs.hero.subhead,
  };
}

export default async function ControlPage() {
  const c = await getContent();
  const cs = c.controlSite;
  const grades = c.control.grades ?? [];
  // كونترول courses never show books.
  const courses = (c.control.courses ?? []).map((co) => ({ ...co, books: [] }));
  const cssVars = brandCssVars(cs.brandColor, cs.accentColor);

  // Reuse the main Hero with control-site data.
  const brandData = { name: cs.brand.name, latin: "", tagline: cs.brand.tagline, logo: cs.brand.logo };
  const heroData = {
    headlineLines: cs.hero.headlineLines,
    subhead: cs.hero.subhead,
    primaryCtaLabel: cs.hero.primaryCtaLabel,
    primaryCtaHref: "#register",
    secondaryCtaLabel: cs.hero.secondaryCtaLabel,
    secondaryCtaHref: "#control-courses",
    stats: cs.hero.stats,
  };

  return (
    <>
      {/* Override the brand ramp for the whole كونترول site. */}
      <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      <SmoothScroll />
      <CursorGlow />
      <ControlNav brand={cs.brand} familyNote={cs.familyNote} registerLabel={cs.hero.primaryCtaLabel} />

      <main>
        <Hero brand={brandData} hero={heroData} />

        {/* Grades */}
        {grades.length > 0 && (
          <section className="section" style={{ background: "var(--paper-2)" }}>
            <div className="container-x">
              <SectionHead kicker="المراحل" title="لكل مرحلة برنامجها" align="center" />
              <div className="mt-12 flex flex-wrap justify-center gap-4">
                {grades.map((g, i) => (
                  <Reveal key={g.id} delay={i * 70}>
                    <div className="card flex w-[15rem] items-center gap-4 p-5">
                      <span
                        className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl font-display text-xl font-bold text-white shadow-sm"
                        style={{ background: g.color }}
                        aria-hidden="true"
                      >
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-display text-lg font-bold text-ink">{g.label}</h3>
                        {g.note ? <p className="text-sm text-muted">{g.note}</p> : null}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Courses (no books) */}
        {courses.length > 0 && (
          <section id="control-courses" className="section">
            <div className="container-x">
              <SectionHead kicker={c.control.kicker} title={c.control.coursesTitle} intro={c.control.coursesIntro} />
              <div className="mt-14">
                <CourseCollection items={courses} />
              </div>
            </div>
          </section>
        )}

        {/* Registration (division = كونترول) */}
        <Register
          registration={cs.registration}
          division="كونترول"
          courses={courses.map((course) => ({ id: course.id, title: course.title }))}
        />
      </main>

      <ControlFooter site={cs} />
      <RegisterFab label={cs.registration.fabLabel} />
    </>
  );
}
