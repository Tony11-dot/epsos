import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

// Authoritative auth gate for the dashboard (Node runtime: full signature +
// expiry verification). Middleware only does the redirect-UX pre-check.
export default async function DashLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthenticated())) redirect("/admin/login");
  return children;
}
