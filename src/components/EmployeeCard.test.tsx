import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { EmployeeCard } from "./EmployeeCard";
import type { Employee } from "../types/employee";

const mockEmployee: Employee = {
  id: 1,
  name: "Leanne Graham",
  email: "sincere@april.biz",
  phone: "1-770-736-8031 x56442",
  website: "hildegard.org",
  company: { name: "Romaguera-Crona" },
  address: {
    street: "Kulas Light",
    suite: "Apt. 556",
    city: "Gwenborough",
    zipcode: "92998-3874",
  },
};

describe("EmployeeCard", () => {
  it("renders the employee name", () => {
    render(
      <MemoryRouter>
        <EmployeeCard employee={mockEmployee} />
      </MemoryRouter>,
    );
    expect(screen.getByText("Leanne Graham")).toBeInTheDocument();
  });

  it("renders the department (company name)", () => {
    render(
      <MemoryRouter>
        <EmployeeCard employee={mockEmployee} />
      </MemoryRouter>,
    );
    expect(screen.getByText("Romaguera-Crona")).toBeInTheDocument();
  });

  it("renders the email address", () => {
    render(
      <MemoryRouter>
        <EmployeeCard employee={mockEmployee} />
      </MemoryRouter>,
    );
    expect(screen.getByText("sincere@april.biz")).toBeInTheDocument();
  });

  it("renders the phone number", () => {
    render(
      <MemoryRouter>
        <EmployeeCard employee={mockEmployee} />
      </MemoryRouter>,
    );
    expect(screen.getByText("1-770-736-8031 x56442")).toBeInTheDocument();
  });

  it("renders a link to the employee detail page", () => {
    render(
      <MemoryRouter>
        <EmployeeCard employee={mockEmployee} />
      </MemoryRouter>,
    );
    expect(screen.getByRole("link")).toHaveAttribute("href", "/employees/1");
  });

  it("navigates on click without throwing", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <EmployeeCard employee={mockEmployee} />
      </MemoryRouter>,
    );
    await user.click(screen.getByRole("link"));
  });
});
