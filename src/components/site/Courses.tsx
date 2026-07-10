import type { SiteContent } from "@/lib/types";
import SectionHead from "./SectionHead";
import CourseCollection from "./CourseCollection";

export default function Courses({ courses }: { courses: SiteContent["courses"] }) {
  if (courses.items.length === 0) return null;
  return (
    <section id="courses" className="section" style={{ background: "var(--paper-2)" }}>
      <div className="container-x">
        <SectionHead kicker={courses.kicker} title={courses.title} intro={courses.intro} />
        <div className="mt-14">
          <CourseCollection items={courses.items} />
        </div>
      </div>
    </section>
  );
}
