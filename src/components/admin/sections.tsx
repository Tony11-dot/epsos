"use client";

import type { ReactNode } from "react";
import type {
  SiteContent,
  Stat,
  Pillar,
  Course,
  NewsItem,
  Mentor,
  StudentScore,
  ControlGrade,
  Book,
  RegistrationConfig,
} from "@/lib/types";
import { Field, TextInput, NumberInput, TextArea, LinesArea, uid } from "./fields";
import ImageUploader from "./ImageUploader";
import ListEditor from "./ListEditor";
import ColorField from "./ColorField";
import { Icon } from "@/components/Icon";

// A patcher that mutates a structuredClone draft of the whole content tree.
export type Patch = (fn: (c: SiteContent) => void) => void;

// ── layout helpers ─────────────────────────────────────────────────────────
export function Block({ title, desc, children }: { title: string; desc?: string; children: ReactNode }) {
  return (
    <section className="admin-card p-5 sm:p-6">
      <div className="mb-5">
        <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
        {desc ? <p className="mt-1 text-sm text-muted">{desc}</p> : null}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}

function Grid2({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

// Small inline editor for a string[] (chips/highlights), one row each.
function StringList({
  items,
  onChange,
  placeholder,
  addLabel = "إضافة",
}: {
  items: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  addLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            className="admin-input"
            value={it}
            placeholder={placeholder}
            onChange={(e) => {
              const next = items.slice();
              next[i] = e.target.value;
              onChange(next);
            }}
          />
          <button
            type="button"
            className="icon-btn"
            title="حذف"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
          >
            <Icon name="trash" size={16} />
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-ghost self-start px-3.5 py-1.5 text-sm"
        onClick={() => onChange([...items, ""])}
      >
        <Icon name="plus" size={15} /> {addLabel}
      </button>
    </div>
  );
}

// ── 1. Identity & colours ───────────────────────────────────────────────────
export function IdentityEditor({ c, patch }: { c: SiteContent; patch: Patch }) {
  return (
    <>
      <Block title="الهوية" desc="اسم المعهد، الشعار، والجملة التعريفية.">
        <Grid2>
          <Field label="الاسم (بالعربية)">
            <TextInput value={c.brand.name} onChange={(v) => patch((d) => { d.brand.name = v; })} />
          </Field>
          <Field label="الاسم (باللاتينية)">
            <TextInput value={c.brand.latin} onChange={(v) => patch((d) => { d.brand.latin = v; })} />
          </Field>
        </Grid2>
        <Field label="الجملة التعريفية">
          <TextInput value={c.brand.tagline} onChange={(v) => patch((d) => { d.brand.tagline = v; })} />
        </Field>
        <ImageUploader
          label="الشعار (اختياري)"
          value={c.brand.logo}
          ratio="3 / 1"
          onChange={(v) => patch((d) => { d.brand.logo = v; })}
        />
      </Block>

      <Block title="ألوان العلامة" desc="لونٌ واحد يُشتق منه تدرّج الأحمر بالكامل، بالإضافة إلى لون التمييز الأصفر.">
        <ColorField
          label="اللون الأساسي (الأحمر)"
          value={c.brandColor}
          onChange={(v) => patch((d) => { d.brandColor = v; })}
          hint="يُشتق منه التدرّج ٥٠ → ٩٥٠ المستخدم في كامل الموقع."
        />
        <ColorField
          label="لون التمييز (الأصفر)"
          value={c.accentColor}
          onChange={(v) => patch((d) => { d.accentColor = v; })}
          showRamp={false}
          hint="يُستخدم للتفاصيل والخطوط الصغيرة."
        />
      </Block>
    </>
  );
}

// ── 2. Navigation ───────────────────────────────────────────────────────────
export function NavEditor({ c, patch }: { c: SiteContent; patch: Patch }) {
  return (
    <>
      <Block title="زر الدعوة في الشريط">
        <Grid2>
          <Field label="نص الزر">
            <TextInput value={c.nav.ctaLabel} onChange={(v) => patch((d) => { d.nav.ctaLabel = v; })} />
          </Field>
          <Field label="الرابط" hint="مثال: ‎#contact">
            <TextInput value={c.nav.ctaHref} onChange={(v) => patch((d) => { d.nav.ctaHref = v; })} />
          </Field>
        </Grid2>
      </Block>
      <Block title="روابط القائمة" desc="أضِف، احذف، وأعد ترتيب روابط شريط التنقّل.">
        <ListEditor
          items={c.nav.links}
          onChange={(items) => patch((d) => { d.nav.links = items; })}
          makeNew={() => ({ id: uid("n"), label: "رابط جديد", href: "#" })}
          itemTitle={(it) => it.label}
          itemSubtitle={(it) => it.href}
          addLabel="إضافة رابط"
          renderItem={(it, i, update) => (
            <Grid2>
              <Field label="النص">
                <TextInput value={it.label} onChange={(v) => update({ label: v })} />
              </Field>
              <Field label="الرابط">
                <TextInput value={it.href} onChange={(v) => update({ href: v })} />
              </Field>
            </Grid2>
          )}
        />
      </Block>
    </>
  );
}

// ── 3. Hero ─────────────────────────────────────────────────────────────────
export function HeroEditor({ c, patch }: { c: SiteContent; patch: Patch }) {
  return (
    <>
      <Block title="العنوان الرئيسي">
        <Field label="أسطر العنوان" hint="كل سطر يظهر منفصلاً؛ الخط الأحمر يُرسم تحت السطر الأخير.">
          <LinesArea
            value={c.hero.headlineLines}
            onChange={(v) => patch((d) => { d.hero.headlineLines = v; })}
            rows={2}
            hint="سطر واحد لكل صف."
          />
        </Field>
        <Field label="النص التوضيحي">
          <TextArea value={c.hero.subhead} onChange={(v) => patch((d) => { d.hero.subhead = v; })} />
        </Field>
      </Block>

      <Block title="أزرار الدعوة">
        <Grid2>
          <Field label="الزر الأساسي — النص">
            <TextInput value={c.hero.primaryCtaLabel} onChange={(v) => patch((d) => { d.hero.primaryCtaLabel = v; })} />
          </Field>
          <Field label="الزر الأساسي — الرابط">
            <TextInput value={c.hero.primaryCtaHref} onChange={(v) => patch((d) => { d.hero.primaryCtaHref = v; })} />
          </Field>
          <Field label="الزر الثانوي — النص">
            <TextInput value={c.hero.secondaryCtaLabel} onChange={(v) => patch((d) => { d.hero.secondaryCtaLabel = v; })} />
          </Field>
          <Field label="الزر الثانوي — الرابط">
            <TextInput value={c.hero.secondaryCtaHref} onChange={(v) => patch((d) => { d.hero.secondaryCtaHref = v; })} />
          </Field>
        </Grid2>
      </Block>

      <Block title="الأرقام والإحصاءات" desc="أرقامٌ تتصاعد عند ظهورها.">
        <ListEditor<Stat>
          items={c.hero.stats}
          onChange={(items) => patch((d) => { d.hero.stats = items; })}
          makeNew={() => ({ id: uid("s"), value: 0, label: "عنوان الرقم" })}
          itemTitle={(it) => `${it.prefix ?? ""}${it.value}${it.suffix ?? ""} — ${it.label}`}
          addLabel="إضافة رقم"
          renderItem={(it, i, update) => (
            <div className="flex flex-col gap-4">
              <Grid2>
                <Field label="القيمة">
                  <NumberInput value={it.value} onChange={(v) => update({ value: v })} />
                </Field>
                <Field label="التسمية">
                  <TextInput value={it.label} onChange={(v) => update({ label: v })} />
                </Field>
                <Field label="بادئة (اختياري)" hint="مثل +">
                  <TextInput value={it.prefix ?? ""} onChange={(v) => update({ prefix: v })} />
                </Field>
                <Field label="لاحقة (اختياري)" hint="مثل ٪">
                  <TextInput value={it.suffix ?? ""} onChange={(v) => update({ suffix: v })} />
                </Field>
              </Grid2>
            </div>
          )}
        />
      </Block>
    </>
  );
}

// ── shared kicker/title/intro block ─────────────────────────────────────────
function HeadingBlock({
  kicker,
  title,
  intro,
  onKicker,
  onTitle,
  onIntro,
}: {
  kicker: string;
  title: string;
  intro?: string;
  onKicker: (v: string) => void;
  onTitle: (v: string) => void;
  onIntro?: (v: string) => void;
}) {
  return (
    <Block title="عنوان القسم">
      <Grid2>
        <Field label="التمهيد (فوق العنوان)">
          <TextInput value={kicker} onChange={onKicker} />
        </Field>
        <Field label="العنوان">
          <TextInput value={title} onChange={onTitle} />
        </Field>
      </Grid2>
      {onIntro ? (
        <Field label="النص التمهيدي">
          <TextArea value={intro ?? ""} onChange={onIntro} rows={2} />
        </Field>
      ) : null}
    </Block>
  );
}

// ── 4. About ────────────────────────────────────────────────────────────────
export function AboutEditor({ c, patch }: { c: SiteContent; patch: Patch }) {
  return (
    <>
      <HeadingBlock
        kicker={c.about.kicker}
        title={c.about.title}
        onKicker={(v) => patch((d) => { d.about.kicker = v; })}
        onTitle={(v) => patch((d) => { d.about.title = v; })}
      />
      <Block title="نص التعريف" desc="كل سطر يُعرض كفقرة مستقلة.">
        <LinesArea value={c.about.body} onChange={(v) => patch((d) => { d.about.body = v; })} rows={5} hint="سطر واحد لكل فقرة." />
      </Block>
      <Block title="الركائز الثلاث">
        <ListEditor<Pillar>
          items={c.about.pillars}
          onChange={(items) => patch((d) => { d.about.pillars = items; })}
          makeNew={() => ({ id: uid("p"), icon: "spark", title: "ركيزة جديدة", body: "" })}
          itemTitle={(it) => it.title}
          addLabel="إضافة ركيزة"
          renderItem={(it, i, update) => (
            <div className="flex flex-col gap-4">
              <Grid2>
                <Field label="العنوان">
                  <TextInput value={it.title} onChange={(v) => update({ title: v })} />
                </Field>
                <IconPicker value={it.icon} onChange={(v) => update({ icon: v })} />
              </Grid2>
              <Field label="النص">
                <TextArea value={it.body} onChange={(v) => update({ body: v })} rows={3} />
              </Field>
            </div>
          )}
        />
      </Block>
    </>
  );
}

// ── 5. Courses ──────────────────────────────────────────────────────────────
// Shared course editor (used by both the main courses and كونترول courses).
function makeNewCourse(): Course {
  return {
    id: uid("c"),
    title: "دورة جديدة",
    kicker: "",
    duration: "",
    level: "",
    summary: "",
    description: "",
    highlights: [],
    cover: { url: "", alt: "" },
    books: [],
    gallery: [],
  };
}

function CourseItemFields({
  it,
  update,
  hideBooks = false,
}: {
  it: Course;
  update: (p: Partial<Course>) => void;
  hideBooks?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      <ImageUploader label="صورة الغلاف" value={it.cover} ratio="16 / 10" onChange={(v) => update({ cover: v })} />
      <Grid2>
        <Field label="العنوان">
          <TextInput value={it.title} onChange={(v) => update({ title: v })} />
        </Field>
        <Field label="شارة (اختياري)" hint="مثل: الأكثر طلبًا">
          <TextInput value={it.kicker ?? ""} onChange={(v) => update({ kicker: v })} />
        </Field>
        <Field label="المدة">
          <TextInput value={it.duration} onChange={(v) => update({ duration: v })} />
        </Field>
        <Field label="المستوى">
          <TextInput value={it.level} onChange={(v) => update({ level: v })} />
        </Field>
      </Grid2>
      <Field label="ملخّص قصير (للبطاقة)">
        <TextArea value={it.summary} onChange={(v) => update({ summary: v })} rows={2} />
      </Field>
      <Field label="الوصف الكامل (للنافذة)" hint="افصل الفقرات بأسطر جديدة.">
        <TextArea value={it.description} onChange={(v) => update({ description: v })} rows={5} />
      </Field>
      <Field label="أبرز النقاط">
        <StringList items={it.highlights} onChange={(v) => update({ highlights: v })} placeholder="نقطة مميّزة" addLabel="إضافة نقطة" />
      </Field>
      {hideBooks ? null : (
      <div>
        <span className="admin-field-label">الكتب والمواد</span>
        <p className="mb-2 text-xs text-muted">تظهر ككتب مُصمّمة داخل نافذة الدورة (تختفي إن لم توجد).</p>
        <ListEditor<Book>
          items={it.books ?? []}
          onChange={(b) => update({ books: b })}
          makeNew={() => ({ id: uid("bk"), title: "كتاب جديد", tag: "", color: "oklch(0.577 0.214 27)", cover: { url: "", alt: "" } })}
          itemTitle={(b, bi) => b.title || `كتاب ${bi + 1}`}
          itemSubtitle={(b) => b.tag ?? ""}
          addLabel="إضافة كتاب"
          emptyLabel="لا كتب بعد."
          renderItem={(b, bi, bu) => (
            <div className="flex flex-col gap-4">
              <ImageUploader label="غلاف الكتاب (اختياري)" value={b.cover} ratio="3 / 4" onChange={(v) => bu({ cover: v })} />
              <Grid2>
                <Field label="عنوان الكتاب">
                  <TextInput value={b.title} onChange={(v) => bu({ title: v })} />
                </Field>
                <Field label="وسم قصير (اختياري)" hint="مثل: 800، كمّي">
                  <TextInput value={b.tag ?? ""} onChange={(v) => bu({ tag: v })} />
                </Field>
              </Grid2>
              <ColorField label="لون الكتاب" value={b.color ?? "oklch(0.577 0.214 27)"} onChange={(v) => bu({ color: v })} showRamp={false} />
            </div>
          )}
        />
      </div>
      )}
      <div>
        <span className="admin-field-label">معرض الصور</span>
        <div className="mt-2">
          <ListEditor
            items={it.gallery}
            onChange={(g) => update({ gallery: g })}
            makeNew={() => ({ id: uid("g"), url: "", alt: "" })}
            itemTitle={(g, gi) => g.alt || `صورة ${gi + 1}`}
            addLabel="إضافة صورة للمعرض"
            emptyLabel="لا صور في المعرض بعد."
            renderItem={(g, gi, gu) => (
              <ImageUploader label="صورة" value={g} ratio="1 / 1" onChange={(v) => gu({ url: v.url, alt: v.alt })} />
            )}
          />
        </div>
      </div>
    </div>
  );
}

export function CoursesEditor({ c, patch }: { c: SiteContent; patch: Patch }) {
  return (
    <>
      <HeadingBlock
        kicker={c.courses.kicker}
        title={c.courses.title}
        intro={c.courses.intro}
        onKicker={(v) => patch((d) => { d.courses.kicker = v; })}
        onTitle={(v) => patch((d) => { d.courses.title = v; })}
        onIntro={(v) => patch((d) => { d.courses.intro = v; })}
      />
      <Block title="الدورات">
        <ListEditor<Course>
          items={c.courses.items}
          onChange={(items) => patch((d) => { d.courses.items = items; })}
          makeNew={makeNewCourse}
          itemTitle={(it) => it.title}
          itemSubtitle={(it) => [it.duration, it.level].filter(Boolean).join(" · ")}
          addLabel="إضافة دورة"
          renderItem={(it, i, update) => <CourseItemFields it={it} update={update} />}
        />
      </Block>
    </>
  );
}

// ── 6. News ─────────────────────────────────────────────────────────────────
export function NewsEditor({ c, patch }: { c: SiteContent; patch: Patch }) {
  return (
    <>
      <HeadingBlock
        kicker={c.news.kicker}
        title={c.news.title}
        onKicker={(v) => patch((d) => { d.news.kicker = v; })}
        onTitle={(v) => patch((d) => { d.news.title = v; })}
      />
      <Block title="الأخبار" desc="فعّل «مميّز» لعرض الخبر بشكل بارز.">
        <ListEditor<NewsItem>
          items={c.news.items}
          onChange={(items) => patch((d) => { d.news.items = items; })}
          makeNew={() => ({
            id: uid("nw"),
            title: "خبر جديد",
            date: new Date().toISOString().slice(0, 10),
            tag: "",
            excerpt: "",
            body: "",
            cover: { url: "", alt: "" },
            featured: false,
          })}
          itemTitle={(it) => it.title}
          itemSubtitle={(it) => it.date}
          addLabel="إضافة خبر"
          renderItem={(it, i, update) => (
            <div className="flex flex-col gap-4">
              <ImageUploader label="صورة الخبر" value={it.cover} ratio="16 / 9" onChange={(v) => update({ cover: v })} />
              <Grid2>
                <Field label="العنوان">
                  <TextInput value={it.title} onChange={(v) => update({ title: v })} />
                </Field>
                <Field label="التاريخ">
                  <TextInput type="date" value={it.date} onChange={(v) => update({ date: v })} />
                </Field>
                <Field label="وسم (اختياري)" hint="مثل: تسجيل، نتائج">
                  <TextInput value={it.tag ?? ""} onChange={(v) => update({ tag: v })} />
                </Field>
                <label className="flex items-center gap-2.5 self-end pb-2">
                  <input
                    type="checkbox"
                    checked={Boolean(it.featured)}
                    onChange={(e) => update({ featured: e.target.checked })}
                    className="h-4 w-4 accent-[var(--red-600)]"
                  />
                  <span className="text-sm font-medium text-ink">خبر مميّز</span>
                </label>
              </Grid2>
              <Field label="مقتطف قصير">
                <TextArea value={it.excerpt} onChange={(v) => update({ excerpt: v })} rows={2} />
              </Field>
              <Field label="النص الكامل">
                <TextArea value={it.body} onChange={(v) => update({ body: v })} rows={4} />
              </Field>
            </div>
          )}
        />
      </Block>
    </>
  );
}

// ── 7. Mentors ──────────────────────────────────────────────────────────────
export function MentorsEditor({ c, patch }: { c: SiteContent; patch: Patch }) {
  return (
    <>
      <HeadingBlock
        kicker={c.mentors.kicker}
        title={c.mentors.title}
        intro={c.mentors.intro}
        onKicker={(v) => patch((d) => { d.mentors.kicker = v; })}
        onTitle={(v) => patch((d) => { d.mentors.title = v; })}
        onIntro={(v) => patch((d) => { d.mentors.intro = v; })}
      />
      <Block title="المحاضرون">
        <ListEditor<Mentor>
          items={c.mentors.items}
          onChange={(items) => patch((d) => { d.mentors.items = items; })}
          makeNew={() => ({ id: uid("m"), name: "محاضر جديد", role: "", tagline: "", bio: "", portrait: { url: "", alt: "" } })}
          itemTitle={(it) => it.name}
          itemSubtitle={(it) => it.role}
          addLabel="إضافة محاضر"
          renderItem={(it, i, update) => (
            <div className="flex flex-col gap-4">
              <ImageUploader label="الصورة الشخصية" value={it.portrait} shape="circle" onChange={(v) => update({ portrait: v })} />
              <Grid2>
                <Field label="الاسم">
                  <TextInput value={it.name} onChange={(v) => update({ name: v })} />
                </Field>
                <Field label="الدور / التخصّص">
                  <TextInput value={it.role} onChange={(v) => update({ role: v })} />
                </Field>
              </Grid2>
              <Field label="جملة قصيرة (اختياري)">
                <TextInput value={it.tagline ?? ""} onChange={(v) => update({ tagline: v })} />
              </Field>
              <Field label="النبذة">
                <TextArea value={it.bio} onChange={(v) => update({ bio: v })} rows={4} />
              </Field>
            </div>
          )}
        />
      </Block>
    </>
  );
}

// ── 8. Honour roll ──────────────────────────────────────────────────────────
export function HonorEditor({ c, patch }: { c: SiteContent; patch: Patch }) {
  return (
    <>
      <HeadingBlock
        kicker={c.honorRoll.kicker}
        title={c.honorRoll.title}
        intro={c.honorRoll.intro}
        onKicker={(v) => patch((d) => { d.honorRoll.kicker = v; })}
        onTitle={(v) => patch((d) => { d.honorRoll.title = v; })}
        onIntro={(v) => patch((d) => { d.honorRoll.intro = v; })}
      />
      <Block title="الإعدادات">
        <Field label="أعلى علامة ممكنة" hint="للسياق تحت كل رقم، مثل ٨٠٠.">
          <NumberInput value={c.honorRoll.maxScore} onChange={(v) => patch((d) => { d.honorRoll.maxScore = v; })} />
        </Field>
      </Block>
      <Block title="الطلاب الأوائل">
        <ListEditor<StudentScore>
          items={c.honorRoll.items}
          onChange={(items) => patch((d) => { d.honorRoll.items = items; })}
          makeNew={() => ({ id: uid("h"), name: "اسم الطالب", score: 0, note: "", photo: { url: "", alt: "" } })}
          itemTitle={(it) => it.name}
          itemSubtitle={(it) => String(it.score)}
          addLabel="إضافة طالب"
          renderItem={(it, i, update) => (
            <div className="flex flex-col gap-4">
              <ImageUploader label="صورة الطالب" value={it.photo} shape="circle" onChange={(v) => update({ photo: v })} />
              <Grid2>
                <Field label="الاسم">
                  <TextInput value={it.name} onChange={(v) => update({ name: v })} />
                </Field>
                <Field label="العلامة">
                  <NumberInput value={it.score} onChange={(v) => update({ score: v })} />
                </Field>
              </Grid2>
              <Field label="ملاحظة (اختياري)" hint="مثل: دورة ٢٠٢٥">
                <TextInput value={it.note ?? ""} onChange={(v) => update({ note: v })} />
              </Field>
            </div>
          )}
        />
      </Block>
    </>
  );
}

// ── 9. Control (kids) — teaser + shared grades/courses ──────────────────────
export function ControlEditor({ c, patch }: { c: SiteContent; patch: Patch }) {
  return (
    <>
      <HeadingBlock
        kicker={c.control.kicker}
        title={c.control.title}
        intro={c.control.intro}
        onKicker={(v) => patch((d) => { d.control.kicker = v; })}
        onTitle={(v) => patch((d) => { d.control.title = v; })}
        onIntro={(v) => patch((d) => { d.control.intro = v; })}
      />
      <Block title="زر الانتقال" desc="النص الذي يقود إلى موقع كونترول المستقل (/control).">
        <Field label="نص الزر">
          <TextInput value={c.control.ctaLabel} onChange={(v) => patch((d) => { d.control.ctaLabel = v; })} />
        </Field>
      </Block>
      <Block title="الصفوف" desc="لكل صفّ لونه المميّز. تظهر في الموقع الرئيسي وفي موقع كونترول.">
        <ListEditor<ControlGrade>
          items={c.control.grades}
          onChange={(items) => patch((d) => { d.control.grades = items; })}
          makeNew={() => ({ id: uid("g"), label: "صف جديد", note: "", color: "oklch(0.7 0.14 60)" })}
          itemTitle={(it) => it.label}
          itemSubtitle={(it) => it.note ?? ""}
          addLabel="إضافة صف"
          renderItem={(it, i, update) => (
            <div className="flex flex-col gap-4">
              <Grid2>
                <Field label="اسم الصف">
                  <TextInput value={it.label} onChange={(v) => update({ label: v })} />
                </Field>
                <Field label="وصف قصير">
                  <TextInput value={it.note ?? ""} onChange={(v) => update({ note: v })} />
                </Field>
              </Grid2>
              <ColorField label="لون الصف" value={it.color} onChange={(v) => update({ color: v })} showRamp={false} />
            </div>
          )}
        />
      </Block>

      <Block title="دورات كونترول" desc="دورات للأطفال، بنفس شكل الدورات الأساسية (بدون كتب).">
        <Grid2>
          <Field label="عنوان مجموعة الدورات">
            <TextInput value={c.control.coursesTitle} onChange={(v) => patch((d) => { d.control.coursesTitle = v; })} />
          </Field>
          <Field label="نص تمهيدي">
            <TextInput value={c.control.coursesIntro} onChange={(v) => patch((d) => { d.control.coursesIntro = v; })} />
          </Field>
        </Grid2>
        <ListEditor<Course>
          items={c.control.courses ?? []}
          onChange={(items) => patch((d) => { d.control.courses = items; })}
          makeNew={makeNewCourse}
          itemTitle={(it) => it.title}
          itemSubtitle={(it) => [it.duration, it.level].filter(Boolean).join(" · ")}
          addLabel="إضافة دورة كونترول"
          emptyLabel="لا دورات كونترول بعد."
          renderItem={(it, i, update) => <CourseItemFields it={it} update={update} hideBooks />}
        />
      </Block>
    </>
  );
}

// ── 10. Contact ─────────────────────────────────────────────────────────────
export function ContactEditor({ c, patch }: { c: SiteContent; patch: Patch }) {
  const info = c.contact.info;
  return (
    <>
      <HeadingBlock
        kicker={c.contact.kicker}
        title={c.contact.title}
        intro={c.contact.intro}
        onKicker={(v) => patch((d) => { d.contact.kicker = v; })}
        onTitle={(v) => patch((d) => { d.contact.title = v; })}
        onIntro={(v) => patch((d) => { d.contact.intro = v; })}
      />
      <Block title="بيانات التواصل">
        <Grid2>
          <Field label="الهاتف">
            <TextInput value={info.phone} onChange={(v) => patch((d) => { d.contact.info.phone = v; })} />
          </Field>
          <Field label="واتساب" hint="أرقام فقط مع رمز الدولة، مثل ٩٧٢…">
            <TextInput value={info.whatsapp} onChange={(v) => patch((d) => { d.contact.info.whatsapp = v; })} />
          </Field>
          <Field label="البريد الإلكتروني">
            <TextInput value={info.email} onChange={(v) => patch((d) => { d.contact.info.email = v; })} />
          </Field>
          <Field label="ساعات العمل">
            <TextInput value={info.hours ?? ""} onChange={(v) => patch((d) => { d.contact.info.hours = v; })} />
          </Field>
        </Grid2>
        <Field label="العنوان">
          <TextInput value={info.address} onChange={(v) => patch((d) => { d.contact.info.address = v; })} />
        </Field>
        <Field label="رابط الخريطة (اختياري)">
          <TextInput value={info.mapUrl ?? ""} onChange={(v) => patch((d) => { d.contact.info.mapUrl = v; })} />
        </Field>
      </Block>
      <Block title="روابط التواصل الاجتماعي">
        <ListEditor
          items={info.socials}
          onChange={(items) => patch((d) => { d.contact.info.socials = items; })}
          makeNew={() => ({ id: uid("so"), label: "منصّة", url: "https://", icon: "instagram" })}
          itemTitle={(it) => it.label}
          addLabel="إضافة رابط"
          renderItem={(it, i, update) => (
            <div className="flex flex-col gap-4">
              <Grid2>
                <Field label="الاسم">
                  <TextInput value={it.label} onChange={(v) => update({ label: v })} />
                </Field>
                <Field label="الرابط">
                  <TextInput value={it.url} onChange={(v) => update({ url: v })} />
                </Field>
              </Grid2>
              <IconPicker
                value={it.icon}
                onChange={(v) => update({ icon: v })}
                options={["instagram", "facebook", "whatsapp", "mail", "phone"]}
              />
            </div>
          )}
        />
      </Block>
    </>
  );
}

// ── App showcase ────────────────────────────────────────────────────────────
export function AppEditor({ c, patch }: { c: SiteContent; patch: Patch }) {
  return (
    <>
      <HeadingBlock
        kicker={c.app.kicker}
        title={c.app.title}
        intro={c.app.intro}
        onKicker={(v) => patch((d) => { d.app.kicker = v; })}
        onTitle={(v) => patch((d) => { d.app.title = v; })}
        onIntro={(v) => patch((d) => { d.app.intro = v; })}
      />
      <Block title="لقطات التطبيق" desc="كل لقطة تظهر داخل إطار هاتف مع نصّها. يختفي القسم إن لم توجد لقطات.">
        <ListEditor
          items={c.app.screens}
          onChange={(items) => patch((d) => { d.app.screens = items; })}
          makeNew={() => ({ id: uid("app"), title: "شاشة جديدة", body: "", shot: { url: "", alt: "" } })}
          itemTitle={(it) => it.title}
          addLabel="إضافة لقطة"
          renderItem={(it, i, update) => (
            <div className="flex flex-col gap-4">
              <ImageUploader label="لقطة الشاشة" value={it.shot} ratio="9 / 19" onChange={(v) => update({ shot: v })} />
              <Field label="العنوان">
                <TextInput value={it.title} onChange={(v) => update({ title: v })} />
              </Field>
              <Field label="النص">
                <TextArea value={it.body} onChange={(v) => update({ body: v })} rows={3} />
              </Field>
            </div>
          )}
        />
      </Block>
      <Block title="روابط المتاجر (اختياري)" desc="أزرار App Store / Google Play.">
        <ListEditor
          items={c.app.storeLinks}
          onChange={(items) => patch((d) => { d.app.storeLinks = items; })}
          makeNew={() => ({ id: uid("st"), label: "App Store", url: "https://", icon: "arrow" })}
          itemTitle={(it) => it.label}
          addLabel="إضافة رابط متجر"
          emptyLabel="لا روابط بعد."
          renderItem={(it, i, update) => (
            <Grid2>
              <Field label="النص">
                <TextInput value={it.label} onChange={(v) => update({ label: v })} />
              </Field>
              <Field label="الرابط">
                <TextInput value={it.url} onChange={(v) => update({ url: v })} />
              </Field>
            </Grid2>
          )}
        />
      </Block>
    </>
  );
}

// ── Reusable registration fields (used by both Epsos & كونترول) ─────────────
function RegistrationFields({
  r,
  set,
}: {
  r: RegistrationConfig;
  set: (fn: (reg: RegistrationConfig) => void) => void;
}) {
  const L = r.labels;
  return (
    <>
      <HeadingBlock
        kicker={r.kicker}
        title={r.title}
        intro={r.intro}
        onKicker={(v) => set((reg) => { reg.kicker = v; })}
        onTitle={(v) => set((reg) => { reg.title = v; })}
        onIntro={(v) => set((reg) => { reg.intro = v; })}
      />
      <Block title="زر الحث العائم (FAB)">
        <Field label="نص الزر العائم">
          <TextInput value={r.fabLabel} onChange={(v) => set((reg) => { reg.fabLabel = v; })} />
        </Field>
      </Block>
      <Block title="قائمة المدن" desc="تظهر في قائمة اختيار المدينة. سطر لكل مدينة.">
        <LinesArea
          value={r.cities}
          onChange={(v) => set((reg) => { reg.cities = v.filter((x) => x.trim()); })}
          rows={8}
          hint="سطر واحد لكل مدينة."
        />
      </Block>
      <Block title="تسميات الحقول">
        <Grid2>
          <Field label="الاسم الشخصي"><TextInput value={L.firstName} onChange={(v) => set((reg) => { reg.labels.firstName = v; })} /></Field>
          <Field label="اسم العائلة"><TextInput value={L.lastName} onChange={(v) => set((reg) => { reg.labels.lastName = v; })} /></Field>
          <Field label="الهاتف"><TextInput value={L.phone} onChange={(v) => set((reg) => { reg.labels.phone = v; })} /></Field>
          <Field label="المدينة"><TextInput value={L.city} onChange={(v) => set((reg) => { reg.labels.city = v; })} /></Field>
          <Field label="نص افتراضي للمدينة"><TextInput value={L.cityPlaceholder} onChange={(v) => set((reg) => { reg.labels.cityPlaceholder = v; })} /></Field>
          <Field label="البريد"><TextInput value={L.email} onChange={(v) => set((reg) => { reg.labels.email = v; })} /></Field>
          <Field label="الدورة"><TextInput value={L.course} onChange={(v) => set((reg) => { reg.labels.course = v; })} /></Field>
          <Field label="نص افتراضي للدورة"><TextInput value={L.coursePlaceholder} onChange={(v) => set((reg) => { reg.labels.coursePlaceholder = v; })} /></Field>
          <Field label="زر الإرسال"><TextInput value={L.submit} onChange={(v) => set((reg) => { reg.labels.submit = v; })} /></Field>
        </Grid2>
        <Field label="ملاحظة الموافقة (أسفل الزر)">
          <TextInput value={r.consentNote} onChange={(v) => set((reg) => { reg.consentNote = v; })} />
        </Field>
      </Block>
      <Block title="رسالة النجاح" desc="تظهر بعد إرسال النموذج.">
        <Field label="العنوان">
          <TextInput value={r.successTitle} onChange={(v) => set((reg) => { reg.successTitle = v; })} />
        </Field>
        <Field label="النص">
          <TextArea value={r.successBody} onChange={(v) => set((reg) => { reg.successBody = v; })} rows={2} />
        </Field>
      </Block>
    </>
  );
}

// ── 11. Registration (Epsos) ────────────────────────────────────────────────
export function RegistrationEditor({ c, patch }: { c: SiteContent; patch: Patch }) {
  return (
    <>
      <RegistrationFields r={c.registration} set={(fn) => patch((d) => fn(d.registration))} />
      <Block title="أين تُحفظ التسجيلات؟">
        <p className="text-sm leading-relaxed text-muted">
          تُرسَل الطلبات إلى جدول Google Sheets عند ضبط الرابط في إعدادات الخادم
          (<span className="num" dir="ltr">SHEETS_WEBHOOK_URL</span>). راجِع الملف
          <span className="num" dir="ltr"> docs/apps-script.gs </span>
          لخطوات الربط. تُحفظ نسخة احتياطية محليًّا دائمًا. عمود «القسم» يميّز إبسوس عن كونترول.
        </p>
      </Block>
    </>
  );
}

// ── كونترول site editors ────────────────────────────────────────────────────
export function ControlSiteIdentityEditor({ c, patch }: { c: SiteContent; patch: Patch }) {
  const s = c.controlSite;
  return (
    <>
      <Block title="هوية موقع كونترول">
        <Grid2>
          <Field label="الاسم"><TextInput value={s.brand.name} onChange={(v) => patch((d) => { d.controlSite.brand.name = v; })} /></Field>
          <Field label="الجملة التعريفية"><TextInput value={s.brand.tagline} onChange={(v) => patch((d) => { d.controlSite.brand.tagline = v; })} /></Field>
        </Grid2>
        <Field label="جملة العائلة" hint="مثل: من عائلة إبسوس">
          <TextInput value={s.familyNote} onChange={(v) => patch((d) => { d.controlSite.familyNote = v; })} />
        </Field>
        <ImageUploader label="شعار كونترول (اختياري)" value={s.brand.logo} ratio="3 / 1" onChange={(v) => patch((d) => { d.controlSite.brand.logo = v; })} />
      </Block>
      <Block title="ألوان موقع كونترول" desc="لموقع كونترول تدرّجه اللوني المستقل.">
        <ColorField label="اللون الأساسي" value={s.brandColor} onChange={(v) => patch((d) => { d.controlSite.brandColor = v; })} />
        <ColorField label="لون التمييز" value={s.accentColor} onChange={(v) => patch((d) => { d.controlSite.accentColor = v; })} showRamp={false} />
      </Block>
      <Block title="واجهة كونترول">
        <Field label="أسطر العنوان" hint="سطر لكل صف.">
          <LinesArea value={s.hero.headlineLines} onChange={(v) => patch((d) => { d.controlSite.hero.headlineLines = v; })} rows={2} hint="سطر لكل صف." />
        </Field>
        <Field label="النص التوضيحي">
          <TextArea value={s.hero.subhead} onChange={(v) => patch((d) => { d.controlSite.hero.subhead = v; })} />
        </Field>
        <Grid2>
          <Field label="الزر الأساسي"><TextInput value={s.hero.primaryCtaLabel} onChange={(v) => patch((d) => { d.controlSite.hero.primaryCtaLabel = v; })} /></Field>
          <Field label="الزر الثانوي"><TextInput value={s.hero.secondaryCtaLabel} onChange={(v) => patch((d) => { d.controlSite.hero.secondaryCtaLabel = v; })} /></Field>
        </Grid2>
      </Block>
      <Block title="أرقام كونترول">
        <ListEditor<Stat>
          items={s.hero.stats}
          onChange={(items) => patch((d) => { d.controlSite.hero.stats = items; })}
          makeNew={() => ({ id: uid("cs"), value: 0, label: "عنوان الرقم" })}
          itemTitle={(it) => `${it.prefix ?? ""}${it.value}${it.suffix ?? ""} — ${it.label}`}
          addLabel="إضافة رقم"
          renderItem={(it, i, update) => (
            <Grid2>
              <Field label="القيمة"><NumberInput value={it.value} onChange={(v) => update({ value: v })} /></Field>
              <Field label="التسمية"><TextInput value={it.label} onChange={(v) => update({ label: v })} /></Field>
              <Field label="بادئة"><TextInput value={it.prefix ?? ""} onChange={(v) => update({ prefix: v })} /></Field>
              <Field label="لاحقة"><TextInput value={it.suffix ?? ""} onChange={(v) => update({ suffix: v })} /></Field>
            </Grid2>
          )}
        />
      </Block>
    </>
  );
}

export function ControlSiteRegistrationEditor({ c, patch }: { c: SiteContent; patch: Patch }) {
  return <RegistrationFields r={c.controlSite.registration} set={(fn) => patch((d) => fn(d.controlSite.registration))} />;
}

export function ControlSiteFooterEditor({ c, patch }: { c: SiteContent; patch: Patch }) {
  const s = c.controlSite;
  return (
    <>
      <Block title="تواصل كونترول">
        <Field label="العنوان"><TextInput value={s.contact.title} onChange={(v) => patch((d) => { d.controlSite.contact.title = v; })} /></Field>
        <Field label="نص تمهيدي"><TextInput value={s.contact.intro} onChange={(v) => patch((d) => { d.controlSite.contact.intro = v; })} /></Field>
        <Grid2>
          <Field label="الهاتف"><TextInput value={s.contact.phone} onChange={(v) => patch((d) => { d.controlSite.contact.phone = v; })} /></Field>
          <Field label="واتساب"><TextInput value={s.contact.whatsapp} onChange={(v) => patch((d) => { d.controlSite.contact.whatsapp = v; })} /></Field>
        </Grid2>
        <Field label="البريد"><TextInput value={s.contact.email} onChange={(v) => patch((d) => { d.controlSite.contact.email = v; })} /></Field>
      </Block>
      <Block title="تذييل كونترول">
        <Field label="جملة التعريف">
          <TextArea value={s.footerNote} onChange={(v) => patch((d) => { d.controlSite.footerNote = v; })} rows={2} />
        </Field>
      </Block>
    </>
  );
}

// ── 12. Footer ──────────────────────────────────────────────────────────────
export function FooterEditor({ c, patch }: { c: SiteContent; patch: Patch }) {
  return (
    <Block title="التذييل">
      <Field label="جملة التعريف">
        <TextArea value={c.footer.note} onChange={(v) => patch((d) => { d.footer.note = v; })} rows={2} />
      </Field>
      <Field label="حقوق النشر">
        <TextInput value={c.footer.credit} onChange={(v) => patch((d) => { d.footer.credit = v; })} />
      </Field>
    </Block>
  );
}

// ── icon picker (for pillars & socials) ─────────────────────────────────────
function IconPicker({
  value,
  onChange,
  options = ["target", "spark", "shield", "book", "users", "medal", "blocks", "pen", "clock"],
}: {
  value: string;
  onChange: (v: string) => void;
  options?: string[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="admin-field-label">الأيقونة</span>
      <div className="flex flex-wrap gap-2">
        {options.map((name) => {
          const active = value === name;
          return (
            <button
              key={name}
              type="button"
              onClick={() => onChange(name)}
              className="grid h-10 w-10 place-items-center rounded-xl border transition-colors"
              style={{
                borderColor: active ? "var(--red-500)" : "var(--line-strong)",
                background: active ? "var(--red-50)" : "var(--paper)",
                color: active ? "var(--red-700)" : "var(--ink-soft)",
              }}
              aria-pressed={active ? "true" : "false"}
              title={name}
            >
              <Icon name={name} size={20} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
