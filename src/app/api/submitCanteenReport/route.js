import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;
  const userId = session?.user?.id;

  if (!token || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      reportId,
      canteenReportPreviousNetIncome,
      canteenReportCurrentNetIncome,
      supplementaryExpense,
      schoolClinicExpense,
      facultyStudentDevelopmentFundExpense,
      heInstructionExpense,
      schoolOperationExpense,
      revolvingCapitalExpense,
    } = await req.json();
    
    const {
      id,
      canteenReportId,
      ...cleanedPreviousNetIncome
    } = canteenReportPreviousNetIncome || {};

    if (!reportId) {
      return NextResponse.json(
        { error: "Report ID is required" },
        { status: 400 }
      );
    }

    const res = await fetch(
      `https://cmis-production.up.railway.app/api/v1/user/${userId}/report/${reportId}/submit`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          canteenReportPreviousNetIncome: cleanedPreviousNetIncome,
          canteenReportCurrentNetIncome,
          supplementaryExpense,
          schoolClinicExpense,
          facultyStudentDevelopmentFundExpense,
          heInstructionExpense,
          schoolOperationExpense,
          revolvingCapitalExpense,
        }),
      }
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error in report submission:", err);
    return NextResponse.json(
      { error: "Failed to submit report" },
      { status: 500 }
    );
  }
}
