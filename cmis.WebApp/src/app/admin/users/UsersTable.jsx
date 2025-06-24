"use client";
import { useEffect, useState } from "react";
import { DataTable } from "../../../components/data-table";
import { createColumnHelper } from "@tanstack/react-table";
import AddUserButton from "./AddUserButton";

export default function UsersTable() {
  const [loadState, setLoadState] = useState("");
  const [data, setData] = useState([]);

  const getUsers = async () => {
    setLoadState("fetching users");
    const response = await fetch(`/api/getAllUsers`);
    const data = await response.json();
    if (response.ok) {
      setData(data);
      setLoadState("user fetched successfully");
    } else {
      console.error("Error fetching data:", data.error);
      setLoadState("error fetching users");
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const columnHelper = createColumnHelper();
  const userColumns = [
    columnHelper.accessor("email", {
      header: "Email",
    }),
    columnHelper.accessor("userRole", {
      header: "Role",
      cell: ({ row }) => {
        return <div className="">{row.original.userRole}</div>;
      },
    }),

    columnHelper.accessor("id", {
      header: null,
      cell: ({ row }) => {
        const userId = row.original.id;

        const handleClick = async () => {
          const res = await fetch("/api/removeUser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          });
          const dt = await res.json();
          if (dt.status === 200) {
            getUsers();
          }
        };

        return (
          <div className="flex justify-end mr-4">
            <button
              onClick={handleClick}
              className="border border-red-400 bg-white rounded text-red-400 px-2"
            >
              Remove
            </button>
          </div>
        );
      },
    }),
  ];
  return (
    <>
      <AddUserButton getUsers={getUsers} />
      <DataTable
        columns={userColumns}
        data={data}
        isLoading={loadState !== "error fetching users" && loadState !== "user fetched successfully"
        }
      />
    </>
  );
}
