import { useQuery } from "@tanstack/react-query";
import { getEmployee } from "../services/api";

export function useEmployee(id: number) {
  return useQuery({
    queryKey: ["employee", id],
    queryFn: () => getEmployee(id),
    enabled: id > 0,
  });
}
