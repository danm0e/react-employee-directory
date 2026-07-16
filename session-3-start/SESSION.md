# Session 3 — Testing and Accessibility

## What Was Built in Session 2

- **`AddEmployeeForm` component** — React Hook Form + Zod schema validation
- **`src/schemas/employee.schema.ts`** — Zod schema with rules for name, email, phone, department
- **`AddEmployeePage`** — page wrapper with navigation and the form
- **Accessible form markup** — every input has an associated `<label>`, error messages use `role="alert"` and `aria-describedby`, inputs set `aria-invalid`
- **Route `/employees/new`** added to `App.tsx`
- **"Add Employee" link** in the `EmployeeListPage` header

Run `npm run dev` → you should be able to navigate to `/employees/new`, fill in the form, see validation errors, and submit successfully.

---

## What You'll Build in This Session

### 1. Unit test `EmployeeCard`

Create `src/components/EmployeeCard.test.tsx`. Use React Testing Library (`render`, `screen`) and Vitest (`describe`, `it`, `expect`, `vi`).

Write tests that verify:

- The employee name is rendered
- The department (company name) is rendered
- Email and phone appear in the output
- The `onClick` callback is called when the card is clicked

```bash
npm run test   # runs in watch mode
```

### 2. Unit test `AddEmployeeForm`

Create `src/components/AddEmployeeForm.test.tsx`.

Before each test, stub `globalThis.fetch` using `vi.stubGlobal` so the tests
do not make real network requests.

Write tests that verify:

- All four form fields are rendered
- Submitting an empty form shows validation errors for required fields
- An invalid email shows the "Enter a valid email address" error
- Submitting a valid form calls `onSuccess` and shows the success banner

**Tip:** use `userEvent.setup()` from `@testing-library/user-event` for realistic
user interactions (it handles focus, keyboard events, etc.).

### 3. Set up Playwright

Install the Playwright browser:

```bash
npx playwright install --with-deps chromium
```

Add the E2E test script to `package.json` (it's not there yet — look at the
Playwright docs for the CLI command).

### 4. Write an E2E test

Create `e2e/employee-list.spec.ts`. Write tests that cover:

- The page heading "Employee Directory" is visible
- 10 employee cards load from the network
- Typing "Leanne" in the search box leaves exactly 1 card visible
- Clicking the first card navigates to `/employees/:id`
- Clicking "Back to directory" returns to `/`

### 5. Fix accessibility issues

Run the app and check these common issues:

- Does the search input have a visible or screen-reader label? (`<label>`, `aria-label`, or `sr-only`)
- Does the "Back to directory" button have enough colour contrast?
- Are headings in the correct order (h1 → h2, no skipped levels)?
- Do interactive elements have a visible focus ring? (try tabbing through the page)

Fix any issues you find.

---

## Session 3 Checkpoint Goal

> **Meaningful test coverage on core components, a Playwright E2E test covering the
> happy path, and an accessibility audit passing.**

You're done when:

- `npm run test` → all unit tests pass
- `npm run test:e2e` → Playwright test suite passes
- Tabbing through the app shows a visible focus ring on every interactive element
- No h-level is skipped

---

## Useful References

| Resource                       | URL                                                          |
| ------------------------------ | ------------------------------------------------------------ |
| React Testing Library          | https://testing-library.com/docs/react-testing-library/intro |
| Vitest `vi.stubGlobal`         | https://vitest.dev/api/vi.html#vi-stubglobal                 |
| `@testing-library/user-event`  | https://testing-library.com/docs/user-event/intro            |
| Playwright docs                | https://playwright.dev/docs/writing-tests                    |
| WebAIM colour contrast checker | https://webaim.org/resources/contrastchecker                 |
