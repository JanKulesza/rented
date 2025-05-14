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
    cache: "no-store",
  });

  if (!res.ok) return notFound();

  const agency = await res.json();

  if (!("_id" in agency)) return notFound();

  return (
    <AgencyProvider agency={agency}>
      <div>
        <SidebarProvider>
          <AppSidebar agencyId={agencyId} />
          <main>
            <SidebarTrigger />
            {children}
          </main>
        </SidebarProvider>
      </div>
    </AgencyProvider>
  );
}
