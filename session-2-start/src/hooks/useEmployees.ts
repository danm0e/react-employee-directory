import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "../services/api";

// queryKey uniquely identifies this query in TanStack Query's cache.
// Any component that calls useEmployees() shares the same cached data.
export function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
  });
}
