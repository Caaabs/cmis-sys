"use client";

import React, { useState } from "react";
import dayjs from "dayjs";

function AddReportButton({ refreshData, isGettingReports }) {
  const [isLoading, setIsLoading] = useState(false);
  const handleAddReport = async () => {
    try {
      setIsLoading(true);
      const getReports = await fetch(`/api/getReports`);
      const data = await getReports.json();

      let nextDate;

      if (!Array.isArray(data) || data.length === 0) {
        nextDate = dayjs();
      } else {
        const latest = data.reduce((latest, current) => {
          const currentDate = dayjs(`${current.year}-${current.month}-01`);
          const latestDate = dayjs(`${latest.year}-${latest.month}-01`);
          return currentDate.isAfter(latestDate) ? current : latest;
        });

        nextDate = dayjs(`${latest.year}-${latest.month}-01`).add(1, "month");
      }

      const year = nextDate.year();
      const month = nextDate.month() + 1;

      const res = await fetch("/api/draftReport", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ year, month }),
      });

      const result = await res.json();

      if (!res.ok) {
        setIsLoading(false);
        console.error("Failed to create report:", result.error);
        alert(result.error || "Failed to create report");
        return;
      }
      setIsLoading(false);

      await refreshData();
      alert("New report created successfully!");
    } catch (err) {
      setIsLoading(false);
      alert("An unexpected error occurred while creating the report.");
    }
  };

  return (
    <button
      onClick={handleAddReport}
      disabled={isLoading || isGettingReports}
      className={`border rounded px-2 mb-2 ${
        isLoading || isGettingReports
          ? "bg-gray-300 text-white"
          : "bg-blue-500 text-white"
      }`}
    >
      {isLoading ? "Adding..." : "Add Report"}
    </button>
  );
}

export default AddReportButton;
