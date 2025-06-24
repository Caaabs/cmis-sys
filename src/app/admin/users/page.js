import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import UsersTable from "./UsersTable";

export default async function Page() {
  const supabase = await createClient("admin");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  if (user?.user_metadata.user_role.toUpperCase() !== "ADMIN") {
    return redirect("/");
  }

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar
            isAdmin={user?.user_metadata.user_role.toUpperCase() === "ADMIN"}
          />
          <SidebarInset className="flex-1 overflow-auto">
            <main className="w-full max-w-4xl mx-auto p-4">
              <p className="mb-2 font-semibold">Users</p>
              <UsersTable />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
