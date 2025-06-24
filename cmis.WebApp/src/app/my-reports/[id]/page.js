import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import ReportDetails from "./reportdetails";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect("/login");
  }

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar isAdmin={false} />
          <SidebarInset className="flex-1 overflow-auto">
            <main className="p-4">
              <ReportDetails token={session.access_token} />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
