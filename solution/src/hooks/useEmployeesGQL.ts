import { useQuery } from "@apollo/client";
import { GET_EMPLOYEES } from "../graphql/queries";
import type { Employee } from "../types/employee";

// The response shape from GraphQLZero nests the array inside `users.data`.
interface GetEmployeesData {
  users: {
    data: Employee[];
  };
}

// The return shape deliberately matches the TanStack hook so page components
// needed no changes when the data layer was swapped.
export function useEmployeesGQL() {
  const { data, loading, error } = useQuery<GetEmployeesData>(GET_EMPLOYEES);
  return {
    data: data?.users.data,
    isLoading: loading,
    isError: !!error,
    error,
  };
}
