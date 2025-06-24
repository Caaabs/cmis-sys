"use client";

import { DataTable } from "@/components/data-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import dayjs from "dayjs";

export default function ReportDetails() {
  const router = useRouter();
  const searchParams = useSearchParams(); // This replaces router.query
  const pathname = usePathname();
  const reportId = pathname.split("/")[3];

  const [data, setData] = useState([]);
  const [form, setForm] = useState([]);
  const [loadingData, setLoadData] = useState(true);
  const [status, setStatus] = useState("");
  const [reportDate, setReportDate] = useState(null);
  const [canteenReportPreviousIncome, setCanteenReportPreviousIncome] =
    useState();
  const userId = searchParams.get("userId");
  const fetchRecord = async () => {
    setLoadData(true);
    const res = await fetch(
      `/api/getReportDetails?reportId=${reportId}&userId=${userId}`
    );
    const data = await res.json();
    if (res.ok) {
      const year = data.year ?? dayjs(data.date).year();
      const month = data.month ?? dayjs(data.date).month() + 1;
      const prev = dayjs(
        `${year}-${String(month).padStart(2, "0")}-01`
      ).subtract(1, "month");
      const prevYear = prev.year();
      const prevMonth = prev.month() + 1;

      const getReports = await fetch(`/api/getReports?userId=${userId}`);
      const reportsData = await getReports.json();

      const previousData = reportsData.filter((dt) => {
        return Number(dt.year) === prevYear && Number(dt.month) === prevMonth;
      });

      if (previousData.length > 0) {
        const prevRepDetails = await fetch(
          `/api/getReportDetails?reportId=${previousData[0].id}&userId=${userId}`
        );
        const data = await prevRepDetails.json();
        setCanteenReportPreviousIncome({
          ...data.canteenReportCurrentNetIncome,
          supplementaryNetIncome: +parseFloat(
            data.canteenReportCurrentNetIncome.supplementaryNetIncome
          ).toFixed(2),
          schoolClinicNetIncome: +parseFloat(
            data.canteenReportCurrentNetIncome.schoolClinicNetIncome
          ).toFixed(2),
          facultyStudentDevelopmentNetIncome: +parseFloat(
            data.canteenReportCurrentNetIncome
              .facultyStudentDevelopmentNetIncome
          ).toFixed(2),
          heInstructionNetIncome: +parseFloat(
            data.canteenReportCurrentNetIncome.heInstructionNetIncome
          ).toFixed(2),
          schoolOperationNetIncome: +parseFloat(
            data.canteenReportCurrentNetIncome.schoolOperationNetIncome
          ).toFixed(2),
          revolvingCapitalNetIncome: +parseFloat(
            data.canteenReportCurrentNetIncome.revolvingCapitalNetIncome
          ).toFixed(2),
          totalNetIncome: +parseFloat(
            data.canteenReportCurrentNetIncome.totalNetIncome
          ).toFixed(2),
        });
      }
      if (data.reportStatus === "SUBMITTED") {
        setData(data.data);
        setForm(data.data);
        setReportDate(
          dayjs(`${data.year}-${data.month}-01`).format("MMMM YYYY")
        );
      }

      setStatus(data.reportStatus);
      setLoadData(false);
    } else {
      console.error("Error fetching data:", data.error);
      setLoadData(false);
    }
  };
  useEffect(() => {
    fetchRecord();
  }, []);

  const handleBack = () => {
    router.back();
  };
  return (
    <main className="p-2">
      <button className="border px-4 mb-4 rounded" onClick={handleBack}>
        Back
      </button>
      <div className="text-center text-sm mb-4">
        <p>
          Canteen Report for <span className="font-semibold">{reportDate}</span>
        </p>
        <p>Department of Education</p>
        <p>Region 4A - CALABARZON</p>
        <p>Division of Manila</p>
        <p>John Joe National School</p>
      </div>
      <DataTable columns={columns} data={data} isLoading={loadingData} />

      <div className="mt-4">
        <DataTable
          columns={[
            {
              id: "summary",
              header: () => <p className="text-center">Summary</p>,
              cell: ({ row }) => {
                return <p>{row.original.summary}</p>;
              },
            },
            {
              id: "supplementaryNetIncome",
              header: () => (
                <p className="text-center">Supplementary Feeding (35%)</p>
              ),
              cell: ({ row }) => {
                const text = isNaN(row.original.supplementaryNetIncome)
                  ? "0"
                  : row.original.supplementaryNetIncome;

                return <p className="text-center">{text}</p>;
              },
            },
            {
              id: "schoolClinicNetIncome",
              header: () => <p className="text-center">School Clinic (5%)</p>,
              cell: ({ row }) => {
                const text = isNaN(row.original.schoolClinicNetIncome)
                  ? "0"
                  : row.original.schoolClinicNetIncome;
                return <p className="text-center">{text}</p>;
              },
            },
            {
              id: "facultyStudentDevelopmentNetIncome",
              header: () => (
                <p className="text-center">
                  Faculty & Student Development Fund (15%)
                </p>
              ),
              cell: ({ row }) => {
                const text = isNaN(
                  row.original.facultyStudentDevelopmentNetIncome
                )
                  ? "0"
                  : row.original.facultyStudentDevelopmentNetIncome;
                return <p className="text-center">{text}</p>;
              },
            },
            {
              id: "heInstructionNetIncome",
              header: () => (
                <p className="text-center">H.E.Instructional (10%)</p>
              ),
              cell: ({ row }) => {
                const text = isNaN(row.original.heInstructionNetIncome)
                  ? "0"
                  : row.original.heInstructionNetIncome;
                return <p className="text-center">{text}</p>;
              },
            },
            {
              id: "schoolOperationNetIncome",
              header: () => (
                <p className="text-center">School Operation/ GP (25%)</p>
              ),
              cell: ({ row }) => {
                const text = isNaN(row.original.schoolOperationNetIncome)
                  ? "0"
                  : row.original.schoolOperationNetIncome;
                return <p className="text-center">{text}</p>;
              },
            },
            {
              id: "revolvingCapitalNetIncome",
              header: () => (
                <p className="text-center">Revolving Canteen Fund (10%)</p>
              ),
              cell: ({ row }) => {
                const text = isNaN(row.original.revolvingCapitalNetIncome)
                  ? "0"
                  : row.original.revolvingCapitalNetIncome;
                return <p className="text-center">{text}</p>;
              },
            },
            {
              id: "totalNetIncome",
              header: () => <p className="text-center">Total</p>,
              cell: ({ row }) => {
                const total = [
                  row.original.supplementaryNetIncome,
                  row.original.schoolClinicNetIncome,
                  row.original.facultyStudentDevelopmentNetIncome,
                  row.original.heInstructionNetIncome,
                  row.original.schoolOperationNetIncome,
                  row.original.revolvingCapitalNetIncome,
                ].reduce((sum, val) => sum + parseFloat(val || 0), 0);

                const totalRounded = total.toFixed(2);
                return (
                  <div>
                    <p>{totalRounded}</p>
                  </div>
                );
              },
            },
          ]}
          data={[
            {
              ...canteenReportPreviousIncome,
              summary: "Total Cash on Bank at the beginning of the month",
            },
            {
              summary: "Plus income for the month",
              supplementaryNetIncome: +(
                form.reduce(
                  (sum, o) => sum + +o.supplementaryExpense.itemCost,
                  0
                ) * 0.35
              ).toFixed(2),
              schoolClinicNetIncome: +(
                form.reduce(
                  (sum, o) => sum + +o.schoolClinicExpense.itemCost,
                  0
                ) * 0.05
              ).toFixed(2),
              facultyStudentDevelopmentNetIncome: +(
                form.reduce(
                  (sum, o) =>
                    sum + +o.facultyStudentDevelopmentFundExpense.itemCost,
                  0
                ) * 0.15
              ).toFixed(2),
              heInstructionNetIncome: +(
                form.reduce(
                  (sum, o) => sum + +o.heInstructionExpense.itemCost,
                  0
                ) * 0.1
              ).toFixed(2),
              schoolOperationNetIncome: +(
                form.reduce(
                  (sum, o) => sum + +o.schoolOperationExpense.itemCost,
                  0
                ) * 0.25
              ).toFixed(2),
              revolvingCapitalNetIncome: +(
                form.reduce(
                  (sum, o) => sum + +o.revolvingCapitalExpense.itemCost,
                  0
                ) * 0.1
              ).toFixed(2),
            },
            {
              summary: "Total cash on bank",
              supplementaryNetIncome: +(
                form.reduce(
                  (sum, o) => sum + +o.supplementaryExpense.itemCost,
                  0
                ) *
                  0.35 +
                +canteenReportPreviousIncome?.supplementaryNetIncome
              ).toFixed(2),
              schoolClinicNetIncome: +(
                form.reduce(
                  (sum, o) => sum + +o.schoolClinicExpense.itemCost,
                  0
                ) *
                  0.05 +
                +canteenReportPreviousIncome?.schoolClinicNetIncome
              ).toFixed(2),
              facultyStudentDevelopmentNetIncome: +(
                form.reduce(
                  (sum, o) =>
                    sum + +o.facultyStudentDevelopmentFundExpense.itemCost,
                  0
                ) *
                  0.15 +
                +canteenReportPreviousIncome?.facultyStudentDevelopmentNetIncome
              ).toFixed(2),
              heInstructionNetIncome: +(
                form.reduce(
                  (sum, o) => sum + +o.heInstructionExpense.itemCost,
                  0
                ) *
                  0.1 +
                +canteenReportPreviousIncome?.heInstructionNetIncome
              ).toFixed(2),
              schoolOperationNetIncome: +(
                form.reduce(
                  (sum, o) => sum + +o.schoolOperationExpense.itemCost,
                  0
                ) *
                  0.25 +
                +canteenReportPreviousIncome?.schoolOperationNetIncome
              ).toFixed(2),
              revolvingCapitalNetIncome: +(
                form.reduce(
                  (sum, o) => sum + +o.revolvingCapitalExpense.itemCost,
                  0
                ) *
                  0.1 +
                +canteenReportPreviousIncome?.revolvingCapitalNetIncome
              ).toFixed(2),
            },
            {
              summary: "Minus total Expenses",
              supplementaryNetIncome: +form
                .reduce((sum, o) => sum + +o.supplementaryExpense.itemCost, 0)
                .toFixed(2),
              schoolClinicNetIncome: +form
                .reduce((sum, o) => sum + +o.schoolClinicExpense.itemCost, 0)
                .toFixed(2),
              facultyStudentDevelopmentNetIncome: +form
                .reduce(
                  (sum, o) =>
                    sum + +o.facultyStudentDevelopmentFundExpense.itemCost,
                  0
                )
                .toFixed(2),
              heInstructionNetIncome: +form
                .reduce((sum, o) => sum + +o.heInstructionExpense.itemCost, 0)
                .toFixed(2),
              schoolOperationNetIncome: +form
                .reduce((sum, o) => sum + +o.schoolOperationExpense.itemCost, 0)
                .toFixed(2),
              revolvingCapitalNetIncome: +form
                .reduce(
                  (sum, o) => sum + +o.revolvingCapitalExpense.itemCost,
                  0
                )
                .toFixed(2),
            },
            {
              summary: "Total Cash Balance on Bank",
              supplementaryNetIncome: +(
                form.reduce(
                  (sum, o) => sum + +o.supplementaryExpense.itemCost,
                  0
                ) *
                  0.35 +
                +canteenReportPreviousIncome?.supplementaryNetIncome -
                +form
                  .reduce((sum, o) => sum + +o.supplementaryExpense.itemCost, 0)
                  .toFixed(2)
              ).toFixed(2),
              schoolClinicNetIncome: +(
                form.reduce(
                  (sum, o) => sum + +o.schoolClinicExpense.itemCost,
                  0
                ) *
                  0.05 +
                +canteenReportPreviousIncome?.schoolClinicNetIncome -
                +form
                  .reduce((sum, o) => sum + +o.schoolClinicExpense.itemCost, 0)
                  .toFixed(2)
              ).toFixed(2),
              facultyStudentDevelopmentNetIncome: +(
                form.reduce(
                  (sum, o) =>
                    sum + +o.facultyStudentDevelopmentFundExpense.itemCost,
                  0
                ) *
                  0.15 +
                +canteenReportPreviousIncome?.facultyStudentDevelopmentNetIncome -
                +form
                  .reduce(
                    (sum, o) =>
                      sum + +o.facultyStudentDevelopmentFundExpense.itemCost,
                    0
                  )
                  .toFixed(2)
              ).toFixed(2),
              heInstructionNetIncome: +(
                form.reduce(
                  (sum, o) => sum + +o.heInstructionExpense.itemCost,
                  0
                ) *
                  0.1 +
                +canteenReportPreviousIncome?.heInstructionNetIncome -
                +form
                  .reduce((sum, o) => sum + +o.heInstructionExpense.itemCost, 0)
                  .toFixed(2)
              ).toFixed(2),
              schoolOperationNetIncome: +(
                form.reduce(
                  (sum, o) => sum + +o.schoolOperationExpense.itemCost,
                  0
                ) *
                  0.25 +
                +canteenReportPreviousIncome?.schoolOperationNetIncome -
                +form
                  .reduce(
                    (sum, o) => sum + +o.schoolOperationExpense.itemCost,
                    0
                  )
                  .toFixed(2)
              ).toFixed(2),
              revolvingCapitalNetIncome: +(
                form.reduce(
                  (sum, o) => sum + +o.revolvingCapitalExpense.itemCost,
                  0
                ) *
                  0.1 +
                +canteenReportPreviousIncome?.revolvingCapitalNetIncome -
                +form
                  .reduce(
                    (sum, o) => sum + +o.revolvingCapitalExpense.itemCost,
                    0
                  )
                  .toFixed(2)
              ).toFixed(2),
            },
          ]}
          isLoading={loadingData}
        />
      </div>
    </main>
  );
}
