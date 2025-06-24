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
    const body = await req.json();
    const { year, month } = body;

    if (!year || !month) {
      return NextResponse.json(
        { error: "Year and month are required." },
        { status: 400 }
      );
    }

    const reportsRes = await fetch(
      `https://cmis-production.up.railway.app/api/v1/user/${userId}/report`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reports = await reportsRes.json();

    if (Array.isArray(reports) && reports.length > 0) {
      const dayjs = (await import("dayjs")).default;

      const latestReport = reports.reduce((latest, current) => {
        const currDate = dayjs(`${current.year}-${current.month}-01`);
        const latestDate = dayjs(`${latest.year}-${latest.month}-01`);
        return currDate.isAfter(latestDate) ? current : latest;
      });


      if (latestReport.status === "DRAFT") {
        return NextResponse.json(
          { error: "Previous report is not submitted yet." },
          { status: 400 }
        );
      }
    }

    const createRes = await fetch(
      `https://cmis-production.up.railway.app/api/v1/user/${userId}/report`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ year, month }),
      }
    );

    const createData = await createRes.json();
    return NextResponse.json(createData);
  } catch (err) {
    console.error("Error in createReport API:", err);
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 }
    );
  }
}
