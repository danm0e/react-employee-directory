import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "../services/api";

export function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
  });
}
