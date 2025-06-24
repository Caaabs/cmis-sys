
import { createClient } from "@/utils/supabase/server";

import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  if (user.user_metadata.user_role.toUpperCase() === "ADMIN") {
    return redirect("/admin");
  }
  if (user.user_metadata.user_role.toUpperCase() === "EMPLOYEE") {
    return redirect("/my-reports");
  }

}
