import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  const supabase = await createClient("admin");
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {

    const { error: authError } = await supabase.auth.admin.deleteUser(userId);

    if (authError) {
      console.error("Failed to delete user from auth:", authError.message);
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }


    const { error: dbError } = await supabase.rpc("delete_user_by_id", {
      user_id: userId,
    });

    if (dbError) {
      console.error("Failed to delete user from User table:", dbError.message);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({
      status: 200,
      message: "User deleted successfully!",
    });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
