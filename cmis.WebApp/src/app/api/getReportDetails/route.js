import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req) {
  const supabase = await createClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let user = session.user.id;
  const token = session.access_token;

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const reportId = searchParams.get("reportId");
  if (userId) {
    user = userId;
  }
  
  if (!reportId) {
    return NextResponse.json({ error: "Missing reportId" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://cmis-production.up.railway.app/api/v1/user/${user}/report/${reportId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to retrieve report data" },
        { status: 500 }
      );
    }
    if (!data) {
      return NextResponse.json(
        { error: "Invalid report data" },
        { status: 200 }
      );
    }
    if (!data.canteenReportExpense) {
      return NextResponse.json({
        status: 200,
        message: "Data retrieval success!",
        reportStatus: data.status,
        date: `${data.year}-${data.month}`,
        data: [],
      });
    }

    const { id, ...canteenReportExpense } = data.canteenReportExpense;
    const expenseKeys = Object.keys(canteenReportExpense);
    const numberOfItems = canteenReportExpense[expenseKeys[0]].expenses.length;

    const transformed = [];

    for (let i = 0; i < numberOfItems; i++) {
      const group = {};
      for (const key of expenseKeys) {
        const item = canteenReportExpense[key].expenses[i];
        if (item) {
          group[key] = {
            itemDescription: item.itemDescription,
            itemCost: item.itemCost,
          };
        }
      }
      transformed.push(group);
    }

    return NextResponse.json({
      status: 200,
      reportStatus: data.status,
      message: "Data retrieval success!",
      data: transformed,
      canteenReportCurrentNetIncome: data.canteenReportCurrentNetIncome,
      year: data.year,
      month: data.month,
    });
  } catch (err) {
    console.error("Error fetching report details:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
