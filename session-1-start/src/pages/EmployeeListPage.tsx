// TODO (Session 1): Build the employee list page here.
//
// By the end of Session 1 this page should:
//   1. Import the Employee type from ../types/employee
//   2. Use the useEmployees hook (which you'll write in ../hooks/useEmployees)
//      to fetch data from the JSONPlaceholder API
//   3. Handle loading and error states
//   4. Render an EmployeeList component with the fetched employees
//   5. Include a search input that filters the list by employee name

export function EmployeeListPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400 text-sm">
        Employee list — build me in Session 1
      </p>
    </main>
  );
}
