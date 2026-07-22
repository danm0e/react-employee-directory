# React Training — Session 4: GraphQL, API Patterns & Architecture

### Employee Directory · 3 August

---

## Slide 1: Session 4 — GraphQL, API Patterns & Architecture

**React Training Programme · Session 4 of 4**
**3 August**

---

### Today's Agenda

|                   |                                                                         |
| ----------------- | ----------------------------------------------------------------------- |
| **Hour 1**        | GraphQL with Apollo Client                                              |
|                   | REST vs GraphQL — the problem each solves                               |
|                   | GraphQL operations: queries, mutations, subscriptions, fragments        |
|                   | Apollo Client setup, `useQuery`, `useMutation`                          |
|                   | The normalised cache — fetch policies and cache invalidation            |
|                   | Error handling and the migration live demo                              |
| ☕ **Break**      | 10 minutes                                                              |
| **Hour 2**        | Architectural Patterns                                                  |
|                   | Feature-based folder structure and layered architecture                 |
|                   | Component patterns: container/presentational, compound components       |
|                   | Custom hooks as an architectural tool                                   |
|                   | Micro frontends — the organisational problem and composition strategies |
| ✅ **Checkpoint** | Full feature on GraphQL · Architecture reviewed · Programme complete    |

---

**SPEAKER NOTES**

**What:** Final session. Two things: migrate the data layer to GraphQL, then step back and look at the full architecture — including where micro frontends fit.

**Why it matters:** Engineers leave with a complete, production-shaped React app and a vocabulary for the architectural conversations they'll have on real projects.

**Ask the room:** "Before we start — can everyone run `npm run dev` on `session-4-start` and see employee cards loading?"

**Transition:** Let's look at where Session 3 left us.

---

## Slide 2: Where We Left Off — Session 3 Recap

**What was built in Session 3:**

- `EmployeeCard.test.tsx` — renders name, company, email, phone; click handler
- `AddEmployeeForm.test.tsx` — validation errors, invalid email, success path with fetch mock
- `playwright.config.ts` + `e2e/employee-list.spec.ts` — full user journey in Chromium
- `EmployeeCard` keyboard fix — `<article onClick>` → `<Link>`
- `eslint-plugin-jsx-a11y` added, accessibility issues resolved

**Current data layer on `session-4-start`:**

```
src/services/api.ts          ← fetch wrappers to jsonplaceholder.typicode.com
src/hooks/useEmployees.ts    ← TanStack Query + REST
src/hooks/useEmployee.ts     ← TanStack Query + REST
```

> Today we add four new files and swap the provider. The page components and tests don't change — that's the adapter pattern paying off.

---

**SPEAKER NOTES**

**What:** Recap of Session 3 homework — what's complete and what the starting data layer looks like.

**Why it matters:** The migration today is deliberately designed to show zero page-level changes. Engineers will see that architectural discipline (matching return shapes, isolating the data layer) makes large migrations cheap.

**Ask the room:** "Did the Playwright tests pass after fixing the EmployeeCard accessibility issue? The tests are API-agnostic — they should still pass after today's migration too."

**Transition:** Let's look at what we're replacing and why.

---

## Slide 3: Today's Migration

**We're swapping the data layer — nothing else changes.**

```
Before (session-4-start)          After (homework complete)
──────────────────────────         ──────────────────────────
App.tsx                            App.tsx
  QueryClientProvider         →      ApolloProvider
  ↓                                  ↓
useEmployees (TanStack+REST)   →    useEmployeesGQL (Apollo+GraphQL)
useEmployee  (TanStack+REST)   →    useEmployeeGQL  (Apollo+GraphQL)

EmployeeListPage    ← no changes
EmployeeDetailPage  ← no changes   ← same props, same JSX
AddEmployeePage     ← no changes
```

**Four new files to build:**

- `src/lib/apolloClient.ts`
- `src/graphql/queries.ts`
- `src/hooks/useEmployeesGQL.ts`
- `src/hooks/useEmployeeGQL.ts`

**API:** `https://graphqlzero.almansi.me/api` — a public GraphQL API mirroring JSONPlaceholder data.

---

**SPEAKER NOTES**

**What:** The migration scope is narrow — four new files, one provider swap. Page components are untouched.

**Why it matters:** This is the payoff for every architectural decision across the four sessions. The return shape discipline (`{ data, isLoading, isError }`) means switching data layers costs almost nothing at the UI layer.

**Ask the room:** "Why don't the page components change? Because they only depend on the hook's interface, not its implementation. What pattern is that? The adapter pattern."

**Transition:** Before we write a line of code, let's understand what GraphQL actually is.

---

---

# HOUR 1

## GraphQL with Apollo Client

---

## Slide 4: REST vs GraphQL — The Problem Each Solves

**REST:** resources at URLs. Works well; breaks down at scale.

```
// Fetching one user's profile with their latest 3 posts:
GET /users/42          → { id, name, email, phone, website, address, company, ... }
GET /users/42/posts    → [ 20 posts with all fields ]
GET /posts/7/comments  → [ all comments ]

// Problems:
// Over-fetching: GET /users/42 returns 15 fields; you need 3
// Under-fetching: 3 separate requests for one page of UI
// Waterfall: request 2 can't start until request 1 finishes
```

**GraphQL:** ask for exactly what you need. One request.

```graphql
query UserWithPosts {
  user(id: "42") {
    name # only these fields
    posts(first: 3) {
      title
      comments {
        text
      }
    }
  }
}
# Single request → exactly the shape you need → no waterfalls
```

---

**SPEAKER NOTES**

**What:** GraphQL solves over-fetching (too much data) and under-fetching (too many requests) that are inherent to REST at scale.

**Why it matters:** Backend engineers understand this immediately — they've written or consumed REST APIs that balloon in payload size as frontend requirements grow. GraphQL is the answer to "why does the mobile app need a different endpoint to the web app?"

**Ask the room:** "Has anyone worked on a project where the mobile and web APIs diverged because each needed different data shapes? That's the problem BFF and GraphQL both address."

**Transition:** GraphQL has four core operation types. Let's look at them.

---

## Slide 5: GraphQL Operations

**Four operation types — you'll use three of them today.**

```graphql
# Query — read data (equivalent to GET)
query GetEmployees {
  users {
    data {
      id
      name
      email
      company {
        name
      }
    }
  }
}

# Mutation — write data (equivalent to POST/PUT/DELETE)
mutation CreateEmployee($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    name
    email
  }
}

# Subscription — real-time updates via WebSocket (awareness only today)
subscription OnNewEmployee {
  employeeAdded {
    id
    name
  }
}

# Fragment — reusable field selections
fragment EmployeeFields on User {
  id
  name
  email
  phone
  company {
    name
  }
}
```

**Fragments** prevent field duplication — define the shape once and compose it into multiple queries.

---

**SPEAKER NOTES**

**What:** The four operation types. We'll use queries and mutations today; subscriptions are awareness-only.

**Why it matters:** Engineers who understand fragments avoid the common mistake of duplicating field lists across queries. When the `Employee` shape changes, you update the fragment once.

**Ask the room:** "Subscriptions use WebSocket under the hood — when would you reach for them? Real-time features: live dashboards, chat, collaborative editing. Not needed for our employee directory."

**Transition:** GraphQL has a type system — let's look at it briefly.

---

## Slide 6: The GraphQL Schema — A Typed Contract

The schema is the **contract between frontend and backend**. It defines every type, query, and mutation available.

```graphql
# Schema excerpt from graphqlzero.almansi.me
type User {
  id: ID! # ! = non-nullable
  name: String!
  email: String!
  phone: String
  company: Company
  address: Address
}

type Query {
  user(id: ID!): User # fetch one user
  users: UsersPage # fetch paginated users
}

type Mutation {
  createUser(input: CreateUserInput!): User
}
```

**Why the schema matters for frontend engineers:**

- It's a contract — the server can't return a shape the schema doesn't describe
- Tools can generate TypeScript types directly from the schema
- The GraphiQL explorer is powered by schema introspection — explore the API interactively

---

**SPEAKER NOTES**

**What:** The schema is a self-describing type system. Any valid GraphQL client can query the schema itself to discover what's available.

**Why it matters:** This is fundamentally different from REST where documentation is often a separate concern and can go stale. GraphQL schemas are always in sync with the server — they're enforced at runtime.

**Ask the room:** "What happens if you request a field that doesn't exist in the schema? The server returns an error before executing the query — you can't accidentally access a field that doesn't exist."

**Transition:** The best way to understand the schema is to explore it live. Let's open the GraphiQL explorer.

---

## Slide 7: [LIVE CODE] GraphiQL Explorer — Explore the API First

> **Trainer:** Open `https://graphqlzero.almansi.me/api` in the browser. Walk through the schema, then execute queries before writing any code.

**What to demonstrate:**

**1. Schema sidebar** — click the "Docs" or "Explorer" panel. Navigate to `Query → users → UsersPage → data → User`. Show every field available.

**2. Write and execute `GetEmployees`:**

```graphql
query GetEmployees {
  users {
    data {
      id
      name
      email
      phone
      company {
        name
      }
    }
  }
}
```

Run it. Show the response. Note: `users.data` is the array — not `users` directly.

**3. Write and execute `GetEmployee`:**

```graphql
query GetEmployee {
  user(id: "1") {
    id
    name
    email
    company {
      name
    }
    address {
      street
      city
    }
  }
}
```

> **Point out:** The response shape in the Explorer is exactly what the TypeScript types need to match. We'll use this when writing `queries.ts` next.

---

**SPEAKER NOTES**

**What:** Live GraphiQL exploration — show the schema, run real queries, inspect response shapes before touching the codebase.

**Why it matters:** Engineers who test queries in the explorer first ship fewer bugs. The explorer is available for any GraphQL API — this is a transferable skill. It also reveals the `users.data` nesting that would trip engineers up if they went straight to code.

**Ask the room:** "Notice how the Explorer shows field types inline. What does `ID!` mean? Non-nullable ID — the server guarantees this field is always present."

**Transition:** Now we know exactly what the API returns. Let's set up Apollo Client.

---

## Slide 8: Apollo Client Setup

Three pieces: the client, the provider, and the hooks.

```ts
// 1. Create the client — outside React, persists across renders
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const httpLink = new HttpLink({
  uri: "https://graphqlzero.almansi.me/api",
});

export const apolloClient = new ApolloClient({
  link: httpLink, // where to send requests
  cache: new InMemoryCache(), // normalised in-memory cache
});
```

```tsx
// 2. Provide it to the React tree
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./lib/apolloClient";

<ApolloProvider client={apolloClient}>
  <App />
</ApolloProvider>;
```

```tsx
// 3. Query from any component below the provider
const { data, loading, error } = useQuery(GET_EMPLOYEES);
```

> Install first: `npm install @apollo/client graphql`

---

**SPEAKER NOTES**

**What:** Three steps to set up Apollo — client, provider, hooks. The structure mirrors TanStack Query exactly: `QueryClient` → `QueryClientProvider` → `useQuery`.

**Why it matters:** Engineers who've done Session 2 already understand this pattern. The mental model transfers directly; only the library and API change.

**Ask the room:** "Why does `apolloClient` live outside the `App` function? Same reason `queryClient` did — if it's inside the component, a new client (and empty cache) is created on every render."

**Transition:** Let's write the client file now.

---

## Slide 9: [LIVE CODE] `src/lib/apolloClient.ts`

> **Trainer:** Open `src/lib/apolloClient.ts`. Replace the stub with the complete implementation.

```ts
// src/lib/apolloClient.ts
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const httpLink = new HttpLink({
  uri: "https://graphqlzero.almansi.me/api",
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
```

**Installation (if not already done):**

```bash
npm install @apollo/client graphql
```

> **Point out:** `HttpLink` is one link in Apollo's middleware chain. In production you'd add `authLink` before it to inject auth headers — links compose like middleware.

---

**SPEAKER NOTES**

**What:** Live creation of the Apollo client. Simple and minimal — one link, one cache.

**Why it matters:** The link chain is worth mentioning even if we don't implement it today. Engineers will encounter auth headers, error interceptors, and retry logic all expressed as Apollo links.

**Ask the room:** "What's the equivalent of Apollo's link chain in the backend world? Express middleware — each link in the chain can inspect, modify, or short-circuit the request."

**Transition:** Now let's define the GraphQL operations.

---

## Slide 10: `useQuery` — The Core API

```tsx
import { useQuery } from "@apollo/client";

const { data, loading, error, refetch } = useQuery(GET_EMPLOYEES);

// With variables — re-runs when variables change
const { data } = useQuery(GET_EMPLOYEE, {
  variables: { id: String(id) },
  skip: id <= 0, // skip the query entirely when condition is true
});
```

**What you get back:**

| Property  | Type                       | Meaning                                     |
| --------- | -------------------------- | ------------------------------------------- |
| `data`    | `T \| undefined`           | Response data, or `undefined` while loading |
| `loading` | `boolean`                  | `true` on first fetch (no cache yet)        |
| `error`   | `ApolloError \| undefined` | Contains `networkError` and `graphQLErrors` |
| `refetch` | `function`                 | Manually re-run the query                   |

**vs TanStack Query:** `loading` maps to `isLoading`, `error` is an `ApolloError`. The return shape is similar — which is why matching it in our hooks makes the migration zero-cost at the page level.

---

**SPEAKER NOTES**

**What:** The useQuery API — similar to TanStack Query but with Apollo-specific types.

**Why it matters:** The deliberate decision to match `{ data, isLoading, isError }` across hooks means page components are oblivious to the underlying library. Engineers should recognise this as a real architectural win.

**Ask the room:** "What does `skip: id <= 0` do? It prevents the query from running when `id` is 0 or negative — for example, before the URL parameter has been parsed. TanStack Query had `enabled: id > 0` for the same purpose."

**Transition:** Let's write the query definitions.

---

## Slide 11: [LIVE CODE] `src/graphql/queries.ts`

> **Trainer:** Open `src/graphql/queries.ts`. Define all three operations using the shapes confirmed in the GraphiQL explorer.

```ts
// src/graphql/queries.ts
import { gql } from "@apollo/client";

export const GET_EMPLOYEES = gql`
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
`;

export const GET_EMPLOYEE = gql`
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
`;

export const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
    }
  }
`;
```

> **Point out:** `gql` is a tagged template literal — it parses the query string into an AST at build time. The Explorer showed us exactly these field names.

---

**SPEAKER NOTES**

**What:** Live creation of the three GraphQL operations. The shapes match exactly what the GraphiQL explorer returned.

**Why it matters:** The explorer-first workflow prevents the most common GraphQL mistake: querying a field that doesn't exist or expecting `users` when the API returns `users.data`. Engineers saw the real response before writing a line.

**Ask the room:** "Notice CREATE_EMPLOYEE returns only `id`, `name`, `email`. Why not all fields? You request what you need — in this case we only need confirmation the user was created."

**Transition:** Now let's wrap these queries in custom hooks.

---

## Slide 12: [LIVE CODE] `src/hooks/useEmployeesGQL.ts`

> **Trainer:** Open `src/hooks/useEmployeesGQL.ts`. Build the hook that replaces `useEmployees`.

```ts
// src/hooks/useEmployeesGQL.ts
import { useQuery } from "@apollo/client";
import { GET_EMPLOYEES } from "../graphql/queries";
import type { Employee } from "../types/employee";

// GraphQLZero nests the array inside users.data
interface GetEmployeesData {
  users: { data: Employee[] };
}

export function useEmployeesGQL() {
  const { data, loading, error } = useQuery<GetEmployeesData>(GET_EMPLOYEES);
  return {
    data: data?.users.data, // normalise: unwrap the nesting
    isLoading: loading, // match TanStack shape exactly
    isError: !!error,
    error,
  };
}
```

> **Show:** import this in `EmployeeListPage.tsx` — swap one import line. The JSX changes are **zero** because the return shape is identical to `useEmployees`.

---

**SPEAKER NOTES**

**What:** The hook wraps Apollo's useQuery, normalises the response nesting, and returns the same shape as the TanStack version.

**Why it matters:** The `users.data` unwrapping is the kind of thing that trips teams up when switching APIs. Doing it in the hook means the page component never sees the nesting — it just sees `Employee[]`.

**Ask the room:** "What would happen if we returned `data?.users` instead of `data?.users.data`? The page would receive `{ data: Employee[] }` instead of `Employee[]` — the JSX would break. Normalise at the hook boundary."

**Transition:** Same pattern for the single-employee hook.

---

## Slide 13: [LIVE CODE] `src/hooks/useEmployeeGQL.ts`

> **Trainer:** Open `src/hooks/useEmployeeGQL.ts`.

```ts
// src/hooks/useEmployeeGQL.ts
import { useQuery } from "@apollo/client";
import { GET_EMPLOYEE } from "../graphql/queries";
import type { Employee } from "../types/employee";

interface GetEmployeeData {
  user: Employee;
}

export function useEmployeeGQL(id: number) {
  const { data, loading, error } = useQuery<GetEmployeeData>(GET_EMPLOYEE, {
    variables: { id: String(id) }, // GraphQLZero expects ID as string
    skip: id <= 0, // don't query before id is available
  });
  return {
    data: data?.user,
    isLoading: loading,
    isError: !!error,
    error,
  };
}
```

> **Point out:** `id: String(id)` — GraphQL `ID!` accepts strings. Our TypeScript `Employee.id` is `number`, so we coerce at the boundary. This is the kind of type mismatch the schema reveals before it causes a runtime bug.

---

**SPEAKER NOTES**

**What:** Same pattern as useEmployeesGQL — wrap, normalise, match existing shape.

**Why it matters:** The `skip` condition is important — `useParams` returns a string that we parse to a number, and during the brief moment before routing is complete, `id` could be 0. Without `skip`, you'd make a request with `id: "0"` which returns null or an error.

**Ask the room:** "After creating both GQL hooks, what's the diff to make the pages use them? Two import lines. Everything else stays the same."

**Transition:** Before we swap the provider, let's understand how Apollo caches data.

---

## Slide 14: The Normalised Cache — How Apollo Stores Data

Apollo's `InMemoryCache` stores objects by **type + id**, not by query. Updates propagate automatically.

```
Query: GET_EMPLOYEES                  Cache store:
──────────────────────                ──────────────────────────────────
users.data[0] → { id: 1, name: ... }  User:1  { id: 1, name: "Leanne..." }
users.data[1] → { id: 2, name: ... }  User:2  { id: 2, name: "Ervin..."  }
                                       User:3  { id: 3, name: ...          }

Query: GET_EMPLOYEE(id: 1)
──────────────────────────
user → { id: 1, name: ... }           ← reads from User:1 — no network request!
```

**Why this matters:**

- Fetch the employee list → individual detail pages are already cached
- Update `User:1` via mutation → the list and the detail page both update instantly
- No manual cache synchronisation needed

```ts
// After a mutation, invalidate to force a fresh fetch
refetchQueries: [{ query: GET_EMPLOYEES }];
```

---

**SPEAKER NOTES**

**What:** The normalised cache stores entities by type:id, not by query. This is what makes Apollo's cache more powerful than TanStack Query's query-level caching.

**Why it matters:** TanStack Query caches by queryKey — updating one query doesn't automatically update another. Apollo's normalised cache means a single mutation can update every component that references the same entity without any explicit coordination.

**Ask the room:** "If you fetch the employee list and then navigate to employee 1's detail page, does Apollo make a network request for employee 1? No — it's already in the cache under User:1 from the list query."

**Transition:** Cache fetch policies control when Apollo uses the cache vs the network.

---

## Slide 15: Cache Policies and Error Handling

**Fetch policies** — control the cache/network balance per query:

| Policy              | Behaviour                             | Use when              |
| ------------------- | ------------------------------------- | --------------------- |
| `cache-first`       | Return cache; fetch only if missing   | Default — stable data |
| `network-only`      | Always fetch; update cache            | Must-be-fresh data    |
| `cache-and-network` | Return cache immediately, then update | Lists, dashboards     |
| `no-cache`          | Always fetch; don't store             | Sensitive/ephemeral   |

**Error handling — two distinct error types:**

```tsx
const { data, loading, error } = useQuery(GET_EMPLOYEES);

// error.networkError — no response from server (offline, 500)
if (error?.networkError) return <NetworkError />;

// error.graphQLErrors — server responded but returned errors
// e.g. auth failure, invalid query, resolver threw
if (error?.graphQLErrors?.length) {
  console.error(error.graphQLErrors.map((e) => e.message));
}
```

> For this project, our hooks expose `isError: !!error` — the pages already handle it. No page-level changes needed.

---

**SPEAKER NOTES**

**What:** Cache policies and the two error types. The policy default is `cache-first` which is right for most read operations.

**Why it matters:** The network/GraphQL error distinction is important — they require different handling. A network error means retry; a GraphQL error might mean the user doesn't have permission or the query is wrong.

**Ask the room:** "When would you use `cache-and-network`? When you want the fastest possible perceived performance (show cached data immediately) but also want fresh data. Good for the employee list."

**Transition:** Let's wire up the mutation and then do the final provider swap.

---

## Slide 16: `useMutation` — Writing Data

```tsx
import { useMutation } from "@apollo/client";
import { CREATE_EMPLOYEE, GET_EMPLOYEES } from "../graphql/queries";

const [createEmployee, { loading, error }] = useMutation(CREATE_EMPLOYEE, {
  // After mutation succeeds, refetch the employee list
  refetchQueries: [{ query: GET_EMPLOYEES }],
});

// Call it from the form submit handler
await createEmployee({
  variables: {
    input: {
      name: data.name,
      username: data.name.toLowerCase().replace(/\s+/g, "_"),
      email: data.email,
      phone: data.phone ?? "",
    },
  },
});
```

**`useMutation` returns a tuple:** `[mutate function, result object]`

- The mutate function is called explicitly — unlike `useQuery` which runs on mount
- `refetchQueries` tells Apollo to re-fetch the list after creating an employee
- `loading` is `true` while the mutation is in-flight — use it to disable the submit button

---

**SPEAKER NOTES**

**What:** useMutation pattern — call mutate() explicitly, use refetchQueries for cache invalidation.

**Why it matters:** The homework asks engineers to swap the form's `fetch()` call with `useMutation`. This slide gives them the complete pattern to copy. `refetchQueries` is the simplest cache invalidation strategy — more advanced teams use `update` to write directly to the cache for instant UI updates.

**Ask the room:** "GraphQLZero doesn't actually persist data — `createUser` always returns `{ id: 11, ... }`. Does that matter for the demo? No — the round trip proves the mutation works. In a real API, the refetchQueries would show the new employee in the list."

**Transition:** Now let's do the provider swap that ties everything together.

---

## Slide 17: [LIVE CODE] Migrate `App.tsx` — Provider Swap

> **Trainer:** Open `src/App.tsx`. Remove `QueryClientProvider` and add `ApolloProvider`. Update page imports to use the GQL hooks.

```tsx
// src/App.tsx — after migration
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./lib/apolloClient";
import { EmployeeListPage } from "./pages/EmployeeListPage";
import { EmployeeDetailPage } from "./pages/EmployeeDetailPage";
import { AddEmployeePage } from "./pages/AddEmployeePage";

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EmployeeListPage />} />
          <Route path="/employees/new" element={<AddEmployeePage />} />
          <Route path="/employees/:id" element={<EmployeeDetailPage />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
```

**In `EmployeeListPage.tsx` and `EmployeeDetailPage.tsx` — one line each:**

```ts
// Before:
import { useEmployees } from "../hooks/useEmployees";
// After:
import { useEmployeesGQL } from "../hooks/useEmployeesGQL";
```

> **Run the app.** Employee cards should load from `graphqlzero.almansi.me`. Check the Network tab — one POST request, not multiple GETs.

---

**SPEAKER NOTES**

**What:** The final migration step. Show the app running with GraphQL data. Open Network tab to show the single POST request to the GraphQL endpoint.

**Why it matters:** The "single POST, one request" moment is always impactful. Engineers see concretely how GraphQL eliminates the N+1 request pattern. Point out that the pages are identical — same Tailwind classes, same component structure.

**Ask the room:** "Why does GraphQL use POST, not GET? The query string can be complex — posting it as JSON avoids URL length limits and allows for variables as structured data."

**Transition:** Now that we've seen both sides, let's compare REST and GraphQL honestly.

---

## Slide 18: REST vs GraphQL — An Honest Comparison

Neither is universally better. Choose based on your actual constraints.

|                         | REST                          | GraphQL                                   |
| ----------------------- | ----------------------------- | ----------------------------------------- |
| **Learning curve**      | Low — everyone knows it       | Higher — schema, types, resolver concepts |
| **Tooling maturity**    | Excellent                     | Very good (Apollo, urql, Pothos)          |
| **Caching**             | HTTP cache (CDN, browser)     | Client-side only (Apollo cache)           |
| **Over/under-fetching** | Common problem at scale       | Solved by design                          |
| **Type safety**         | Manual or OpenAPI-generated   | Schema-first — always in sync             |
| **Real-time**           | Polling or WebSocket (manual) | Subscriptions built in                    |
| **File uploads**        | Trivial (multipart)           | Requires workaround                       |
| **Versioning**          | `/v1/`, `/v2/` — explicit     | Deprecate fields — additive               |

**When GraphQL wins:** multiple clients with different data needs, complex nested queries, strong type safety requirement.

**When REST wins:** simple CRUD, public APIs, heavy CDN caching, team unfamiliar with GraphQL overhead.

---

**SPEAKER NOTES**

**What:** Honest comparison — not a sales pitch for GraphQL.

**Why it matters:** Engineers who understand the trade-offs make better architectural decisions. The caching point is critical and often overlooked: REST can use CDN/browser HTTP caching; GraphQL POST requests cannot be cached at the HTTP layer without additional tooling.

**Ask the room:** "What does your current backend API look like? If it's already REST and works well, GraphQL adds migration cost for uncertain benefit. If you're building something new with multiple clients, GraphQL may pay off quickly."

**Transition:** Time for a break.

---

---

# ☕ BREAK — 10 MINUTES

---

**SPEAKER NOTES**

**What:** Final break of the programme.

**Why it matters:** Hour 2 is architectural patterns and micro frontends — conceptual density is high. Fresh attention helps.

**Ask the room:** On return: "Any questions from Hour 1 before we look at the bigger picture?"

**Transition:** Hour 2 — stepping back to look at the full architecture.

---

---

# HOUR 2

## Architectural Patterns

---

## Slide 19: Bringing It All Together — The Four-Session Arc

```
Session 1 — UI Layer
  React components, TypeScript, hooks, Tailwind, Storybook
  → EmployeeCard: typed, styled, tested, documented

Session 2 — Data & Form Layer
  TanStack Query, React Hook Form, Zod, accessibility
  → AddEmployeeForm: validated, accessible, integrated

Session 3 — Quality Layer
  RTL, Vitest, Playwright, a11y audit
  → Tests: unit + E2E; keyboard navigation fixed

Session 4 — API & Architecture Layer (today)
  GraphQL, Apollo Client, architectural patterns, micro frontends
  → Data layer migrated; architecture reviewed
```

**The complete stack:**

```
UI          → components/ (EmployeeCard, AddEmployeeForm, EmployeeList)
Data        → hooks/ (useEmployeesGQL, useEmployeeGQL)
Queries     → graphql/ (GET_EMPLOYEES, GET_EMPLOYEE, CREATE_EMPLOYEE)
Validation  → schemas/ (employeeFormSchema)
Services    → services/ (api.ts — kept for REST fallback reference)
Types       → types/ (Employee interface — the shared contract)
```

---

**SPEAKER NOTES**

**What:** Connect the four sessions into a coherent architecture. Engineers see how each session's output becomes the foundation for the next.

**Why it matters:** Engineers often experience training as disconnected modules. Seeing the arc — UI → data → quality → API — helps them understand the sequencing and why each layer was taught in that order.

**Ask the room:** "Looking at the full stack, where are the layer boundaries? UI layer ends at the JSX. Data layer ends at the hook interface. The page components sit at the seam between them."

**Transition:** The folder structure we've built is a simplified version of a production pattern. Let's look at how it scales.

---

## Slide 20: Feature-Based Folder Structure

For larger apps, organise by **what the code does** rather than **what type of file it is**.

```
src/
├── features/                    # one folder per domain feature
│   ├── employees/
│   │   ├── components/          EmployeeCard.tsx  EmployeeList.tsx
│   │   ├── hooks/               useEmployeesGQL.ts  useEmployeeGQL.ts
│   │   ├── graphql/             queries.ts
│   │   ├── schemas/             employee.schema.ts
│   │   ├── types.ts             Employee interface
│   │   └── index.ts             # public API — only export what's needed
│   └── auth/
│       ├── components/          LoginForm.tsx
│       ├── hooks/               useAuth.ts
│       └── index.ts
├── shared/                      # cross-feature primitives
│   ├── components/              Button/  Input/  Modal/
│   └── hooks/                   useDebounce.ts
└── app/                         # routing and setup only
    └── App.tsx
```

**The rule:** features import from `shared/` but **never from each other**. Prevents hidden coupling.

---

**SPEAKER NOTES**

**What:** Feature-based structure scales better than type-based (components/, hooks/, etc.) because it keeps related code co-located.

**Why it matters:** In a type-based structure, adding a feature means touching 5 directories. In a feature-based structure, you add one directory. The import rule ("features don't import each other") is the discipline that makes this work.

**Ask the room:** "Our current project uses type-based structure. At what size does this become painful? Usually around 5-10 features with 3+ files each — the components/ folder becomes a flat list of 30 files with no grouping."

**Transition:** Inside any feature, the layers have distinct responsibilities.

---

## Slide 21: Layered Architecture — UI, Data, Service

**Three layers, clear dependency direction: UI → Data → Service → pure functions**

```
┌────────────────────────────────────────────────┐
│  UI Layer                                      │
│  Components + JSX. No business logic.         │
│  EmployeeCard, EmployeeList, AddEmployeeForm   │
├────────────────────────────────────────────────┤
│  Data Layer                                    │
│  Apollo/TanStack hooks. Owns fetching,         │
│  caching, loading/error states. No JSX.        │
│  useEmployeesGQL, useEmployeeGQL               │
├────────────────────────────────────────────────┤
│  Service Layer                                 │
│  Domain logic — transforms, validates,         │
│  composes. Pure functions, no React.           │
│  employeeFormSchema, api.ts                    │
└────────────────────────────────────────────────┘
```

**Dependency rule:** upper layers depend on lower layers. Lower layers never import from upper.

- ✅ UI imports from Data: `useEmployeesGQL()`
- ✅ Data imports from Service: `getEmployees()`
- ❌ Service imports from UI: never
- ❌ Data imports from UI: never

---

**SPEAKER NOTES**

**What:** Layered architecture with one-directional dependencies. The same pattern as any well-designed backend.

**Why it matters:** When the dependency direction is enforced, each layer is independently testable. The service layer has no React dependency — pure functions, pure Jest/Vitest tests. The data layer can be tested with a mock server. The UI layer is tested with RTL.

**Ask the room:** "Where does Zod fit in this diagram? Service layer — it's pure validation logic with no React dependency. `employeeFormSchema` doesn't import anything from React."

**Transition:** Let's look at some component-level patterns that apply within the UI layer.

---

## Slide 22: Component Patterns — Container/Presentational

**Revisited — now with GraphQL:**

```tsx
// Container — knows about GraphQL, manages state, no visual logic
function EmployeeListContainer() {
  const { data: employees, isLoading, isError } = useEmployeesGQL();
  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  return <EmployeeList employees={employees ?? []} />;
}

// Presentational — pure render, no data fetching
function EmployeeList({ employees }: { employees: Employee[] }) {
  return (
    <ul className="grid grid-cols-3 gap-4">
      {employees.map((emp) => (
        <EmployeeCard key={emp.id} employee={emp} />
      ))}
    </ul>
  );
}
```

**Why this still matters with GraphQL:** Apollo hooks can be called in multiple components — each would make its own request (though cache deduplicates). Keeping data-fetching in containers maintains the single-responsibility principle.

---

**SPEAKER NOTES**

**What:** Container/Presentational pattern with Apollo. The container handles loading/error guards; the presentational component is a pure function of props.

**Why it matters:** Even with Apollo's cache making data sharing cheap, architectural discipline pays off. Presentational components can be tested and Storied in isolation. Containers can be refactored without touching the visual components.

**Ask the room:** "If two containers both call `useEmployeesGQL()`, how many network requests are made? One — Apollo's cache deduplicates. Both components share the same cached response."

**Transition:** Another powerful pattern for complex UI — compound components.

---

## Slide 23: Compound Components

Compound components share implicit state through React context. They produce expressive, self-contained APIs.

```tsx
// Without compound components — imperative, fragile
<Tabs activeTab="overview" onTabChange={setActiveTab}>
  <Tab id="overview" label="Overview" />
  <TabPanel id="overview"><OverviewContent /></TabPanel>
</Tabs>

// With compound components — declarative, co-located
<Tabs defaultTab="overview">
  <Tabs.Tab id="overview">Overview</Tabs.Tab>
  <Tabs.Tab id="details">Details</Tabs.Tab>
  <Tabs.Panel id="overview"><OverviewContent /></Tabs.Panel>
  <Tabs.Panel id="details"><DetailsContent /></Tabs.Panel>
</Tabs>
```

```tsx
// Implementation — shared state via context
const TabsContext = React.createContext<TabsContextValue>(null!);

function Tabs({ defaultTab, children }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}
Tabs.Tab = function Tab({ id, children }) {
  /* reads TabsContext */
};
Tabs.Panel = function Panel({ id, children }) {
  /* reads TabsContext */
};
```

---

**SPEAKER NOTES**

**What:** Compound components use context to share implicit state between sub-components, creating expressive JSX APIs.

**Why it matters:** Libraries like Radix UI, Headless UI, and React Aria all use this pattern. Engineers working with component libraries need to recognise it. It's also a good pattern for your own complex UI — accordion, modal, tabs, dropdown.

**Ask the room:** "What's the benefit of `Tabs.Tab` syntax over importing `Tab` separately? Namespace — it's immediately clear that `Tabs.Tab` belongs to `Tabs`. It also makes the relationship explicit at the import level."

**Transition:** Custom hooks are the architectural pattern that ties everything else together.

---

## Slide 24: Custom Hooks as an Architectural Tool

The most powerful architectural pattern in React: **extract all logic into hooks, keep components as pure render functions**.

```tsx
// ❌ Fat component — logic, data, and render all mixed together
function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_EMPLOYEE, {
    variables: { id: String(id) },
    skip: Number(id) <= 0,
  });
  const handleBack = useCallback(() => navigate(-1), [navigate]);
  // ... 50 more lines of logic before any JSX

  return <div>{/* JSX */}</div>;
}

// ✅ Logic extracted — component is pure render
function useEmployeeDetailPage(id: string | undefined) {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useEmployeeGQL(Number(id));
  const handleBack = useCallback(() => navigate(-1), [navigate]);
  return { employee: data, isLoading, isError, handleBack };
}

function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { employee, isLoading, isError, handleBack } =
    useEmployeeDetailPage(id);
  // 5 lines of JSX that are easy to read and test
}
```

---

**SPEAKER NOTES**

**What:** Extract all logic — queries, callbacks, derived state — into a custom hook. The component becomes a thin render layer.

**Why it matters:** The logic hook is easily unit-tested without rendering a component. The component is trivially testable with RTL (just pass mock return values). This separation is the defining characteristic of well-architected React code.

**Ask the room:** "How would you test `useEmployeeDetailPage`? Use `renderHook` from RTL — it lets you call a hook in isolation and assert on its return values."

**Transition:** Let's look at the full architecture of our project before moving to micro frontends.

---

## Slide 25: In Our Project — The Full Architecture

```
App.tsx
├── ApolloProvider           ← data context (Session 4)
│   └── BrowserRouter        ← routing context (Session 1)
│       └── Routes
│           ├── /  →  EmployeeListPage
│           │         useEmployeesGQL()      ← data layer
│           │         EmployeeList           ← presentational
│           │           EmployeeCard         ← presentational, tested, Storybooked
│           │
│           ├── /employees/:id  →  EmployeeDetailPage
│           │                      useEmployeeGQL(id)   ← data layer
│           │
│           └── /employees/new  →  AddEmployeePage
│                                   AddEmployeeForm      ← validated, accessible
│                                     employeeFormSchema ← Zod (service layer)
│
src/graphql/queries.ts        ← operation definitions
src/lib/apolloClient.ts       ← Apollo setup
src/types/employee.ts         ← shared contract — the MFE seam
```

Every concept from every session lives in this diagram.

---

**SPEAKER NOTES**

**What:** The complete architecture of the app — every layer, every concept from all four sessions.

**Why it matters:** Engineers can point to any node in this tree and explain: what layer it's in, why it's there, how to test it, and what happens if it changes. That's the goal of the four sessions.

**Ask the room:** "Point to where each session's contribution lives. Session 1 = EmployeeCard + hooks shape. Session 2 = AddEmployeeForm + Zod. Session 3 = tests + a11y. Session 4 = graphql/ + lib/apolloClient."

**Transition:** This architecture is one app owned by one team. Now let's ask: what if five teams needed to contribute to this independently?

---

## Slide 26: What Are Micro Frontends?

**Apply microservices thinking to the frontend — split the UI into independently deployable pieces, each owned by a separate team.**

```
Monolith — one repo, all teams                 Micro Frontends — team-owned slices
──────────────────────────────                 ────────────────────────────────────
  Team A: Header + Nav                           Header MFE      (Team A)
  Team B: Checkout + Cart            →           Search MFE      (Team A)
  Team C: Search + Products                      Product List MFE (Team C)
                                                 Cart MFE        (Team B)
  • One team blocks all deployments              Checkout MFE    (Team B)
  • 15-30 min builds
  • Breaking change = coordinate everyone        • Teams deploy independently
                                                 • Builds are fast and scoped
                                                 • Breaking changes are contained
```

**The core value proposition:** team autonomy at deployment boundaries.

> Micro frontends solve an **organisational** problem, not a technical one. If you have one team, you don't need them.

---

**SPEAKER NOTES**

**What:** Micro frontends apply the microservices decomposition model to the frontend. The driver is team scale, not technical complexity.

**Why it matters:** This is the concept the client specifically requested. Engineers at this company may be joining or working alongside teams building in this model. Understanding the "why" prevents cargo-culting the pattern.

**Ask the room:** "How many frontend teams does your current project have? The answer determines whether micro frontends are relevant. One team: definitely not. Five+ teams with independent deployment needs: worth evaluating."

**Transition:** There are three main ways to compose micro frontends. Each involves real trade-offs.

---

## Slide 27: Composition Strategies

**How MFEs are assembled into a complete application:**

**1. Build-time Integration**

```
// Shell app installs each MFE as an npm package
import { EmployeeDirectory } from "@company/employee-mfe";

// ✅ Simple, type-safe, one optimised bundle
// ❌ Re-deploy all teams for any change — loses independent deployment
```

**2. Runtime (Module Federation) — the dominant approach**

```js
// webpack.config.js — MFE exposes its components
new ModuleFederationPlugin({
  name: "employeeMfe",
  filename: "remoteEntry.js",
  exposes: { "./EmployeeCard": "./src/components/EmployeeCard" },
  shared: { react: { singleton: true } }, // one copy of React
});

// Shell app loads the MFE at runtime from a CDN URL
new ModuleFederationPlugin({
  remotes: {
    employeeMfe: "employeeMfe@https://employees.cdn.com/remoteEntry.js",
  },
});
```

**3. iFrame Composition**

```
// ✅ True isolation — CSS/JS can't bleed between MFEs
// ❌ Performance overhead, UX issues (scroll, modal, routing), hard to share design system
```

---

**SPEAKER NOTES**

**What:** Three composition strategies with honest trade-offs. Module Federation is the dominant production approach.

**Why it matters:** Build-time is too simple (loses the deployment benefit). iFrames are too isolating (UX and performance problems). Module Federation is the sweet spot — runtime composition with shared dependencies. It's how most production micro frontend platforms are built.

**Ask the room:** "What does `singleton: true` in the shared config do? Ensures only one instance of React runs across all MFEs — critical because two React versions would mean two reconcilers and broken hooks."

**Transition:** Sharing things across MFE boundaries needs deliberate design.

---

## Slide 28: Shared State, Design Systems & Routing

**The three hard problems of micro frontends:**

**1. Cross-MFE State**

```ts
// ❌ Don't share React state — MFEs are in separate runtimes
// ✅ Use a shared event bus for loose coupling
window.dispatchEvent(
  new CustomEvent("employee:selected", { detail: { id: 1 } }),
);
window.addEventListener("employee:selected", (e) => console.log(e.detail.id));

// ✅ URL is natural shared state — use query params
// ✅ Auth state: cookie + lightweight shared utility
```

**2. Design System**

```
// Option A: npm package — all MFEs install independently
// Option B: Module Federation "design" remote — expose components from one source
// Key rule: version carefully — a breaking DS change shouldn't require 10 team deploys
```

**3. Routing**

```
// Shell app owns top-level routes
// Each MFE handles its own sub-routes
// Use singleton React Router from shell — don't duplicate it in each MFE
```

---

**SPEAKER NOTES**

**What:** The three hardest challenges in micro frontend architectures — state, design systems, and routing.

**Why it matters:** These are the problems that kill micro frontend adoption when not addressed upfront. Teams that start without a clear design system strategy end up with visual inconsistency; teams without a routing strategy end up with broken deep links.

**Ask the room:** "The event bus approach to cross-MFE state is loose coupling — MFEs don't know about each other, only about events. What pattern is that? Observer/pub-sub. Same as browser native events."

**Transition:** Let's be honest about when this is and isn't the right choice.

---

## Slide 29: Trade-offs — When NOT to Use Micro Frontends

**The genuine costs:**

| Trade-off                | Reality                                                                           |
| ------------------------ | --------------------------------------------------------------------------------- |
| **Bundle duplication**   | Each MFE may ship its own React copy if singletons aren't configured              |
| **Operational overhead** | Multiple CI/CD pipelines, CDN config, CORS setup, separate deployments            |
| **Testing complexity**   | Integration testing across boundaries requires contract testing and E2E harnesses |
| **Runtime failures**     | If the remote MFE's CDN is down, your shell app breaks                            |
| **Type safety**          | Cross-bundle TypeScript types require explicit sharing strategies                 |

**The honest checklist — only adopt micro frontends if:**

- ✅ You have multiple autonomous teams with independent deployment needs
- ✅ The organisational benefit outweighs the operational cost
- ✅ You have the DevOps maturity to run multiple pipelines
- ✅ You have a clear design system strategy

> **Start with a monorepo.** Extract MFEs when you genuinely need team autonomy at deployment boundaries — not before.

---

**SPEAKER NOTES**

**What:** The honest cost-benefit analysis. Micro frontends are not a free upgrade.

**Why it matters:** The client is interested in micro frontends — this slide helps them evaluate whether now is the right time, rather than just adopting the pattern because it's fashionable. Runtime failures in particular are a real operational risk.

**Ask the room:** "What's the most underestimated cost? Usually the DevOps work — separate pipelines, CDN management, CORS configuration. Teams that underestimate this stall out after the proof of concept."

**Transition:** Let's look at where our Employee Directory sits naturally in a micro frontend architecture.

---

## Slide 30: In Our Project — The Natural MFE Seam

The Employee Directory as a micro frontend — extracted from a larger platform:

```
Platform Shell App                     Employee Directory MFE
─────────────────────                  ──────────────────────────────
<Header />                             exposes:
<Nav />                 loads →          EmployeeCard component
<EmployeeDirectoryMFE />                 Employee type interface
<Footer />                             owns:
                                         Apollo client (GraphQL)
                                         useEmployeesGQL, useEmployeeGQL
                                         All employee pages + routes
```

**The natural seam is `src/types/employee.ts`:**

```ts
// This interface becomes the shared contract
// between the shell and the MFE
export interface Employee {
  id: number;
  name: string;
  email: string;
  company: { name: string };
  // ...
}
```

The shell passes an `Employee` to `<EmployeeCard>`. The MFE owns the GraphQL layer. Neither knows about the other's internals. The `Employee` type must not break without a major version bump — it's the public API.

---

**SPEAKER NOTES**

**What:** The Employee Directory maps cleanly to a micro frontend — it has clear boundaries, its own data layer, and a minimal surface area exposed to the shell.

**Why it matters:** This makes the abstract concept concrete. Engineers can see exactly which files would stay in the MFE and which become the shared contract. The Employee type isn't just a convenience — it's the versioned API surface between teams.

**Ask the room:** "If the shell wants to show an employee card in a notification, what does it need? Just `import { EmployeeCard } from '@company/employee-mfe'` and an `Employee` object. Everything else — GraphQL, Apollo, styling — is contained inside the MFE."

**Transition:** Let's bring the session to a close with the checkpoint.

---

---

## Slide 31: Session 4 Checkpoint ✅

**Hour 1 — GraphQL with Apollo Client**

- ✅ REST vs GraphQL — over/under-fetching, when to use each
- ✅ Operations: query, mutation, subscription, fragment
- ✅ Apollo Client: `HttpLink`, `InMemoryCache`, `ApolloProvider`
- ✅ `useQuery`: variables, `skip`, loading/error/data
- ✅ `useMutation`: call explicitly, `refetchQueries` for invalidation
- ✅ Normalised cache: stores by `Type:id`, auto-propagates updates
- ✅ Cache policies: `cache-first`, `network-only`, `cache-and-network`
- ✅ Migration: `QueryClientProvider` → `ApolloProvider`, zero page changes

**Hour 2 — Architectural Patterns**

- ✅ Feature-based folder structure — co-locate by domain, not file type
- ✅ Layered architecture — UI / data / service, one-directional dependencies
- ✅ Container/Presentational, compound components, hooks as abstraction
- ✅ Micro frontends — team autonomy at deployment boundaries
- ✅ Composition strategies: build-time, Module Federation, iFrame
- ✅ The Employee Directory as a natural MFE extraction point

---

**SPEAKER NOTES**

**What:** Full summary of both hours — engineers self-assess.

**Why it matters:** Reinforces retention across the whole programme. Engineers should be able to explain every item on this list.

**Ask the room:** "Which item from this list would you apply first on your current project? Testing? A11Y? The data layer pattern?"

**Transition:** Homework, then programme wrap-up.

---

## Slide 32: Homework + Programme Wrap-Up

### Homework — Session 4

**Work from `session-4-start`:**

```bash
git checkout session-4-start
npm install @apollo/client graphql
npm run dev
```

**Complete the migration:**

1. Implement `src/lib/apolloClient.ts` — connect to `graphqlzero.almansi.me/api`
2. Define `GET_EMPLOYEES`, `GET_EMPLOYEE`, `CREATE_EMPLOYEE` in `src/graphql/queries.ts`
3. Implement `src/hooks/useEmployeesGQL.ts` — match the `{ data, isLoading, isError }` shape
4. Implement `src/hooks/useEmployeeGQL.ts` — with `skip: id <= 0` and `variables: { id: String(id) }`
5. Swap `App.tsx`: remove `QueryClientProvider`, add `ApolloProvider`
6. Update `EmployeeListPage` and `EmployeeDetailPage` to use the GQL hooks (one import line each)
7. Stretch goal: update `AddEmployeeForm` to use `useMutation` from Apollo instead of `fetch()`

**You're done when:** `npm run dev` shows employee cards from GraphQL · `npm run test:e2e` still passes

---

### Programme Summary — What You've Built

A production-shaped React application covering all four quality dimensions:

| Dimension        | What you built                                               |
| ---------------- | ------------------------------------------------------------ |
| **UI**           | Typed, styled, Storybooked components with semantic HTML     |
| **Data**         | REST → GraphQL migration with zero UI impact                 |
| **Quality**      | Unit tests, E2E tests, accessibility audit                   |
| **Architecture** | Layered structure, feature-based organisation, MFE awareness |

---

**SPEAKER NOTES**

**What:** Final homework and programme summary. Celebrate the achievement — this is a substantial codebase built from scratch in four sessions.

**Why it matters:** Engineers should leave with concrete next steps. The stretch goal (useMutation in the form) is the most advanced piece — it ties GraphQL mutations directly to the form layer.

**Ask the room:** "What would you tackle first if you had to apply these patterns to your current project tomorrow? Start with the one that would have the most immediate impact — often testing or the data layer patterns."

**Transition:** Thank the room. Questions welcome on Slack in #react-training.

---

---

## Appendix: Quick Reference

### Apollo Client API

| API                                    | Purpose                                            |
| -------------------------------------- | -------------------------------------------------- |
| `new ApolloClient({ link, cache })`    | Create the client                                  |
| `new InMemoryCache()`                  | Normalised in-memory cache                         |
| `new HttpLink({ uri })`                | HTTP transport link                                |
| `<ApolloProvider client={...}>`        | Make client available via context                  |
| `useQuery(QUERY, { variables, skip })` | Subscribe to a query                               |
| `useLazyQuery(QUERY)`                  | Returns `[execute, result]` — run on demand        |
| `useMutation(MUTATION)`                | Returns `[mutate, result]` — call explicitly       |
| `useApolloClient()`                    | Access client directly for manual cache operations |
| `refetchQueries: [{ query }]`          | Re-fetch after mutation                            |

### Cache fetch policies

| Policy                  | Use when                                          |
| ----------------------- | ------------------------------------------------- |
| `cache-first` (default) | Stable data — show cache, only fetch if missing   |
| `network-only`          | Must-be-current data — always fetch               |
| `cache-and-network`     | Show immediately + update — best UX for lists     |
| `no-cache`              | Sensitive / ephemeral — fetch always, never store |

### GraphQL operations cheat sheet

```graphql
# Query with variable
query GetEmployee($id: ID!) {
  user(id: $id) {
    name
    email
  }
}

# Mutation with input
mutation CreateEmployee($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    name
  }
}

# Fragment — reusable field selection
fragment EmployeeFields on User {
  id
  name
  email
  company {
    name
  }
}

# Use fragment in query
query GetEmployees {
  users {
    data {
      ...EmployeeFields
    }
  }
}
```

### MFE composition strategies at a glance

| Strategy                 | Independent deploy | Type safety | Complexity |
| ------------------------ | ------------------ | ----------- | ---------- |
| Build-time (npm package) | ❌                 | ✅          | Low        |
| Module Federation        | ✅                 | Partial     | High       |
| iFrame                   | ✅                 | ❌          | Medium     |

### Useful Links

| Topic                           | URL                                                            |
| ------------------------------- | -------------------------------------------------------------- |
| Apollo Client docs              | https://www.apollographql.com/docs/react                       |
| Apollo `useQuery`               | https://www.apollographql.com/docs/react/data/queries          |
| Apollo `useMutation`            | https://www.apollographql.com/docs/react/data/mutations        |
| GraphQLZero API + explorer      | https://graphqlzero.almansi.me/api                             |
| Module Federation (Vite)        | https://github.com/originjs/vite-plugin-federation             |
| Micro Frontends (Martin Fowler) | https://martinfowler.com/articles/micro-frontends.html         |
| React Query vs Apollo           | https://tanstack.com/query/latest/docs/framework/react/graphql |

---

_Session 4 · React Training Programme · 3 August_
