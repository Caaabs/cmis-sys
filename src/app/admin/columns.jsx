"use client";

import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor("schoolName", {
    header: "School Name",
  }),
  columnHelper.accessor("time", {
    header: "Time",
  }),
  columnHelper.accessor("monthDayYear", {
    header: "Month/Day/Year",
  }),
  columnHelper.accessor("status", {
    header: "Status",
  }),
];
