import AppSidebar from "@/components/elements/sidebar";
import AgencyProvider from "@/components/providers/agency-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { notFound } from "next/navigation";

export default async function Layout({
  params,
  children,
}: Readonly<{
  params: { agencyId: string };
  children: React.ReactNode;
}>) {
  const { agencyId } = await params;

  const res = await fetch(`http://localhost:8080/api/agencies/${agencyId}`, {
    cache: "default",
  });
  if (!res.ok) return notFound();

  const agency = await res.json();

  if (!("_id" in agency)) return notFound();

  return (
    <AgencyProvider agency={agency}>
      <SidebarProvider>
        <AppSidebar agencyId={agencyId} />
        {/* w-[80%] somehow enables flex-1 to work correctly, and carousel doesn't break the layout */}
        <div className="w-[80%] flex-1 bg-sidebar/40">
          <SidebarTrigger className="fixed bottom-2 w-10 h-10" />
          <main className="sm:p-2 lg:p-6 space-y-2 lg:space-y-6">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </AgencyProvider>
  );
}
