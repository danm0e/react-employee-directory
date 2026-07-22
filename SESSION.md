# Session 2 — Forms and Validation

## What Was Built in Session 1

- **`Employee` type** — `src/types/employee.ts` defines the interface used throughout the app
- **Service layer** — `src/services/api.ts` wraps `fetch` calls to JSONPlaceholder
- **TanStack Query hooks** — `useEmployees` and `useEmployee` handle caching and state
- **`EmployeeCard` component** — styled card with name, company name, email, phone
- **`EmployeeList` component** — responsive grid of cards with an empty-state message
- **`EmployeeListPage`** — real data, client-side search, navigates to detail on click
- **`EmployeeDetailPage`** — reads `:id` from the URL, renders full profile, back navigation
- **Storybook story** — `EmployeeCard` stories with `Default` and `WithClickHandler`

Run `npm run dev` → you should see 10 employee cards and be able to click through to a detail page.
Run `npm run storybook` → `EmployeeCard` should appear in the sidebar.

---

## What You'll Build in This Session

### 1. Define the Zod validation schema

Create `src/schemas/employee.schema.ts`. Use `z.object({})` to define rules for:

- `name` — required string
- `email` — required, must be a valid email address
- `phone` — optional; if provided, should match a basic phone pattern
- `department` — required string

Export both the schema and the inferred TypeScript type:

```ts
export const employeeFormSchema = z.object({ ... });
export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
```

### 2. Build the `AddEmployeeForm` component

Create `src/components/AddEmployeeForm.tsx`. Use `useForm` from `react-hook-form`
with `zodResolver` to connect your schema.

The form should:

- Have labelled inputs for name, email, phone, department
- Show inline validation error messages beneath each field
- Display a success banner after a successful submission
- Disable the submit button while submitting

**Accessibility requirements:**

- Every `<input>` must have an associated `<label>` (use `htmlFor` / `id`)
- Error messages must use `role="alert"` so screen readers announce them
- Inputs must set `aria-invalid` and `aria-describedby` when in an error state

### 3. Simulate the API call

In the form's submit handler, `POST` the data to
`https://jsonplaceholder.typicode.com/users`.  
JSONPlaceholder always returns `{ id: 11, ...yourData }` — it doesn't actually
persist anything, but the response shape lets you confirm the round-trip works.

### 4. Add a route and navigation link

Create `src/pages/AddEmployeePage.tsx` — a simple page wrapper that renders
`<AddEmployeeForm>` with a heading and a back button.

In `src/App.tsx`, add a route: `<Route path="/employees/new" element={<AddEmployeePage />} />`.

In `EmployeeListPage`, add an **"Add Employee"** button in the header that navigates
to `/employees/new`.

### 5. Handle loading and error states

Review every page — wherever you call a hook that can be loading or error,
make sure you render a clear message instead of a blank screen or a crash.

---

## Session 2 Checkpoint Goal

> **The full employee list and detail pages working with live data, plus a validated
> Add Employee form that submits and shows a success message.**

You're done when:

- Submitting the form with empty fields shows validation errors next to each field
- Submitting a valid form makes a network request (visible in DevTools) and shows the success banner
- TypeScript is happy (`npm run build`)

---

## Useful References

| Resource                     | URL                                                                                         |
| ---------------------------- | ------------------------------------------------------------------------------------------- |
| React Hook Form `useForm`    | https://react-hook-form.com/docs/useform                                                    |
| Zod schema docs              | https://zod.dev                                                                             |
| `@hookform/resolvers`        | https://github.com/react-hook-form/resolvers                                                |
| MDN: ARIA `aria-describedby` | https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby |
