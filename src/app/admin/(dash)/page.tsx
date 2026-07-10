import { getContent } from "@/lib/store";
import AdminApp from "@/components/admin/AdminApp";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "لوحة تحكم إبسوس",
  robots: { index: false, follow: false },
};

export default async function AdminDashboard() {
  const content = await getContent();
  return <AdminApp initial={content} />;
}
