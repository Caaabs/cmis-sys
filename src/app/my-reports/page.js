import { redirect } from "next/navigation";
import MyReports from "./myreports";
import { createClient } from "@/utils/supabase/server";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  if (!session) {
    return redirect("/login");
  }

  return <MyReports user={session.user?.user_metadata} token={session.access_token} />;
}
