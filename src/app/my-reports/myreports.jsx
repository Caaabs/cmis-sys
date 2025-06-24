"use client";

import { useAuth } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";

import AddReportButton from "./AddReport";
import { createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";

export default function MyReports() {
  const router = useRouter();

  const [data, setData] = useState([]);
  const [loadingData, setLoadData] = useState(true);

  const fetchRecord = async () => {
    setLoadData(true);
    const response = await fetch(`/api/getReports`);
    const data = await response.json();
    if (response.ok) {
      setData(data);
      setLoadData(false);
    } else {
      console.error("Error fetching data:", data.error);
      setLoadData(false);
    }
  };

  useEffect(() => {
    fetchRecord();
  }, []);
  
  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("year", {
      header: () => <p className="text-center">Year</p>,
      cell: ({ row }) => {
        return <div className="text-center">{row.original.year}</div>;
      },
    }),
    columnHelper.accessor("month", {
      header: () => <p className="text-center">Month</p>,
      cell: ({ row }) => {
        return (
          <div className="text-center">
            {dayjs()
              .month(row.original.month - 1)
              .format("MMMM")}
          </div>
        );
      },
    }),
    columnHelper.accessor("status", {
      header: () => <p className="text-center">Status</p>,
      cell: ({ row }) => {
        return (
          <div className="text-center">
            {row.original.status === "PENDING" ? (
              <p className="text-orange-500 font-semibold">
                {row.original.status}
              </p>
            ) : (
              <p className="text-green-500 font-semibold">
                {row.original.status}
              </p>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor("id", {
      header: null,
      cell: ({ row }) => {
        const status = row.original.id;
        const handleClick = (id) => {
          router.push(`/my-reports/${id}`);
        };
        return (
          <div className="flex justify-end mr-4">
            <button
              onClick={() => handleClick(status)}
              className="bg-blue-700 rounded text-white px-4 py-1"
            >
              View
            </button>
          </div>
        );
      },
    }),
  ];

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar isAdmin={false} />
          <SidebarInset className="flex-1 overflow-auto">
            <main className="w-full max-w-4xl mx-auto p-4">
              <AddReportButton refreshData={fetchRecord} isGettingReports={loadingData}/>

              <DataTable
                columns={columns}
                data={data}
                isLoading={loadingData}
              />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
