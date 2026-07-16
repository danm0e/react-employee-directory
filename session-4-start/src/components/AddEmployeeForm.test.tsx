import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AddEmployeeForm } from "./AddEmployeeForm";

// Stub fetch before each test so no real network requests are made.
beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 11, name: "Test User" }),
    }),
  );
});

describe("AddEmployeeForm", () => {
  it("renders all four form fields", () => {
    render(<AddEmployeeForm />);
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/department/i)).toBeInTheDocument();
  });

  it("shows validation errors when submitted empty", async () => {
    const user = userEvent.setup();
    render(<AddEmployeeForm />);

    await user.click(screen.getByRole("button", { name: /add employee/i }));

    expect(
      await screen.findByText("Full name is required"),
    ).toBeInTheDocument();
    expect(await screen.findByText("Email is required")).toBeInTheDocument();
    expect(
      await screen.findByText("Department is required"),
    ).toBeInTheDocument();
  });

  it("shows an error for an invalid email address", async () => {
    const user = userEvent.setup();
    render(<AddEmployeeForm />);

    await user.type(screen.getByLabelText(/email/i), "not-an-email");
    await user.click(screen.getByRole("button", { name: /add employee/i }));

    expect(
      await screen.findByText("Enter a valid email address"),
    ).toBeInTheDocument();
  });

  it("submits successfully with valid data and calls onSuccess", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    render(<AddEmployeeForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText(/full name/i), "Jane Doe");
    await user.type(screen.getByLabelText(/email/i), "jane@example.com");
    await user.type(screen.getByLabelText(/department/i), "Engineering");
    await user.click(screen.getByRole("button", { name: /add employee/i }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalledOnce());
  });

  it("shows a success message after a successful submission", async () => {
    const user = userEvent.setup();
    render(<AddEmployeeForm />);

    await user.type(screen.getByLabelText(/full name/i), "Jane Doe");
    await user.type(screen.getByLabelText(/email/i), "jane@example.com");
    await user.type(screen.getByLabelText(/department/i), "Engineering");
    await user.click(screen.getByRole("button", { name: /add employee/i }));

    expect(
      await screen.findByText("Employee added successfully."),
    ).toBeInTheDocument();
  });
});
