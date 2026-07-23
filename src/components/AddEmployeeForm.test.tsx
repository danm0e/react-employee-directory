// Session 3 homework: write unit tests for AddEmployeeForm.
//
// Imports you will need:
//   import { render, screen, waitFor } from "@testing-library/react"
//   import userEvent from "@testing-library/user-event"
//   import { AddEmployeeForm } from "./AddEmployeeForm"
//
// describe, it, expect, vi, and beforeEach are available as globals — no import needed.
//
// Stub fetch before each test so no real network requests are made:
//   beforeEach(() => {
//     vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ id: 11 }) }));
//   });
//
// Tests to write:
//   1. All four form fields are rendered
//   2. Submitting an empty form shows validation errors for required fields
//   3. An invalid email shows the "Enter a valid email address" error
//   4. Submitting a valid form shows the success banner
//   5. Submitting a valid form calls onSuccess
//
// Reference: Session 3 slides — "Mocks — vi.fn() and vi.stubGlobal"
//            Session 3 slides — "Async Patterns — findBy and waitFor"

export {};
