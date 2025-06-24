import { AppSidebar } from "@/components/app-sidebar";

import { SiteHeader } from "@/components/site-header";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/server";

import { redirect } from "next/navigation";
import Content from "./content";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const session = await supabase.auth.getSession();

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
              <Content />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
