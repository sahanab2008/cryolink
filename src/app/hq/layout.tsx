import { HqNavProvider } from "@/components/layout/hq-nav";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function HqLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== "OPERATIONS_OFFICIAL") {
    redirect("/");
  }

  return <HqNavProvider>{children}</HqNavProvider>;
}
