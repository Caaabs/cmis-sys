"use client";

import { createColumnHelper } from "@tanstack/react-table";
import React from "react";

const columnHelper = createColumnHelper();

const renderExpenseCell = (expense) => {
  if (!expense) return null;

  return (
    <div className="flex flex-row gap-2">
      <div className="w-full">
        <p className="text-center">Itemized Desc</p>
        <p className="bg-gray-100 px-4 rounded shadow text-xs">
          {expense.itemDescription}
        </p>
      </div>
      <div className="flex flex-col justify-end">
        <p className="text-end">Cost</p>
        <input
          type="number"
          value={expense.itemCost}
          readOnly
          disabled
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

export const columns = [
  columnHelper.accessor((row) => row.supplementaryExpense, {
    id: "supplementaryExpense",
    header: () => <p className="text-center">Supplementary Feeding (35%)</p>,
    cell: (info) => renderExpenseCell(info.getValue()),
    footer: (info) => renderFooter(info, "supplementaryExpense"),
  }),
  columnHelper.accessor((row) => row.schoolClinicExpense, {
    id: "schoolClinicExpense",
    header: () => <p className="text-center">School Clinic (5%)</p>,
    cell: (info) => renderExpenseCell(info.getValue()),
    footer: (info) => renderFooter(info, "schoolClinicExpense"),
  }),
  columnHelper.accessor((row) => row.facultyStudentDevelopmentFundExpense, {
    id: "facultyStudentDevelopmentFundExpense",
    header: () => (
      <p className="text-center">
        Faculty & Student Development Fund (15%)
      </p>
    ),
    cell: (info) => renderExpenseCell(info.getValue()),
    footer: (info) =>
      renderFooter(info, "facultyStudentDevelopmentFundExpense"),
  }),
  columnHelper.accessor((row) => row.heInstructionExpense, {
    id: "heInstructionExpense",
    header: () => <p className="text-center">H.E. Instructional (10%)</p>,
    cell: (info) => renderExpenseCell(info.getValue()),
    footer: (info) => renderFooter(info, "heInstructionExpense"),
  }),
  columnHelper.accessor((row) => row.schoolOperationExpense, {
    id: "schoolOperationExpense",
    header: () => <p className="text-center">School Operation/GP (25%)</p>,
    cell: (info) => renderExpenseCell(info.getValue()),
    footer: (info) => renderFooter(info, "schoolOperationExpense"),
  }),
  columnHelper.accessor((row) => row.revolvingCapitalExpense, {
    id: "revolvingCapitalExpense",
    header: () => <p className="text-center">Revolving Capital (10%)</p>,
    cell: (info) => renderExpenseCell(info.getValue()),
    footer: (info) => renderFooter(info, "revolvingCapitalExpense"),
  }),
];
