import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import LoginClient from "./_components/login-client";

export default async function page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user) redirect("/dashboard");

  return <LoginClient />;
}
