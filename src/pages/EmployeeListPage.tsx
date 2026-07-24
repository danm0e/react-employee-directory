import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { employees } from "../mocks"; // Live demo step 4: swap for useEmployees from "../hooks/useEmployees"
import { EmployeeList } from "../components/EmployeeList";

// This page is pre-built and currently uses mock data.
// During Session 2 Hour 1 the trainer will migrate it to live data.
//
// Changes made during the live demo:
//   1. Build src/services/api.ts
//   2. Build src/hooks/useEmployees.ts
//   3. Build src/hooks/useEmployee.ts
//   4. Replace the mock import above with: import { useEmployees } from "../hooks/useEmployees"
//   5. Replace the employees.filter() line with:
//        const { data: employees, isLoading, isError } = useEmployees();
//        const filtered = (employees ?? []).filter(...)
//   6. Add isLoading and isError guards before the return
export function EmployeeListPage() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">
            Employee Directory
          </h1>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6">
          <label htmlFor="search" className="sr-only">
            Search employees
          </label>
          <input
            id="search"
            type="search"
            placeholder="Search by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72 px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <EmployeeList
          employees={filtered}
          onSelectEmployee={(id) => navigate(`/employees/${id}`)}
        />
      </div>
    </main>
  );
}
