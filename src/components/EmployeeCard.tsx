import { Link } from "react-router-dom";
import type { Employee } from "../types/employee";

interface EmployeeCardProps {
  employee: Employee;
}

export function EmployeeCard({ employee }: EmployeeCardProps) {
  return (
    <Link
      to={`/employees/${employee.id}`}
      className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <div>
        <h2 className="text-base font-semibold text-gray-900">
          {employee.name}
        </h2>
        <p className="text-sm text-indigo-600 mt-0.5">
          {employee.company.name}
        </p>
      </div>

      <dl className="mt-4 space-y-1">
        <div>
          <dt className="sr-only">Email</dt>
          <dd className="text-sm text-gray-600">{employee.email}</dd>
        </div>
        <div>
          <dt className="sr-only">Phone</dt>
          <dd className="text-sm text-gray-600">{employee.phone}</dd>
        </div>
      </dl>
    </Link>
  );
}
