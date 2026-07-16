import type { Employee } from "../types/employee";

const BASE_URL = "https://jsonplaceholder.typicode.com";

export async function getEmployees(): Promise<Employee[]> {
  const response = await fetch(`${BASE_URL}/users`);
  if (!response.ok) {
    throw new Error(`Failed to fetch employees: ${response.statusText}`);
  }
  return response.json() as Promise<Employee[]>;
}

export async function getEmployee(id: number): Promise<Employee> {
  const response = await fetch(`${BASE_URL}/users/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch employee: ${response.statusText}`);
  }
  return response.json() as Promise<Employee>;
}
