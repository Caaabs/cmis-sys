"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";

export default function ReportDetails() {
  const router = useRouter();
  const pathname = usePathname();
  const reportId = pathname.split("/")[2];
  const [data, setData] = useState([]);
  const [loadingData, setLoadData] = useState(true);
  const [status, setStatus] = useState("");
  const [canteenReportPreviousIncome, setCanteenReportPreviousIncome] =
    useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportDate, setReportDate] = useState(null);
  const initSubmitForm = [
    {
      supplementaryExpense: {
        itemDescription: "",
        itemCost: 0,
      },
      schoolClinicExpense: {
        itemDescription: "",
        itemCost: 0,
      },
      facultyStudentDevelopmentFundExpense: {
        itemDescription: "",
        itemCost: 0,
      },
      heInstructionExpense: {
        itemDescription: "",
        itemCost: 0,
      },
      schoolOperationExpense: {
        itemDescription: "",
        itemCost: 0,
      },
      revolvingCapitalExpense: {
        itemDescription: "",
        itemCost: 0,
      },
    },
  ];

  const handleSubmit = async () => {
    const currentNetIncome = {
      supplementaryNetIncome: +(
        form.reduce((sum, o) => sum + +o.supplementaryExpense.itemCost, 0) *
        0.35
      ).toFixed(2),
      schoolClinicNetIncome: +(
        form.reduce((sum, o) => sum + +o.schoolClinicExpense.itemCost, 0) * 0.05
      ).toFixed(2),
      facultyStudentDevelopmentNetIncome: +(
        form.reduce(
          (sum, o) => sum + +o.facultyStudentDevelopmentFundExpense.itemCost,
          0
        ) * 0.15
      ).toFixed(2),
      heInstructionNetIncome: +(
        form.reduce((sum, o) => sum + +o.heInstructionExpense.itemCost, 0) * 0.1
      ).toFixed(2),
      schoolOperationNetIncome: +(
        form.reduce((sum, o) => sum + +o.schoolOperationExpense.itemCost, 0) *
        0.25
      ).toFixed(2),
      revolvingCapitalNetIncome: +(
        form.reduce((sum, o) => sum + +o.revolvingCapitalExpense.itemCost, 0) *
        0.1
      ).toFixed(2),
    };
    const total = [
      currentNetIncome.supplementaryNetIncome,
      currentNetIncome.schoolClinicNetIncome,
      currentNetIncome.facultyStudentDevelopmentNetIncome,
      currentNetIncome.heInstructionNetIncome,
      currentNetIncome.schoolOperationNetIncome,
      currentNetIncome.revolvingCapitalNetIncome,
    ].reduce((sum, val) => sum + parseFloat(val || 0), 0);

    const totalRounded = total.toFixed(2);

    function transformFormData(dataArray) {
      const transformed = {};

      const categories = Object.keys(dataArray[0]);
      for (const category of categories) {
        transformed[category] = {
          expenses: [],
          totalCost: 0,
        };
      }

      for (const entry of dataArray) {
        for (const category of categories) {
          const expense = entry[category];

          if (!expense.itemDescription.trim() && expense.itemCost === 0) {
            continue;
          }

          transformed[category].expenses.push(expense);
          transformed[category].totalCost += expense.itemCost;
        }
      }

      return transformed;
    }

    const submitForm = transformFormData(form);

    const toSubmit = {
      reportId: reportId,
      canteenReportPreviousNetIncome: canteenReportPreviousIncome,
      canteenReportCurrentNetIncome: {
        ...currentNetIncome,
        totalNetIncome: parseFloat(totalRounded),
      },
      ...submitForm,
    };

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/submitCanteenReport", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(toSubmit),
      });

      const result = await res.json();

      if (res.ok) {
        if (result.submitted) {
          fetchRecord();
          alert("Report submitted successfully!");
          setIsSubmitting(false);
        }
      } else {
        console.error("Failed to submit report:", result.error);
        alert(result.error || "Failed to submit report");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Error submitting report:", err);
      alert("An error occurred while submitting the report.");
      setIsSubmitting(false);
    }
  };
  const fetchRecord = async () => {
    setLoadData(true);
    const res = await fetch(`/api/getReportDetails?reportId=${reportId}`);
    const data = await res.json();
    if (res.ok) {
      const year = data.year ?? dayjs(data.date).year();
      const month = data.month ?? dayjs(data.date).month() + 1;
      const prev = dayjs(
        `${year}-${String(month).padStart(2, "0")}-01`
      ).subtract(1, "month");
      const prevYear = prev.year();
      const prevMonth = prev.month() + 1;

      const getReports = await fetch(`/api/getReports`);
      const reportsData = await getReports.json();

      const previousData = reportsData.filter((dt) => {
        return Number(dt.year) === prevYear && Number(dt.month) === prevMonth;
      });

      if (previousData.length > 0) {
        const prevRepDetails = await fetch(
          `/api/getReportDetails?reportId=${previousData[0].id}`
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
      if (data.reportStatus === "DRAFT") {
        setData(initSubmitForm);
        setReportDate(dayjs(`${data.date}-01`).format("MMMM YYYY"));
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
  const [form, setForm] = useState(initSubmitForm);
  const handleUpdateForm = (rowIndex, expenseType, field, value) => {
    setForm((prevData) => {
      const updatedData = [...prevData];
      updatedData[rowIndex] = {
        ...updatedData[rowIndex],
        [expenseType]: {
          ...updatedData[rowIndex][expenseType],
          [field]: value,
        },
      };
      return updatedData;
    });
  };

  const columnHelper = createColumnHelper();

  const renderExpenseCell = (expense, rowIndex, expenseType) => {
    if (!expense) return null;
    const handleBlur = (field) => (e) => {
      const value =
        field === "itemCost" ? parseFloat(e.target.value) || 0 : e.target.value;
      handleUpdateForm(rowIndex, expenseType, field, value);
    };
    return (
      <div className="flex flex-row gap-2">
        <div className="w-full">
          <p className="text-center">Itemized Desc</p>
          <input
            type="text"
            defaultValue={expense.itemDescription}
            onChange={handleBlur("itemDescription")}
            className="text-xs text-right border border-gray-300 rounded px-1"
          />
        </div>
        <div className="flex flex-col justify-end">
          <p className="text-end">Cost</p>
          <input
            type="number"
            defaultValue={expense.itemCost}
            onChange={handleBlur("itemCost")}
            className="text-xs text-right border border-gray-300 rounded px-1"
          />
        </div>
      </div>
    );
  };

  const renderFooter = (info, key) => {
    const total = info.table.getRowModel().rows.reduce((acc, row) => {
      return acc + (parseFloat(row.original[key]?.itemCost) || 0);
    }, 0);

    return (
      <div className="text-end font-semibold text-base mt-2">
        <p>Total: ₱{total.toFixed(2)}</p>
      </div>
    );
  };

  const toSubmitColumns = useMemo(
    () => [
      columnHelper.accessor((row) => row.supplementaryExpense, {
        id: "supplementaryExpense",
        header: () => (
          <p className="text-center">Supplementary Feeding (35%)</p>
        ),
        cell: ({ row, column }) =>
          renderExpenseCell(row.original[column.id], row.index, column.id),
        footer: (info) => renderFooter(info, "supplementaryExpense"),
      }),
      columnHelper.accessor((row) => row.schoolClinicExpense, {
        id: "schoolClinicExpense",
        header: () => <p className="text-center">School Clinic (5%)</p>,
        cell: ({ row, column }) =>
          renderExpenseCell(row.original[column.id], row.index, column.id),
        footer: (info) => renderFooter(info, "schoolClinicExpense"),
      }),
      columnHelper.accessor((row) => row.facultyStudentDevelopmentFundExpense, {
        id: "facultyStudentDevelopmentFundExpense",
        header: () => (
          <p className="text-center">
            Faculty & Student Development Fund (15%)
          </p>
        ),
        cell: ({ row, column }) =>
          renderExpenseCell(row.original[column.id], row.index, column.id),
        footer: (info) =>
          renderFooter(info, "facultyStudentDevelopmentFundExpense"),
      }),
      columnHelper.accessor((row) => row.heInstructionExpense, {
        id: "heInstructionExpense",
        header: () => <p className="text-center">H.E. Instructional (10%)</p>,
        cell: ({ row, column }) =>
          renderExpenseCell(row.original[column.id], row.index, column.id),
        footer: (info) => renderFooter(info, "heInstructionExpense"),
      }),
      columnHelper.accessor((row) => row.schoolOperationExpense, {
        id: "schoolOperationExpense",
        header: () => <p className="text-center">School Operation/GP (25%)</p>,
        cell: ({ row, column }) =>
          renderExpenseCell(row.original[column.id], row.index, column.id),
        footer: (info) => renderFooter(info, "schoolOperationExpense"),
      }),
      columnHelper.accessor((row) => row.revolvingCapitalExpense, {
        id: "revolvingCapitalExpense",
        header: () => <p className="text-center">Revolving Capital (10%)</p>,
        cell: ({ row, column }) =>
          renderExpenseCell(row.original[column.id], row.index, column.id),
        footer: (info) => renderFooter(info, "revolvingCapitalExpense"),
      }),
      {
        id: "rowIndex",
        header: null,
        cell: ({ row }) => {
          const status = row.index;
          const handleRemove = (index) => {
            const newData = data.filter((_, i) => i !== index);
            setData(newData);
            const newForm = form.filter((_, i) => i !== index);
            setForm(newForm);
          };
          return (
            status > 0 && (
              <div className="flex justify-end">
                <button
                  onClick={() => handleRemove(status)}
                  className="border border-red-400 bg-white rounded text-red-400 px-2"
                >
                  Remove
                </button>
              </div>
            )
          );
        },
      },
    ],
    [data]
  );

  const handleAddRow = () => {
    setData((prevData) => [...prevData, initSubmitForm[0]]);
    setForm((prevData) => [...prevData, initSubmitForm[0]]);
  };

  return (
    <main className="p-2 ">
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

      {status === "DRAFT" && (
        <button
          className={`mb-2 border rounded px-2 py-1 text-white ${
            isSubmitting ? "bg-gray-400" : "bg-blue-600"
          }`}
          onClick={handleAddRow}
          disabled={isSubmitting}
        >
          + Add Row
        </button>
      )}

      <DataTable
        columns={status === "DRAFT" ? toSubmitColumns : columns}
        data={status === "DRAFT" ? form : data}
        isLoading={loadingData}
      />

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

      {status === "DRAFT" && (
        <div className="flex justify-end mt-2">
          <button
            className={`border rounded px-2 py-1 text-white ${
              isSubmitting ? "bg-gray-400" : "bg-green-600"
            }`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      )}
    </main>
  );
}
