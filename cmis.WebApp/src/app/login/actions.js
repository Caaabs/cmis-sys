"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const { data: dt, error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    let errorMsg = "";
    switch (error.code) {
      case "invalid_credentials":
        errorMsg = "Invalid email or password.";
        break;
      case "email_not_confirmed":
        errorMsg =
          "Email not confirmed. Please check your inbox for a verification email.";
        break;
    }
    return { message: errorMsg };
  }

  if (!dt.user && !dt.session) {
    return { message: "Invalid email or password." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user.user_metadata.user_role.toUpperCase() === "ADMIN") {
    redirect("/admin");
  }

  revalidatePath("/", "layout");
  redirect("/my-reports");
}

export async function signup(formData) {
  const supabase = await createClient();

  const req = {
    email: formData.get("email"),
    password: formData.get("password"),
    options: { data: { user_role: formData.get("role") } },
  };

  const { data, error } = await supabase.auth.signUp(req);

  if (error) {
    return { error };
  }

  return { data };
}

export async function logout() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { error } = await supabase.auth.signOut();

    return redirect("/login");
  }
}
