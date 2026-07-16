import { useQuery } from "@apollo/client";
import { GET_EMPLOYEE } from "../graphql/queries";
import type { Employee } from "../types/employee";

interface GetEmployeeData {
  user: Employee;
}

export function useEmployeeGQL(id: number) {
  const { data, loading, error } = useQuery<GetEmployeeData>(GET_EMPLOYEE, {
    variables: { id: String(id) },
    skip: id <= 0,
  });
  return {
    data: data?.user,
    isLoading: loading,
    isError: !!error,
    error,
  };
}
