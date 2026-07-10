import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "دخول — لوحة تحكم إبسوس",
  robots: { index: false, follow: false },
};

// Already signed in (verified signature + expiry) → go straight to the panel.
// A stale/invalid cookie fails this check and simply shows the login form,
// so there is no redirect loop with the middleware / dash layout.
export default async function LoginPage() {
  if (await isAuthenticated()) redirect("/admin");
  return <LoginForm />;
}
