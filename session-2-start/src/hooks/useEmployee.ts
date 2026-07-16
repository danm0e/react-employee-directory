import { useQuery } from "@tanstack/react-query";
import { getEmployee } from "../services/api";

// enabled: false when id is falsy prevents the query from running before the
// URL param is available.
export function useEmployee(id: number) {
  return useQuery({
    queryKey: ["employee", id],
    queryFn: () => getEmployee(id),
    enabled: id > 0,
  });
}
