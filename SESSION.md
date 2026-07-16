# Session 4 — GraphQL and Apollo Client

## What Was Built in Session 3

- **`EmployeeCard.test.tsx`** — RTL unit tests: renders name/department/email/phone, click handler
- **`AddEmployeeForm.test.tsx`** — RTL unit tests: validation errors, invalid email, success submission
- **`e2e/employee-list.spec.ts`** — Playwright E2E: page heading, 10 cards load, search filter, detail navigation, back navigation
- **Accessibility audit passed** — search input has `sr-only` label, all interactive elements have focus rings, heading order is correct, ARIA attributes on form fields

Run `npm run test` → all unit tests pass.  
Run `npm run test:e2e` → Playwright suite passes (requires `npx playwright install --with-deps chromium` first).

---

## What You'll Build in This Session

### 1. Install and configure Apollo Client

```bash
npm install @apollo/client graphql
```

Create `src/lib/apolloClient.ts`:

```ts
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const httpLink = new HttpLink({ uri: "https://graphqlzero.almansi.me/api" });

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
```

### 2. Write the GraphQL queries

Create `src/graphql/queries.ts` with three operations:

```graphql
# Fetch all employees
query GetEmployees {
  users {
    data {
      id
      name
      email
      phone
      website
      company {
        name
      }
      address {
        street
        suite
        city
        zipcode
      }
    }
  }
}

# Fetch one employee
query GetEmployee($id: ID!) {
  user(id: $id) {
    id
    name
    email
    phone
    website
    company {
      name
    }
    address {
      street
      suite
      city
      zipcode
    }
  }
}

# Simulate adding an employee
mutation CreateEmployee($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    name
    email
  }
}
```

Use the [GraphiQL explorer](https://graphqlzero.almansi.me/api) to test these before wiring them up.

### 3. Write Apollo hooks

Create `src/hooks/useEmployeesGQL.ts` and `src/hooks/useEmployeeGQL.ts`.  
Use `useQuery` from `@apollo/client`. Match the return shape of the existing
TanStack hooks (`data`, `isLoading`, `isError`) so the page components need
minimal changes.

### 4. Swap `QueryClientProvider` for `ApolloProvider`

In `src/App.tsx`:

- Remove `QueryClientProvider` and `QueryClient`
- Add `ApolloProvider` wrapping the router, passing in your `apolloClient`

### 5. Update the pages and form

- In `EmployeeListPage` and `EmployeeDetailPage`, import the GQL hooks instead of
  the TanStack ones — because you matched the return shape, the JSX should need
  little or no change.
- In `AddEmployeeForm`, use `useMutation` from `@apollo/client` to call
  `CREATE_EMPLOYEE` instead of `fetch`.

### 6. Reflect on the architecture (discussion prompt)

- What did you gain by moving to GraphQL? (typed schema, single endpoint, no overfetching)
- What did you lose? (simpler mental model of REST, no native caching of individual fields by default)
- Where in this app would you draw the boundary for a micro frontend?

Document your answers in a comment block at the top of `src/lib/apolloClient.ts`.

---

## Session 4 Checkpoint Goal

> **Data layer migrated to Apollo Client + GraphQL. The app fetches from
> `graphqlzero.almansi.me` and all existing Playwright tests still pass.**

You're done when:

- `npm run dev` → the list and detail pages load data from GraphQL
- `npm run test:e2e` → all Playwright tests still pass (they are API-agnostic)
- TypeScript is happy (`npm run build`)

---

## Architecture Note — Micro Frontend Integration Point

The `EmployeeCard` component and the `Employee` type together form the natural
seam for micro frontend extraction:

```
Host app                          MFE: employee-directory
─────────────────────────         ────────────────────────────────
<EmployeeCard employee={...} />  ← exposes EmployeeCard + Employee type
                                   bundles its own Apollo client
                                   fetches from graphqlzero
```

The host passes an `Employee` object via props; the MFE owns the GraphQL layer.
The `src/types/employee.ts` interface becomes the **shared contract** between the
two — it must not break without a major version bump.

---

## Useful References

| Resource                         | URL                                                     |
| -------------------------------- | ------------------------------------------------------- |
| Apollo Client `useQuery`         | https://www.apollographql.com/docs/react/data/queries   |
| Apollo Client `useMutation`      | https://www.apollographql.com/docs/react/data/mutations |
| `ApolloProvider` setup           | https://www.apollographql.com/docs/react/get-started    |
| GraphQLZero interactive explorer | https://graphqlzero.almansi.me/api                      |
| GraphQLZero schema reference     | https://graphqlzero.almansi.me                          |
