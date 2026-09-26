import { HqHeader } from "@/components/layout/hq-header";
import { getSession } from "@/lib/auth/session";

type HqPageShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export async function HqPageShell({ title, subtitle, children }: HqPageShellProps) {
  const session = await getSession();

  return (
    <>
      <HqHeader title={title} subtitle={subtitle} userName={session?.name} />
      <main className="animate-in shell-main flex-1">
        <div className="shell-content">{children}</div>
      </main>
    </>
  );
}
