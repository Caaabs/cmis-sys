"use client";

import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardCheck, UserRound } from "lucide-react";
import { useEffect, useState } from "react";

export default function Content() {
  const [userCount, setUserCount] = useState(0);
  const [reportCompletion, setReportCompletion] = useState("");
  const [userCountLoading, setUserCountLoading] = useState(false);
  const [reportCompletionLoading, setReportCompletionLoading] = useState(false);
  const getAllUsers = async () => {
    setUserCountLoading(true);
    setReportCompletionLoading(true);
    const response = await fetch(`/api/getAllUsers`);
    const data = await response.json();
    if (response.ok) {
      setUserCount(data.filter((dt) => dt.userRole === "employee").length);

      getReportCompletion(data.filter((dt) => dt.userRole === "employee"));
    } else {
      console.error("Error fetching data:", data.error);
      setUserCountLoading(false);
    }
  };

  const getReportCompletion = async (users) => {
    const responses = await Promise.all(
      users.map((user) => fetch(`/api/getReports?userId=${user.id}`))
    );

    const results = await Promise.all(responses.map((res) => res.json()));
    const allReports = results.flat();
    const submittedCount = allReports.filter(
      (item) => item.status === "SUBMITTED"
    ).length;
    const draftCount = allReports.filter(
      (item) => item.status === "DRAFT"
    ).length;

    const totalCount = submittedCount + draftCount;
    const submittedPercentage =
      totalCount > 0 ? (submittedCount / totalCount) * 100 : 0;

    setReportCompletion(submittedPercentage.toFixed(2));
    setUserCountLoading(false);
    setReportCompletionLoading(false);
  };

  useEffect(() => {
    getAllUsers();
  }, []);
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-2">
        <div className="bg-muted/50 rounded-xl flex items-center justify-center">
          <Card className="w-full border-l-4 border-l-red-500">
            <CardContent>
              <div className="flex flex-row items-center">
                <UserRound className="mr-2" />
                {userCountLoading ? (
                  "Loading..."
                ) : (
                  <>
                    <span className="text-2xl font-semibold mr-2">
                      {userCount}
                    </span>
                    <p className="font-semibold">No. of Participants</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="bg-muted/50 rounded-xl flex items-center justify-center">
          <Card className="w-full border-l-4 border-l-red-500">
            <CardContent>
              <div className="flex flex-row">
                <ClipboardCheck className="mr-2" />
                <p className="font-semibold">
                  {reportCompletionLoading
                    ? "Loading..."
                    : `${reportCompletion}% Completed`}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={[
          {
            id: "728ed52f",
            schoolName: "Test School",
            time: 2323,
            monthDayYear: 44,
            status: "pending",
          },
          // ...
        ]}
      />
    </div>
  );
}
