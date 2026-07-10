// ─────────────────────────────────────────────────────────────────────────
// Content model for Epsos (إبسوس)
// A single JSON document drives both the public site and the admin CMS.
// Everything a visitor can see is editable here.
// ─────────────────────────────────────────────────────────────────────────

export type ID = string;

/** A single uploaded (or absent) image reference. */
export interface ImageRef {
  /** Public URL, or "" when not uploaded yet (a branded placeholder renders). */
  url: string;
  /** Arabic alt text for accessibility. */
  alt?: string;
}

export interface Stat {
  id: ID;
  /** Numeric value that counts up, e.g. 20, 5000, 98. */
  value: number;
  /** Optional prefix/suffix around the number, e.g. "+", "%". */
  suffix?: string;
  prefix?: string;
  /** Label under the number. */
  label: string;
}

export interface Pillar {
  id: ID;
  /** Short icon key (see components/Icon.tsx) — e.g. "target", "spark", "shield". */
  icon: string;
  title: string;
  body: string;
}

export interface GalleryImage extends ImageRef {
  id: ID;
}

/** A course material shown as a branded "book" in the detail dialog. */
export interface Book {
  id: ID;
  title: string;
  /** Optional tag on the spine, e.g. "800", "REV". */
  tag?: string;
  /** Optional accent colour (OKLCH/hex) for the book's disc + edge. */
  color?: string;
  /** Optional cover photo; a branded book placeholder renders when absent. */
  cover: ImageRef;
}

export interface Course {
  id: ID;
  title: string;
  /** e.g. "دورة مكثّفة" — shown as a small kicker on the card. */
  kicker?: string;
  duration: string; // e.g. "٨ أسابيع"
  level: string; // e.g. "مستوى متقدّم"
  /** Short teaser on the card. */
  summary: string;
  /** Full rich (plain multi-paragraph) description in the dialog. */
  description: string;
  /** Bullet highlights shown in the dialog. */
  highlights: string[];
  cover: ImageRef;
  /** Course materials, rendered as branded books in the detail dialog. */
  books: Book[];
  gallery: GalleryImage[];
}

export interface NewsItem {
  id: ID;
  title: string;
  /** ISO date string; formatted for display in Arabic. */
  date: string;
  /** Short tag, e.g. "إعلان", "نتائج". */
  tag?: string;
  excerpt: string;
  body: string;
  cover: ImageRef;
  featured?: boolean;
}

export interface Mentor {
  id: ID;
  name: string;
  role: string; // e.g. "محاضر الرياضيات"
  /** Short line on the card. */
  tagline?: string;
  bio: string;
  portrait: ImageRef;
}

export interface StudentScore {
  id: ID;
  name: string;
  score: number; // e.g. 742
  /** Optional note, e.g. "دورة 2024". */
  note?: string;
  photo: ImageRef;
}

export interface ControlGrade {
  id: ID;
  /** Grade label, e.g. "الصف الرابع". */
  label: string;
  /** Short descriptor, e.g. "أساسيات التفكير". */
  note?: string;
  /** OKLCH or hex color for the chip. */
  color: string;
}

export interface ContactInfo {
  phone: string;
  whatsapp: string; // digits only for wa.me link
  email: string;
  address: string;
  mapUrl?: string;
  hours?: string;
  socials: { id: ID; label: string; url: string; icon: string }[];
}

export interface RegistrationConfig {
  kicker: string;
  title: string;
  intro: string;
  /** Selectable cities in the form (editable list). */
  cities: string[];
  labels: {
    firstName: string;
    lastName: string;
    phone: string;
    city: string;
    cityPlaceholder: string;
    email: string;
    course: string;
    coursePlaceholder: string;
    submit: string;
  };
  consentNote: string;
  successTitle: string;
  successBody: string;
  fabLabel: string;
}

/** Standalone كونترول site chrome (its own brand + colours + registration). */
export interface ControlSite {
  brandColor: string;
  accentColor: string;
  brand: { name: string; tagline: string; logo: ImageRef };
  familyNote: string; // e.g. "من عائلة إبسوس"
  hero: {
    headlineLines: string[];
    subhead: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    stats: Stat[];
  };
  registration: RegistrationConfig;
  contact: {
    title: string;
    intro: string;
    phone: string;
    whatsapp: string;
    email: string;
  };
  footerNote: string;
}

export interface SiteContent {
  /** Single editable brand seed color (OKLCH string). Whole red ramp derives from it. */
  brandColor: string;
  /** Secondary accent (yellow) seed color (OKLCH string). */
  accentColor: string;

  brand: {
    name: string; // "إبسوس"
    latin: string; // "Epsos"
    tagline: string; // "الأوائل في البسيخومتري"
    logo: ImageRef; // optional; wordmark used when absent
  };

  nav: {
    links: { id: ID; label: string; href: string }[];
    ctaLabel: string;
    ctaHref: string;
  };

  hero: {
    headlineLines: string[]; // rendered as stacked kufi lines; last word gets the underline
    subhead: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
    stats: Stat[];
  };

  about: {
    kicker: string;
    title: string;
    body: string[]; // paragraphs
    pillars: Pillar[];
  };

  courses: {
    kicker: string;
    title: string;
    intro: string;
    items: Course[];
  };

  news: {
    kicker: string;
    title: string;
    items: NewsItem[];
  };

  mentors: {
    kicker: string;
    title: string;
    intro: string;
    items: Mentor[];
  };

  honorRoll: {
    kicker: string;
    title: string;
    intro: string;
    /** Max possible score (for context), e.g. 800. */
    maxScore: number;
    items: StudentScore[];
  };

  control: {
    kicker: string;
    title: string;
    intro: string;
    /** Label of the button that routes to the standalone كونترول site. */
    ctaLabel: string;
    grades: ControlGrade[];
    /** Kids-division courses — same shape & UI as the main courses (no books). */
    coursesTitle: string;
    coursesIntro: string;
    courses: Course[];
  };

  /** The standalone كونترول site chrome (rendered at /control). */
  controlSite: ControlSite;

  app: {
    kicker: string;
    title: string;
    intro: string;
    /** Each app screenshot shown in a phone frame with its own copy. */
    screens: {
      id: ID;
      title: string;
      body: string;
      shot: ImageRef;
    }[];
    /** Optional store buttons (App Store / Google Play …). */
    storeLinks: { id: ID; label: string; url: string; icon: string }[];
  };

  registration: RegistrationConfig;

  contact: {
    kicker: string;
    title: string;
    intro: string;
    info: ContactInfo;
  };

  footer: {
    note: string;
    credit: string;
  };
}
