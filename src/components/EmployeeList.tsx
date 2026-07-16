import type { Employee } from "../types/employee";
import { EmployeeCard } from "./EmployeeCard";

interface EmployeeListProps {
  employees: Employee[];
  onSelectEmployee: (id: number) => void;
}

export function EmployeeList({
  employees,
  onSelectEmployee,
}: EmployeeListProps) {
  if (employees.length === 0) {
    return (
      <p className="text-center text-gray-500 py-12">No employees found.</p>
    );
  }

  return (
    <ul
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      aria-label="Employee list"
    >
      {employees.map((employee) => (
        <li key={employee.id}>
          <EmployeeCard
            employee={employee}
            onClick={() => onSelectEmployee(employee.id)}
          />
        </li>
      ))}
    </ul>
  );
}
