import type { Metadata, Viewport } from "next";
import { Changa, Tajawal, Rubik } from "next/font/google";
import "./globals.css";
import { getContent } from "@/lib/store";
import { brandCssVars } from "@/lib/color";

const changa = Changa({
  subsets: ["arabic", "latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display-src",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-body-src",
  display: "swap",
});

const rubik = Rubik({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rubik",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  const title = `${c.brand.name} — ${c.brand.tagline}`;
  return {
    title,
    description: c.hero.subhead,
    openGraph: { title, description: c.hero.subhead, locale: "ar_IL", type: "website" },
    icons: { icon: "/favicon.svg" },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const c = await getContent();
  const cssVars = brandCssVars(c.brandColor, c.accentColor);

  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${changa.variable} ${tajawal.variable} ${rubik.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Brand ramp derived from a single seed colour, injected at request time. */}
        <style id="brand-vars" dangerouslySetInnerHTML={{ __html: cssVars }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
