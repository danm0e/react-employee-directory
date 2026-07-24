import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { employees } from "../mocks";
import { EmployeeList } from "../components/EmployeeList";

// This page is pre-built. During Session 2 Hour 1 the trainer will migrate it
// to use TanStack Query and live data — follow along in the session.
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
