"use client";

import { useState } from "react";
import type { Course } from "@/lib/types";
import Reveal from "@/components/Reveal";
import Modal from "@/components/Modal";
import { CoverImage } from "@/components/Placeholder";
import BookCover from "@/components/BookCover";
import { Icon } from "@/components/Icon";

type Lenis = { scrollTo: (t: Element | string, o?: { offset?: number }) => void };

// Reusable course grid + in-window detail dialog. Used by both the main
// courses section and the kids "كونترول" courses. Renders nothing if empty.
export default function CourseCollection({ items }: { items: Course[] }) {
  const [active, setActive] = useState<Course | null>(null);
  if (!items || items.length === 0) return null;

  function goRegister(courseTitle: string) {
    setActive(null);
    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent("epsos:register-course", { detail: courseTitle }));
      const el = document.getElementById("register");
      if (!el) return;
      const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
      if (lenis) lenis.scrollTo(el, { offset: -80 });
      else el.scrollIntoView({ behavior: "smooth" });
    }, 60);
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((course, i) => (
          <Reveal key={course.id} delay={i * 90}>
            <button
              type="button"
              onClick={() => setActive(course)}
              className="card group block h-full w-full overflow-hidden text-start transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)]"
            >
              <div className="relative">
                <CoverImage
                  image={course.cover}
                  label={course.title}
                  ratio="16 / 10"
                  className="w-full"
                  sizes="(max-width: 768px) 100vw, 380px"
                />
                {course.kicker ? (
                  <span
                    className="absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold"
                    style={{ background: "var(--accent)", color: "var(--ink)" }}
                  >
                    {course.kicker}
                  </span>
                ) : null}
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-ink">{course.title}</h3>
                <p className="mt-2 line-clamp-2 text-ink-soft">{course.summary}</p>

                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
                  {course.duration ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="clock" size={16} /> {course.duration}
                    </span>
                  ) : null}
                  {course.level ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="layers" size={16} /> {course.level}
                    </span>
                  ) : null}
                </div>

                <span className="mt-5 inline-flex items-center gap-1.5 font-semibold text-red-700 transition-transform duration-300 group-hover:-translate-x-1">
                  التفاصيل
                  <Icon name="arrow" size={16} />
                </span>
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      <Modal open={Boolean(active)} onClose={() => setActive(null)} labelledBy="course-title">
        {active ? <CourseDetail course={active} onRegister={goRegister} /> : null}
      </Modal>
    </>
  );
}

function CourseDetail({ course, onRegister }: { course: Course; onRegister: (title: string) => void }) {
  const books = course.books ?? [];
  const gallery = course.gallery ?? [];
  const paragraphs = course.description.split("\n").filter((p) => p.trim());

  return (
    <div>
      <CoverImage
        image={course.cover}
        label={course.title}
        ratio="21 / 9"
        className="w-full"
        sizes="(max-width: 900px) 100vw, 830px"
      />
      <div className="p-7 sm:p-9">
        <div className="flex flex-wrap items-center gap-2">
          {course.kicker ? <span className="chip">{course.kicker}</span> : null}
          {course.duration ? (
            <span className="chip">
              <Icon name="clock" size={14} /> {course.duration}
            </span>
          ) : null}
          {course.level ? (
            <span className="chip">
              <Icon name="layers" size={14} /> {course.level}
            </span>
          ) : null}
        </div>

        <h3 id="course-title" className="mt-4 font-display text-3xl font-bold text-ink">
          {course.title}
        </h3>

        {paragraphs.length > 0 && (
          <div className="mt-4 space-y-3 text-[1.03rem] leading-relaxed text-ink-soft">
            {paragraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        )}

        {course.highlights.length > 0 && (
          <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {course.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2.5 text-ink">
                <span
                  className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "var(--red-600)", color: "white" }}
                >
                  <Icon name="check" size={13} />
                </span>
                {h}
              </li>
            ))}
          </ul>
        )}

        {books.length > 0 && (
          <div className="mt-8">
            <h4 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
              <Icon name="book" size={20} />
              الكتب والمواد
            </h4>
            <p className="mt-1 text-sm text-muted">مجموعة المواد المرافقة لهذه الدورة.</p>
            <div className="mt-5 grid grid-cols-3 gap-4 sm:grid-cols-4">
              {books.map((b) => (
                <BookCover key={b.id} book={b} />
              ))}
            </div>
          </div>
        )}

        {gallery.length > 0 && (
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {gallery.map((g) => (
              <CoverImage
                key={g.id}
                image={g}
                ratio="1 / 1"
                className="w-full overflow-hidden rounded-xl"
                sizes="200px"
              />
            ))}
          </div>
        )}

        <div className="mt-8">
          <button type="button" onClick={() => onRegister(course.title)} className="btn btn-primary text-[1rem]">
            سجّل في هذه الدورة
            <Icon name="arrow" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
