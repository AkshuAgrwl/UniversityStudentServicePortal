import { redirect, RedirectType } from "next/navigation";
import { auth } from "@/lib/auth";

import { AppSidebar } from "@/components/app-sidebar";
import { AppSidebarNav } from "@/components/app-sidebar-nav";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login", RedirectType.replace);
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppSidebarNav user={session.user} />
        <div className="flex flex-1 flex-col gap-4 mt-10 ml-10">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
