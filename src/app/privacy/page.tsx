import type { Metadata } from "next";
import { getContent } from "@/lib/store";
import LegalPage from "@/components/site/LegalPage";
import { LEGAL_DOCS } from "@/lib/legal";

const doc = LEGAL_DOCS.privacy;

// Brand name/colours and contact details come from the CMS at request time.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  const title = `${doc.title} — ${c.brand.name}`;
  return {
    title,
    description: doc.description,
    alternates: { canonical: "/privacy" },
    openGraph: { title, description: doc.description, locale: "ar_IL", type: "article" },
  };
}

export default async function PrivacyPage() {
  const content = await getContent();
  return <LegalPage doc={doc} content={content} />;
}
