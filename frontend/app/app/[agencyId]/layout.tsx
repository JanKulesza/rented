import AppSidebar from "@/components/layout/sidebar";
import AgencyProvider, { Agency } from "@/components/providers/agency-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { decodeJwt } from "jose";
import { User } from "@/components/providers/auth-provider";

export default async function Layout({
  params,
  children,
}: Readonly<{
  params: Promise<{ agencyId: string }>;
  children: React.ReactNode;
}>) {
  const { agencyId } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("refreshToken")?.value;
  if (!token) {
    return redirect(`/signin?redirectUrl=/app/${agencyId}`);
  }

  const payload = decodeJwt(token);

  const userId = payload._id as string;

  const res = await fetch(`http://localhost:8080/api/agencies/${agencyId}`, {
    cache: "default",
  });
  if (!res.ok) return notFound();

  const agency = (await res.json()) as Agency;

  if (!(agency.agents as User[]).map((a) => a._id).includes(userId))
    return notFound();

  return (
    <AgencyProvider agency={agency}>
      <SidebarProvider>
        <AppSidebar agencyId={agencyId} />
        {/* w-[80%] somehow enables flex-1 to work correctly, and carousel doesn't break the layout */}
        <div className="w-[80%] flex-1 bg-sidebar/40 overflow-hidden border-l border-t border-sidebar-border">
          <SidebarTrigger className="fixed bottom-2 w-10 h-10 z-50" />
          <main className="p-2 lg:p-6 space-y-2 lg:space-y-6">{children}</main>
        </div>
      </SidebarProvider>
    </AgencyProvider>
  );
}
