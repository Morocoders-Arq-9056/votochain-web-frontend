import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { routes } from "@/lib/ui/routes";

export const instant = false;

export default async function Home() {
  const jar = await cookies();
  redirect(jar.has("session") ? routes.cuenta() : routes.login());
}
