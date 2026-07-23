// Session 4 homework: implement a GraphQL hook for fetching all employees.
// Install first (if not already done): npm install @apollo/client graphql
//
// Requirements:
//   - Import useQuery from "@apollo/client" (after installing the package)
//   - Import GET_EMPLOYEES from "../graphql/queries"
//   - Define a GetEmployeesData interface: { users: { data: Employee[] } }
//   - Call useQuery<GetEmployeesData>(GET_EMPLOYEES), destructure data, loading, error
//   - Return { data: data?.users.data, isLoading: loading, isError: !!error, error }
//     (same shape as useEmployees so EmployeeListPage only needs one import line changed)
//
// Reference: Session 4 slides — "useEmployeesGQL.ts"

export function useEmployeesGQL() {
  return null;
}
