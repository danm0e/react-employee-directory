// Session 4 homework: implement a GraphQL hook for fetching a single employee.
// Install first (if not already done): npm install @apollo/client graphql
//
// Requirements:
//   - Import useQuery from "@apollo/client" (after installing the package)
//   - Import GET_EMPLOYEE from "../graphql/queries"
//   - Accept an id: number parameter
//   - Pass variables: { id: String(id) } and skip: id <= 0 to useQuery
//   - Define a GetEmployeeData interface: { user: Employee }
//   - Return { data: data?.user, isLoading: loading, isError: !!error, error }
//     (same shape as useEmployee so EmployeeDetailPage only needs one import line changed)
//
// Reference: Session 4 slides — "useEmployeeGQL.ts"

export function useEmployeeGQL(_id: number) {
  return null;
}
