import { useState } from "react";
import { employees } from "../mocks";

// This page is pre-built — your Session 1 homework is EmployeeCard (and EmployeeList as a stretch goal).
// Once EmployeeCard accepts an employee prop, replace the placeholder <li> with your component.
// In Session 2 this page will be updated to fetch live data via TanStack Query.
export function EmployeeListPage() {
  const [search, setSearch] = useState("");

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

        <ul>
          {filtered.map((employee) => (
            // TODO: Replace with <EmployeeCard employee={employee} /> once built.
            <li key={employee.id}>{employee.name}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}
