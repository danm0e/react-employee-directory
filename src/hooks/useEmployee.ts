// Session 2 live demo: build the TanStack Query hook for a single employee.
//
// Requirements:
//   - Import useQuery from "@tanstack/react-query"
//   - Import getEmployee from "../services/api"
//   - Accept an id: number parameter
//   - Return useQuery({ queryKey: ["employee", id], queryFn: () => getEmployee(id), enabled: id > 0 })
//
// Reference: Session 2 slides — "useQuery — The Core API"

export function useEmployee(_id: number) {
  return null;
}
