import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
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
    render(<EmployeeCard employee={mockEmployee} />);
    expect(screen.getByText("Leanne Graham")).toBeInTheDocument();
  });

  it("renders the department (company name)", () => {
    render(<EmployeeCard employee={mockEmployee} />);
    expect(screen.getByText("Romaguera-Crona")).toBeInTheDocument();
  });

  it("renders the email address", () => {
    render(<EmployeeCard employee={mockEmployee} />);
    expect(screen.getByText("sincere@april.biz")).toBeInTheDocument();
  });

  it("renders the phone number", () => {
    render(<EmployeeCard employee={mockEmployee} />);
    expect(screen.getByText("1-770-736-8031 x56442")).toBeInTheDocument();
  });

  it("calls onClick when the card is clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<EmployeeCard employee={mockEmployee} onClick={handleClick} />);

    await user.click(screen.getByRole("article"));

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("does not throw when onClick is not provided", async () => {
    const user = userEvent.setup();
    render(<EmployeeCard employee={mockEmployee} />);

    // Should not throw
    await user.click(screen.getByRole("article"));
  });
});
