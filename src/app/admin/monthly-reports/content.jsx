"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

export const MonthlyReport = () => {
    const router = useRouter();
  const [allReports, setAllReports] = useState([]);
  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [emails, setEmails] = useState([]);
  const [filters, setFilters] = useState({
    selectedYear: "",
    selectedMonth: "",
    selectedStatus: "",
    selectedEmail: "", 
  });
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllUsers = async () => {
    const response = await fetch(`/api/getAllUsers`);
    const data = await response.json();

    if (response.ok) {
      const users = data.filter((user) => user.userRole === "employee");
      getReports(users);
    } else {
      console.error("Error fetching users:", data.error);
    }
  };

  const getReports = async (users) => {
    try {
      const responses = await Promise.all(
        users.map((user) => fetch(`/api/getReports?userId=${user.id}`))
      );

      const results = await Promise.all(responses.map((res) => res.json()));

      const all = results
        .map((reports, i) => {
          if (!responses[i].ok) return [];

          const user = users[i];
          return reports.map((report) => ({
            ...report,
            email: user.email,
          }));
        })
        .flat();

      setAllReports(all);

      const yearSet = new Set(all.map((r) => r.year));
      const monthSet = new Set(all.map((r) => r.month));
      const statusSet = new Set(all.map((r) => r.status));
      const emailSet = new Set(all.map((r) => r.email));

      setYears(Array.from(yearSet).sort((a, b) => b - a)); 
      setMonths(Array.from(monthSet).sort((a, b) => a - b)); 
      setStatuses(Array.from(statusSet)); 
      setEmails(Array.from(emailSet)); 


      filterReports(all);
      setLoading(false); 
    } catch (error) {
      console.error("Unexpected error:", error);
      setLoading(false); 
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const filterReports = (reports) => {
    let filtered = reports;

    if (filters.selectedYear) {
      filtered = filtered.filter(
        (r) => r.year === Number(filters.selectedYear)
      );
    }

    if (filters.selectedMonth) {
      filtered = filtered.filter(
        (r) => r.month === Number(filters.selectedMonth)
      );
    }

    if (filters.selectedStatus) {
      filtered = filtered.filter((r) => r.status === filters.selectedStatus);
    }

    if (filters.selectedEmail) {
      filtered = filtered.filter((r) => r.email === filters.selectedEmail);
    }

    setFilteredReports(filtered);
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    filterReports(allReports);
  }, [filters, allReports]); // Now depend on the filters object

  return (
    <div className="flex flex-col gap-4">
        <p>Filters:</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 sm:items-center">

        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          <select
            id="yearSelect"
            name="selectedYear"
            className="border p-2 rounded-md w-full"
            value={filters.selectedYear}
            onChange={handleFilterChange}
            disabled={loading}
          >
            <option value="">
              -- {loading ? "Loading..." : "Select Year"} --
            </option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          <select
            id="statusSelect"
            name="selectedStatus"
            className="border p-2 rounded-md w-full"
            value={filters.selectedStatus}
            onChange={handleFilterChange}
            disabled={loading}
          >
            <option value="">
              -- {loading ? "Loading..." : "Select Report Status"} --
            </option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          <select
            id="monthSelect"
            name="selectedMonth"
            className="border p-2 rounded-md w-full"
            value={filters.selectedMonth}
            onChange={handleFilterChange}
            disabled={loading}
          >
            <option value="">
              -- {loading ? "Loading..." : "Select Month"} --
            </option>
            {months.map((month) => (
              <option key={month} value={month}>
                {dayjs()
                  .month(month - 1)
                  .format("MMMM")}
              </option>
            ))}
          </select>
        </div>
 
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          <select
            id="emailSelect"
            name="selectedEmail"
            className="border p-2 rounded-md w-full"
            value={filters.selectedEmail}
            onChange={handleFilterChange}
            disabled={loading}
          >
            <option value="">
              -- {loading ? "Loading..." : "Select Email"} --
            </option>
            {emails.map((email) => (
              <option key={email} value={email}>
                {email}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-muted/50 rounded-xl p-4">
        {loading ? (
          <p className="text-muted-foreground">Loading reports...</p>
        ) : filteredReports.length > 0 ? (
          <ul className="space-y-2">
            {filteredReports.map((report) => (
              <li
                key={report.id}
                className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                role="button"
                disabled={report.status === 'DRAFT'}
                onClick={() => {
                  router.push(`/admin/monthly-reports/${report.id}?userId=${report.userId}`);
                }}
              >
                <strong>Email: </strong>
                {report.email.slice(0, report.email.indexOf("@"))}
                <br />
                <strong>Status: </strong> {report.status}
                <br />
                <strong>Report for: </strong>
                {dayjs(`${report.year}-${report.month}-01`).format("MMMM YYYY")}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">
            No reports found for the selected filters.
          </p>
        )}
      </div>
    </div>
  );
};
