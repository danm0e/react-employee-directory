import { useParams, useNavigate } from "react-router-dom";
import { useEmployee } from "../hooks/useEmployee";

export function EmployeeDetailPage() {
  // useParams returns an object whose values are always strings (or undefined).
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: employee, isLoading, isError } = useEmployee(Number(id));

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading employee…</p>
      </main>
    );
  }

  if (isError || !employee) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600">Employee not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-indigo-600 hover:text-indigo-800 mb-3 focus:outline-none focus:underline"
          >
            ← Back to directory
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{employee.name}</h1>
          <p className="text-indigo-600 mt-0.5">{employee.company.name}</p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-4">
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Contact Details
          </h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Email
              </dt>
              <dd className="text-sm text-gray-900 mt-0.5">{employee.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Phone
              </dt>
              <dd className="text-sm text-gray-900 mt-0.5">{employee.phone}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Website
              </dt>
              <dd className="text-sm text-gray-900 mt-0.5">
                {employee.website}
              </dd>
            </div>
          </dl>
        </section>

        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
          <address className="text-sm text-gray-700 not-italic leading-relaxed">
            {employee.address.street}, {employee.address.suite}
            <br />
            {employee.address.city}, {employee.address.zipcode}
          </address>
        </section>
      </div>
    </main>
  );
}
