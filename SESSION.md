# Session 1 — Components, Props, and Data Fetching

## What Was Set Up Before This Session

The project is fully scaffolded so you can start building features straight away:

- **Vite + React + TypeScript** (strict mode) — `npm run dev` starts the dev server
- **Tailwind CSS v3** — utility classes are available immediately
- **Storybook v8** — `npm run storybook` opens the component explorer
- **React Router v6** — already wired in `App.tsx` with placeholder routes
- **TanStack Query v5** — `QueryClientProvider` is set up in `App.tsx`; you just need to write hooks that use `useQuery`
- **Vitest + React Testing Library** — `npm run test` runs unit tests
- **Folder structure** — `src/components/`, `src/hooks/`, `src/pages/`, `src/services/`, `src/types/`

> **Nothing feature-specific exists yet.** Both page components are placeholders.

---

## What You'll Build in This Session

Work through these steps in order. Each step produces something visible or runnable.

### 1. Define the `Employee` type

Create `src/types/employee.ts` and export an `Employee` interface that matches the
shape returned by `https://jsonplaceholder.typicode.com/users`:

```ts
// Fields you need:
// id, name, email, phone, website
// company: { name }
// address: { street, suite, city, zipcode }
```

### 2. Write the data-fetching service

Create `src/services/api.ts` with two functions:

- `getEmployees(): Promise<Employee[]>` — fetches `GET /users`
- `getEmployee(id: number): Promise<Employee>` — fetches `GET /users/:id`

Both should throw an `Error` if the response is not `ok`.

### 3. Write TanStack Query hooks

Create `src/hooks/useEmployees.ts` and `src/hooks/useEmployee.ts`.
Each hook calls `useQuery` from `@tanstack/react-query` and delegates the actual
fetch to the service functions you just wrote.

**Why separate service and hook?** The service can be unit-tested without React.
The hook is only responsible for caching and state management.

### 4. Build the `EmployeeCard` component

Create `src/components/EmployeeCard.tsx`. The card should:

- Accept an `employee: Employee` prop and an optional `onClick?: () => void` prop
- Display: name, company name (department), email, phone
- Use a `<article>` element for semantics
- Be styled with Tailwind (white card, subtle border, hover shadow)

### 5. Build the `EmployeeList` component

Create `src/components/EmployeeList.tsx`. It should:

- Accept `employees: Employee[]` and `onSelectEmployee: (id: number) => void`
- Render a responsive CSS grid of `EmployeeCard` components
- Show a "No employees found" message when the array is empty

### 6. Wire everything into `EmployeeListPage`

Replace the placeholder in `src/pages/EmployeeListPage.tsx`:

- Call `useEmployees()` and handle `isLoading` / `isError`
- Add a search `<input>` that filters by name client-side
- Render `<EmployeeList>` passing filtered results and a navigate handler

### 7. Build the `EmployeeDetailPage`

Replace the placeholder in `src/pages/EmployeeDetailPage.tsx`:

- Read `id` from URL params with `useParams`
- Call `useEmployee(Number(id))` and handle loading/error
- Render contact details and address in a clean layout
- Add a "← Back to directory" button using `useNavigate`

### 8. Write a Storybook story

Create `src/components/EmployeeCard.stories.tsx` with at least two stories:

- `Default` — a card with sample employee data
- `WithClickHandler` — the same card with an `onClick` handler

---

## Session 1 Checkpoint Goal

> **A styled, typed `EmployeeCard` component rendering real data from the JSONPlaceholder API,
> documented in Storybook.**

You're done when:

- `npm run dev` → the list page shows 10 employee cards with real names and emails
- Clicking a card navigates to `/employees/:id` and shows that employee's full profile
- `npm run storybook` → `EmployeeCard` appears in the sidebar with working controls
- The TypeScript compiler is happy (`npm run build` completes without errors)

---

## Useful References

| Resource                        | URL                                                                       |
| ------------------------------- | ------------------------------------------------------------------------- |
| JSONPlaceholder users endpoint  | https://jsonplaceholder.typicode.com/users                                |
| TanStack Query `useQuery` docs  | https://tanstack.com/query/latest/docs/framework/react/reference/useQuery |
| React Router `useParams`        | https://reactrouter.com/en/main/hooks/use-params                          |
| Tailwind CSS docs               | https://tailwindcss.com/docs                                              |
| Storybook `Meta` and `StoryObj` | https://storybook.js.org/docs/writing-stories                             |
