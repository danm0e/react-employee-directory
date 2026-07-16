// TODO (Session 1): Build the employee detail page here.
//
// By the end of Session 1 this page should:
//   1. Read the employee id from the URL using useParams from react-router-dom
//   2. Use the useEmployee hook (which you'll write in ../hooks/useEmployee)
//      to fetch a single employee
//   3. Handle loading and error states
//   4. Render the employee's full profile (contact details + address)
//   5. Include a "Back to directory" button that navigates back using useNavigate

export function EmployeeDetailPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400 text-sm">
        Employee detail — build me in Session 1
      </p>
    </main>
  );
}
