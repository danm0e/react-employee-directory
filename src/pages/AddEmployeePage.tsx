import { useNavigate } from "react-router-dom";
import { AddEmployeeForm } from "../components/AddEmployeeForm";
import type { EmployeeFormValues } from "../schemas/employee.schema";

export function AddEmployeePage() {
  const navigate = useNavigate();

  function handleSuccess(_data: EmployeeFormValues) {
    // Brief delay so the success message is visible before navigating away.
    setTimeout(() => navigate("/"), 1500);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-indigo-600 hover:text-indigo-800 mb-3 focus:outline-none focus:underline"
          >
            ← Back to directory
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Add Employee</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-6 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <AddEmployeeForm onSuccess={handleSuccess} />
        </div>
      </div>
    </main>
  );
}
