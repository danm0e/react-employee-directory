# Solution — Fully Completed Application

## What Was Built in Session 4

### Apollo Client setup

- `src/lib/apolloClient.ts` — `ApolloClient` configured with `InMemoryCache` and `HttpLink` pointing at `https://graphqlzero.almansi.me/api`
- The file includes comments on the MFE integration point and REST vs GraphQL tradeoffs

### GraphQL queries and mutation

- `src/graphql/queries.ts` — `GET_EMPLOYEES`, `GET_EMPLOYEE`, `CREATE_EMPLOYEE`
- All tested against the [GraphiQL explorer](https://graphqlzero.almansi.me/api) before wiring up

### Apollo hooks

- `src/hooks/useEmployeesGQL.ts` — wraps `useQuery(GET_EMPLOYEES)`, returns `{ data, isLoading, isError }` to match the TanStack hook shape
- `src/hooks/useEmployeeGQL.ts` — wraps `useQuery(GET_EMPLOYEE)`, same return shape

### Data layer migration

- `App.tsx` — `QueryClientProvider` replaced by `ApolloProvider`
- `EmployeeListPage` — `useEmployees` → `useEmployeesGQL` (one import changed, no JSX changes)
- `EmployeeDetailPage` — `useEmployee` → `useEmployeeGQL` (one import changed, no JSX changes)
- `AddEmployeeForm` — `fetch` POST replaced by `useMutation(CREATE_EMPLOYEE)`

### Updated tests

- `AddEmployeeForm.test.tsx` — uses `MockedProvider` from `@apollo/client/testing` to stub the GraphQL layer

### What stayed the same

- All Playwright E2E tests pass without modification (they test behaviour, not implementation)
- `EmployeeCard` and `EmployeeList` components are unchanged
- Zod schema and React Hook Form setup are unchanged
- Tailwind styles are unchanged

---

## Architecture Reflection

### What you gained by moving to GraphQL

- **Typed schema** — the server documents exactly what fields exist and their types; TypeScript codegen is possible
- **Single endpoint** — no proliferation of REST routes; all operations go through `/api`
- **Precise fetching** — the query only requests the fields the UI needs; `address` fields are fetched only in the detail query
- **Mutations are first-class** — `createUser` is described in the schema like any other operation

### What you gave up

- **Simpler mental model** — REST maps directly to resources; GraphQL introduces a query language layer
- **HTTP-layer caching** — REST responses are individually cacheable by CDNs and browsers by URL; GraphQL typically sends everything as POST to one URL
- **Zero setup for reads** — `fetch('/users/1')` needs no client library; Apollo adds bundle size and configuration

### Rule of thumb for this codebase

Use REST (TanStack Query) when the data needs are simple and stable.  
Reach for Apollo when multiple components need the same data in different shapes,
or when the server schema drives client types via codegen.

---

## Micro Frontend Integration Point

The `EmployeeCard` component + `Employee` interface form the natural MFE seam:

```
Host app                                 MFE: employee-directory
──────────────────────────────────────   ────────────────────────────────────────
import { EmployeeCard } from 'emp-dir'  ← exposes EmployeeCard (compiled bundle)
import type { Employee } from 'emp-dir' ← exposes Employee type (shared contract)

<EmployeeCard employee={...} />          owns apolloClient, queries, mutations
                                         fetches from graphqlzero independently
```

**Shared contract:** `src/types/employee.ts` is the interface both sides agree on.
Any breaking change to it must be treated as a major version bump.

**Integration mechanism options:**

1. **Module Federation (Webpack/Vite)** — runtime module sharing; host loads the MFE bundle at runtime
2. **npm package** — compile and publish `employee-directory` as a versioned package; host installs it
3. **iframe with postMessage** — maximum isolation, lowest coupling, but limited UX integration

For a corporate intranet directory, option 2 (npm package) is the simplest starting point.
