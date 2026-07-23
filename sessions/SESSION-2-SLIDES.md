# React Training — Session 2: State, Data & Forms

### Employee Directory · 24 July

---

## Slide 1: Session 2 — State, Data & Forms

**React Training Programme · Session 2 of 4**
**24 July**

---

### Today's Agenda

|                   |                                                                        |
| ----------------- | ---------------------------------------------------------------------- |
| **Hour 1**        | State Management & Data Fetching                                       |
|                   | Client state vs server state — the mental model                        |
|                   | State patterns: useState, useReducer, Context, Zustand                 |
|                   | TanStack Query — caching, useQuery, useMutation                        |
|                   | Custom hooks for data encapsulation                                    |
|                   | Error and loading state handling                                       |
| ☕ **Break**      | 10 minutes                                                             |
| **Hour 2**        | Forms, Validation & Accessibility                                      |
|                   | React Hook Form — register, handleSubmit, formState                    |
|                   | Zod — why runtime validation matters (and why TypeScript isn't enough) |
|                   | Form accessibility — labels, ARIA, error linking                       |
| ✅ **Checkpoint** | Validated Add Employee form integrated into the directory              |

---

**SPEAKER NOTES**

**What:** Welcome back. Orient the room on what we're covering and where it fits in the programme.

**Why it matters:** Session 2 connects the component knowledge from Session 1 to real data and user input — the two things every production app needs.

**Ask the room:** "Did anyone run the session-2-start branch? Did the employee cards load correctly?"

**Transition:** Let's start with a quick recap of where we left off.

---

## Slide 2: Where We Left Off — Session 1 Recap

**What engineers built in Session 1:**

- `EmployeeCard` — styled, typed, Storybooked presentational component
- `EmployeeList` — responsive grid with empty-state handling (stretch goal)
- `src/types/employee.ts` — the `Employee` interface was pre-populated; engineers imported and used it

**What comes pre-built on `session-2-start`:**

- `src/services/api.ts` — `fetch` wrappers for the JSONPlaceholder REST API
- `src/hooks/useEmployees.ts` / `useEmployee.ts` — TanStack Query hooks
- `EmployeeListPage` / `EmployeeDetailPage` — container pages with loading and error states

**What's already running on `session-2-start`:**

```
npm run dev       → 10 employee cards, click through to detail
npm run storybook → EmployeeCard in the sidebar
```

> The services, hooks, and pages are provided as the starting point for Session 2 — engineers do not need to build them.

---

**SPEAKER NOTES**

**What:** Quick recap so everyone is oriented — what engineers built in Session 1, and what the branch provides as scaffolding.

**Why it matters:** Engineers who didn't finish the homework can still follow along; the pre-built services and hooks mean the app already loads real data. Session 2 adds the form layer on top of that foundation.

**Ask the room:** "Anything from Session 1 you want to revisit before we move on?"

**Transition:** Here's what we're adding today.

---

## Slide 3: What We're Building Today

**Adding the "Add Employee" feature to the directory:**

```
Session 1                          Session 2 (today)
─────────────────────────          ──────────────────────────────────
EmployeeCard        ✅             AddEmployeeForm       ← build today
EmployeeList        ✅             AddEmployeePage       ← build today
EmployeeListPage    ✅             Zod validation schema ← build today
EmployeeDetailPage  ✅             Route + nav link      ← build today
```

**By the end of this session the app will have:**

- A validated "Add Employee" form with real-time error messages
- A route at `/employees/new`
- An "Add Employee" button in the directory header
- A POST request to the API on submit

---

**SPEAKER NOTES**

**What:** Set the concrete goal for the session — engineers know exactly what "done" looks like before we start.

**Why it matters:** Having a clear feature target keeps the concepts grounded. Every concept in Hour 1 and 2 is something they'll use when building the form.

**Ask the room:** "Before we get into theory — has anyone used React Hook Form or Zod before?"

**Transition:** Let's start with the foundations — understanding the two types of state in a React app.

---

---

# HOUR 1

## State Management & Data Fetching

---

## Slide 4: Client State vs Server State — The Mental Model

These are fundamentally different problems. Treating them the same causes unnecessary complexity.

|                   | **Client State**                    | **Server State**                    |
| ----------------- | ----------------------------------- | ----------------------------------- |
| **Lives in**      | The browser only                    | The server                          |
| **Shared?**       | Single user session                 | Across all users                    |
| **Can go stale?** | No                                  | Yes — other users change it         |
| **Async?**        | No                                  | Yes — loading, error, success       |
| **Examples**      | Modal open, form draft, search text | Employee list, user profile, orders |

**The rule:**

- UI state (open/closed, selected tab, input value) → **useState / useReducer**
- Data that comes from a server → **TanStack Query**

> Don't over-engineer. Start with `useState`. Reach for TanStack Query when the data lives on a server.

---

**SPEAKER NOTES**

**What:** The fundamental mental model for state — two categories that need different tools.

**Why it matters:** The most common React architecture mistake is managing server data with `useState` and manual `useEffect` loops. This leads to stale data, inconsistent loading states, and cache management bugs. Understanding this distinction is the single most useful insight in this session.

**Ask the room:** "In your current backend stack, where does session state live vs. data from the database? It's the same split."

**Transition:** Let's look at the full spectrum of client state tools before we get into TanStack Query.

---

## Slide 5: The State Escalation Ladder

Start simple. Escalate only when the current tool can't solve the problem.

```
useState
  ↓ when: multiple related values change together, or next state depends on current
useReducer
  ↓ when: state needs to be shared across components without prop drilling
Context API
  ↓ when: context updates cause too many re-renders, or state is complex + shared globally
Zustand / Jotai / Redux Toolkit
```

**The honest version of when to escalate:**

- `useState` → `useReducer`: when you have 3+ related state updates that logically belong together
- `useReducer` → Context: when a deeply nested component needs the same state as a top-level component
- Context → Zustand: when Context causes performance problems, or the state logic is complex enough to warrant a dedicated store

> Most apps need `useState` + TanStack Query. The rest are available when you genuinely need them.

---

**SPEAKER NOTES**

**What:** The escalation ladder — a decision framework for picking the right state tool.

**Why it matters:** Engineers often jump straight to Redux or Zustand out of habit. This slide establishes that simpler tools should be exhausted first — the same principle as choosing the right data structure in a backend codebase.

**Ask the room:** "What's your current instinct when you need to share state between two components?"

**Transition:** Let's look at useReducer — the first step up from useState.

---

## Slide 6: `useReducer` — When `useState` Isn't Enough

`useReducer` is `useState` with an explicit action model. Use it when multiple state values change in coordinated ways.

```tsx
// ❌ useState — three separate setters, easy to get out of sync
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [data, setData] = useState<Employee | null>(null);

// ✅ useReducer — one dispatch, state always consistent
type State = {
  status: "idle" | "loading" | "success" | "error";
  data: Employee | null;
  error: string | null;
};
type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: Employee }
  | { type: "FETCH_ERROR"; error: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, status: "loading", error: null };
    case "FETCH_SUCCESS":
      return { status: "success", data: action.payload, error: null };
    case "FETCH_ERROR":
      return { ...state, status: "error", error: action.error };
  }
}

const [state, dispatch] = useReducer(reducer, {
  status: "idle",
  data: null,
  error: null,
});
```

> Note: TanStack Query handles exactly this pattern for server data. `useReducer` is for _client-side_ state machines.

---

**SPEAKER NOTES**

**What:** `useReducer` solves the "impossible states" problem — state values that can get out of sync with multiple `useState` calls.

**Why it matters:** The loading/error/data triad is a classic source of bugs. Engineers who've built REST clients in JavaScript will recognise "I set isLoading to false before setting the data and the component flickered." `useReducer` makes that impossible by design.

**Ask the room:** "Has anyone hit a bug where isLoading was false but data was still null? That's the impossible state problem."

**Transition:** `useReducer` scopes state to a component. Context shares it across the tree.

---

## Slide 7: Context API Revisited — Shared State Without Prop Drilling

Context is the right tool for state that multiple components in the tree need, but that doesn't belong to any single component.

```tsx
// Define a typed context
interface AuthContextValue {
  user: User | null;
  signOut: () => void;
}
const AuthContext = React.createContext<AuthContextValue | null>(null);

// Provide it at the app level
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  return (
    <AuthContext.Provider value={{ user, signOut: () => setUser(null) }}>
      {children}
    </AuthContext.Provider>
  );
};

// Consume anywhere in the tree — no prop drilling
const UserMenu = () => {
  const { user, signOut } = useContext(AuthContext)!;
  return <button onClick={signOut}>{user?.name}</button>;
};
```

> In our project: `QueryClientProvider` is context. TanStack Query uses it to share the cache across every component.

---

**SPEAKER NOTES**

**What:** Context provides shared state without prop drilling — useful for auth, theme, locale, and anything truly global.

**Why it matters:** This connects back to Session 1. Engineers now understand _why_ `QueryClientProvider` wraps the whole app — it's using context to share the TanStack Query cache globally.

**Ask the room:** "What other examples of global shared state can you think of in a real app? Auth user, notification toasts, feature flags."

**Transition:** When Context performance becomes a problem, or state logic grows complex, Zustand is the next step.

---

## Slide 8: Zustand — Simpler Global State

Zustand is a minimal state management library. Less boilerplate than Redux, more scalable than Context.

```tsx
import { create } from "zustand";

interface NotificationStore {
  message: string | null;
  showNotification: (msg: string) => void;
  clearNotification: () => void;
}

const useNotificationStore = create<NotificationStore>((set) => ({
  message: null,
  showNotification: (msg) => set({ message: msg }),
  clearNotification: () => set({ message: null }),
}));

// Use directly in any component — no Provider needed
function Toast() {
  const { message, clearNotification } = useNotificationStore();
  if (!message) return null;
  return (
    <div role="alert">
      {message} <button onClick={clearNotification}>✕</button>
    </div>
  );
}
```

**When to reach for Zustand over Context:**

- Context re-renders all consumers on every update; Zustand only re-renders components that read the changed slice
- State logic (actions, derived values) is cleaner in a store than in a Provider component

---

**SPEAKER NOTES**

**What:** Zustand gives you a global store with a clean API — `create()` returns a hook that can be called anywhere without a Provider.

**Why it matters:** Context works well for slowly-changing values (auth, theme). For frequently updating shared state (notifications, shopping cart, UI orchestration), Context's re-render behaviour becomes a problem. Zustand solves this with subscription-based updates.

**Ask the room:** "Notice there's no Provider wrapping the app. Zustand manages its own subscription mechanism outside the React tree. When would you actually use this vs. TanStack Query?"

**Transition:** For server data specifically, TanStack Query is the right tool. Let's dig into how it works.

---

## Slide 9: Why TanStack Query? The Problem It Solves

Managing server data with `useState` + `useEffect` is harder than it looks:

```tsx
// ❌ The naive approach — you're reinventing TanStack Query badly
function EmployeeListPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    getEmployees()
      .then(setEmployees)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, []);
  // No caching, no deduplication, no background refresh,
  // no stale-while-revalidate, no request cancellation...
}
```

**What you get for free with TanStack Query:**

- Automatic caching — same query key = shared data, one network request
- Background refetch — data stays fresh when the window regains focus
- Loading / error / success states — no manual state management
- Request deduplication — two components calling the same query = one fetch
- Stale-while-revalidate — show cached data immediately, update in background

---

**SPEAKER NOTES**

**What:** The "before TanStack Query" picture — shows what you'd have to build yourself.

**Why it matters:** Engineers who've built REST clients will immediately recognise the problems. Every team reinvents a partial version of TanStack Query until they use the real thing.

**Ask the room:** "Has anyone built something like this manually? What went wrong with the cache invalidation?"

**Transition:** Let's look at the key building blocks.

---

## Slide 10: TanStack Query — `QueryClient` and `QueryClientProvider`

Everything flows through a single `QueryClient` instance, shared via context.

```tsx
// src/App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Created OUTSIDE the component — one instance, persists across renders
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EmployeeListPage />} />
          <Route path="/employees/:id" element={<EmployeeDetailPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
```

- `QueryClient` holds the cache — all fetched data lives here
- `QueryClientProvider` makes it available via context to every component below it
- One client per app — not one per component

---

**SPEAKER NOTES**

**What:** The setup is minimal — one client, one provider at the root. This is already done on the session-2-start branch.

**Why it matters:** Engineers can see the direct connection to Session 1's context pattern. `QueryClientProvider` is just React context — TanStack Query built on the same primitive they already know.

**Ask the room:** "Why does `queryClient` need to be outside the `App` function? What would happen if it were inside?"

**Transition:** Now the interesting part — using `useQuery` to fetch data.

---

## Slide 11: `useQuery` — The Core API

```tsx
import { useQuery } from "@tanstack/react-query";

const { data, isLoading, isError, error } = useQuery({
  queryKey: ["employees"], // ← cache key: unique identifier for this data
  queryFn: getEmployees, // ← async function that fetches the data
  staleTime: 5 * 60 * 1000, // ← optional: how long before data is considered stale (ms)
});
```

**The `queryKey` is critical:**

- Same key = shared cache — two components using `["employees"]` share one fetch
- Key changes = new fetch — `["employee", 1]` vs `["employee", 2]` are separate entries
- Arrays allow nesting: `["employee", id]` makes the key reactive to `id`

**What you get back:**
| Property | Meaning |
|---|---|
| `data` | The resolved value, or `undefined` while loading |
| `isLoading` | `true` on the first fetch (no cached data yet) |
| `isFetching` | `true` whenever a fetch is in progress (including background) |
| `isError` | `true` if the last fetch threw |
| `error` | The thrown error object |

---

**SPEAKER NOTES**

**What:** The `useQuery` API — what you call, what you get back.

**Why it matters:** The `queryKey` array is the most important concept. It's the cache key — get it wrong (e.g., a hardcoded string when the ID is dynamic) and you'll fetch the wrong cached data or miss updates.

**Ask the room:** "What happens if two components on the same page both call `useQuery({ queryKey: ['employees'] })`? One network request, two consumers. That's cache deduplication."

**Transition:** Let's look at this in our actual project code.

---

## Slide 12: [LIVE CODE] `useEmployees` — Walking Through the Real Code

> **Trainer:** Open `src/hooks/useEmployees.ts` and `src/services/api.ts`. Walk through the two-layer architecture.

```ts
// src/services/api.ts — pure async functions, no React dependency
import type { Employee } from "../types/employee";

const BASE_URL = "https://jsonplaceholder.typicode.com";

export async function getEmployees(): Promise<Employee[]> {
  const response = await fetch(`${BASE_URL}/users`);
  if (!response.ok) {
    throw new Error(`Failed to fetch employees: ${response.statusText}`);
  }
  return response.json() as Promise<Employee[]>;
}
```

```ts
// src/hooks/useEmployees.ts — thin wrapper, adds caching and state
import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "../services/api";

export function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
  });
}
```

> **Point out:** `api.ts` has no React imports — it's plain TypeScript. This makes it independently testable. The hook is the thin React glue on top.

---

**SPEAKER NOTES**

**What:** Live walkthrough of the two-layer data architecture — service functions separate from React hooks.

**Why it matters:** This is the adapter pattern from Session 1, made concrete. `getEmployees` can be tested in isolation (it's just a function). The hook wraps it with caching behaviour. The page component doesn't know or care how either is implemented.

**Ask the room:** "If we wanted to add retry logic on failure, where would it go? In the hook via `useQuery`'s `retry` option — zero changes to the service function."

**Transition:** Reading data is `useQuery`. Writing data is `useMutation`.

---

## Slide 13: `useMutation` — Writing Data

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();

const { mutate, isPending, isSuccess, isError } = useMutation({
  mutationFn: (newEmployee: EmployeeFormValues) =>
    fetch("https://jsonplaceholder.typicode.com/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEmployee),
    }).then((r) => r.json()),

  onSuccess: () => {
    // Invalidate the employees list so it refetches with the new entry
    queryClient.invalidateQueries({ queryKey: ["employees"] });
  },
});

// Call it from a form submit handler:
mutate({ name: "Alice Smith", email: "alice@example.com", ... });
```

**Key difference from `useQuery`:** mutations don't run automatically — you call `mutate()` explicitly.

---

**SPEAKER NOTES**

**What:** `useMutation` wraps write operations — POST, PUT, DELETE. The `onSuccess` callback is where you invalidate stale queries.

**Why it matters:** `invalidateQueries` is the bridge between writes and reads — it tells TanStack Query "this data is now stale, refetch it." Without it, the list won't update after adding an employee. Engineers from backend land will recognise this as cache invalidation — a solved problem, not boilerplate they have to write.

**Ask the room:** "JSONPlaceholder doesn't actually persist data — it always returns `{ id: 11 }`. That's fine for development. How would you handle optimistic updates in a real app?"

**Transition:** Let's look at loading and error states — the third pillar of robust data fetching.

---

## Slide 14: Loading and Error States as First-Class Concerns

Every data fetch has three possible states. All three need a UI.

```tsx
// src/pages/EmployeeListPage.tsx
const { data: employees, isLoading, isError } = useEmployees();

// ✅ Handle each state explicitly — no blank screens or silent crashes
if (isLoading) {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-500">Loading employees…</p>
    </main>
  );
}

if (isError) {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-red-600">Failed to load employees. Please try again.</p>
    </main>
  );
}

// Only reach here when data is available
return <EmployeeList employees={employees ?? []} ... />;
```

> A blank screen is always worse than an error message. Handle every state.

---

**SPEAKER NOTES**

**What:** The guard-clause pattern for loading and error — handle each state at the top of the component, render the happy path last.

**Why it matters:** This pattern prevents the most common runtime crashes: accessing `.map()` on `undefined` while data is still loading. Engineers from typed backends appreciate that TypeScript's type narrowing also benefits from this — after the `isLoading` guard, `data` is no longer `undefined`.

**Ask the room:** "What happens if you skip the `isLoading` guard and `employees` is `undefined`? `(undefined ?? []).filter(...)` is safe, but `undefined.map(...)` is a crash."

**Transition:** Let's look at the full data layer in our project and then the complete EmployeeListPage live.

---

## Slide 15: In Our Project — The Layered Data Architecture

```
src/services/api.ts          ← pure async functions (no React)
    ↓ imported by
src/hooks/useEmployees.ts    ← TanStack Query wrapper
src/hooks/useEmployee.ts     ← TanStack Query wrapper (single employee)
    ↓ consumed by
src/pages/EmployeeListPage.tsx   ← container: loading/error guards + render
src/pages/EmployeeDetailPage.tsx ← container: loading/error guards + render
    ↓ pass data as props to
src/components/EmployeeList.tsx  ← presentational: pure render
src/components/EmployeeCard.tsx  ← presentational: pure render
```

**Each layer has one job:**

- Service: fetch and return data (testable in isolation, no React)
- Hook: wrap with caching, loading and error state (React-aware)
- Page: consume the hook, handle states, orchestrate layout
- Component: receive props, render UI (no data fetching, no side effects)

---

**SPEAKER NOTES**

**What:** The full architecture visualised — five layers from network to pixel.

**Why it matters:** This is the payoff for all the concepts in Hour 1. Engineers can see how useState, custom hooks, TanStack Query, and component composition all fit together into a coherent, testable architecture.

**Ask the room:** "If you needed to add a 'retry' button on the error state, which layer would you modify? Only the page layer — everything below it is unchanged."

**Transition:** Let's see it working live — open EmployeeListPage and walk through the real code.

---

## Slide 16: [LIVE CODE] `EmployeeListPage` — Real Data, Real States

> **Trainer:** Open `src/pages/EmployeeListPage.tsx`. Walk through the complete implementation.

```tsx
// src/pages/EmployeeListPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEmployees } from "../hooks/useEmployees";
import { EmployeeList } from "../components/EmployeeList";

export function EmployeeListPage() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { data: employees, isLoading, isError } = useEmployees();

  // Client-side filtering — no extra network request needed
  const filtered = (employees ?? []).filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) {
    return (
      <main>
        ...<p>Loading employees…</p>
      </main>
    );
  }
  if (isError) {
    return (
      <main>
        ...<p>Failed to load employees. Please try again.</p>
      </main>
    );
  }

  return (
    <main>
      <input value={search} onChange={(e) => setSearch(e.target.value)} />
      <EmployeeList
        employees={filtered}
        onSelectEmployee={(id) => navigate(`/employees/${id}`)}
      />
    </main>
  );
}
```

> **Point out:** `employees ?? []` — the nullish coalescing handles the brief moment before the guard clauses fire. `search` is client state; `employees` is server state — two different tools.

---

**SPEAKER NOTES**

**What:** Full live walkthrough of the real page. Show the network request in DevTools, the loading state, and what happens when you type in the search box.

**Why it matters:** Engineers see the concepts from Hour 1 in production-quality code. The `search` state vs `employees` state split is the exact client/server state distinction from Slide 4 — make that connection explicitly.

**Ask the room:** "Disconnect from the internet and refresh. What do you see? Cached data appears instantly from TanStack Query's cache, then the background refetch fails and you see the error state."

**Transition:** Before the break, a few patterns to avoid.

---

## Slide 17: Common Data Fetching Pitfalls

**1. Using array index as queryKey:**

```tsx
// ❌ queryKey must uniquely identify the data — index is meaningless
useQuery({ queryKey: [0], queryFn: getEmployees });

// ✅
useQuery({ queryKey: ["employees"], queryFn: getEmployees });
```

**2. Forgetting that queryKey is reactive:**

```tsx
// ❌ Hardcoded ID — won't refetch when the route param changes
useQuery({ queryKey: ["employee"], queryFn: () => getEmployee(id) });

// ✅ Include id in the key — changes when id changes, triggers new fetch
useQuery({
  queryKey: ["employee", id],
  queryFn: () => getEmployee(id),
  enabled: id > 0,
});
```

**3. Putting server state in useState:**

```tsx
// ❌ Manual fetch in useEffect — no caching, no deduplication, stale data
const [employees, setEmployees] = useState([]);
useEffect(() => {
  getEmployees().then(setEmployees);
}, []);
```

**Enable the [TanStack Query Devtools](https://tanstack.com/query/latest/docs/framework/react/devtools) — visualise the cache in the browser.**

---

**SPEAKER NOTES**

**What:** Three antipatterns to watch for in code review.

**Why it matters:** These are the mistakes engineers make in the first week of using TanStack Query. Calling them out now means they recognise them in their own code and in code review.

**Ask the room:** "Has anyone seen the manual useEffect fetch pattern in a production codebase? What went wrong with it?"

**Transition:** That's Hour 1. Time for a break.

---

---

# ☕ BREAK — 10 MINUTES

---

**SPEAKER NOTES**

**What:** 10-minute break.

**Why it matters:** Reset before forms and validation — Hour 2 is dense with practical code.

**Ask the room:** On return: "Any questions on TanStack Query before we move into forms?"

**Transition:** Hour 2 — React Hook Form, Zod, and form accessibility.

---

---

# HOUR 2

## Forms, Validation & Accessibility

---

## Slide 18: Controlled vs Uncontrolled Forms

React has two ways to handle form inputs. The difference matters at scale.

**Controlled (every keystroke updates state):**

```tsx
// ❌ At scale — every keystroke triggers a re-render of the whole form
const [name, setName] = useState("");
const [email, setEmail] = useState("");
return <input value={name} onChange={(e) => setName(e.target.value)} />;
```

**Uncontrolled (React Hook Form's approach):**

```tsx
// ✅ React Hook Form registers inputs and reads values only on submit/validate
// No re-renders on every keystroke — the DOM holds the value
const { register, handleSubmit } = useForm();
return <input {...register("name")} />;
```

**Why it matters at scale:**

- A form with 10 fields and controlled inputs = 10 state updates per keystroke
- React Hook Form: near-zero re-renders during typing
- Validation on blur or on submit — not on every character

> For simple 2-3 field forms, controlled inputs are fine. For complex forms with validation, React Hook Form is worth it.

---

**SPEAKER NOTES**

**What:** The two models for form inputs — controlled (React owns the value) vs uncontrolled (DOM owns the value, React reads on demand).

**Why it matters:** Controlled forms are the React default and work well for small cases. The performance argument for uncontrolled forms only materialises with many fields or frequent validation — which is exactly what our Add Employee form has.

**Ask the room:** "For a single search input like the one on EmployeeListPage, which would you use? Controlled — it's simple and we need the value on every keystroke for filtering."

**Transition:** Let's look at React Hook Form's API.

---

## Slide 19: React Hook Form — The Core API

```tsx
import { useForm } from "react-hook-form";

const {
  register,      // ← connects inputs to the form
  handleSubmit,  // ← wraps your submit handler, runs validation first
  formState: { errors, isSubmitting, isSubmitSuccessful },
  reset,         // ← reset form to initial values
} = useForm<FormValues>();

// Spread register() onto any input
<input id="name" {...register("name")} />

// handleSubmit only calls your function if validation passes
<form onSubmit={handleSubmit(async (data) => {
  await saveEmployee(data); // data is typed as FormValues
})}>

// Error messages come from formState.errors
{errors.name && <p role="alert">{errors.name.message}</p>}
```

**`register()` returns:** `{ name, ref, onChange, onBlur }` — wires the input into the form's state machine without controlled state.

---

**SPEAKER NOTES**

**What:** The three key pieces of the useForm API — register, handleSubmit, formState.

**Why it matters:** `handleSubmit` is doing two things: preventing the default browser submit AND running validation. Engineers who've written form validation manually will appreciate not having to manage that themselves.

**Ask the room:** "What does `handleSubmit` do when validation fails? It calls `event.preventDefault()`, runs the validators, and if any fail it populates `formState.errors` — your submit function is never called."

**Transition:** We have the form wiring — now we need the validation rules. That's where Zod comes in.

---

## Slide 20: [LIVE CODE] Building the `AddEmployeeForm` Skeleton

> **Trainer:** Create `src/components/AddEmployeeForm.tsx` from scratch. Get the form rendering with unvalidated inputs first.

```tsx
// src/components/AddEmployeeForm.tsx — skeleton (no validation yet)
import { useForm } from "react-hook-form";

interface FormValues {
  name: string;
  email: string;
  phone?: string;
  department: string;
}

export function AddEmployeeForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))} noValidate>
      <div>
        <label htmlFor="name">Full Name</label>
        <input id="name" type="text" {...register("name")} />
        {errors.name && <p role="alert">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register("email")} />
        {errors.email && <p role="alert">{errors.email.message}</p>}
      </div>

      <button type="submit">Add Employee</button>
    </form>
  );
}
```

> **Point out:** `noValidate` disables browser-native validation — React Hook Form handles it. `htmlFor`/`id` pairing is non-negotiable for accessibility.

---

**SPEAKER NOTES**

**What:** Live build of the form skeleton — get it rendering before adding validation.

**Why it matters:** Starting without validation shows engineers the form structure first. When we add Zod next, they can see exactly what changes.

**Ask the room:** "Try submitting now — what happens? `console.log(data)` fires immediately because there are no validation rules yet. That changes in the next step."

**Transition:** The form works, but there's no validation. TypeScript alone can't solve this — let's see why.

---

## Slide 21: TypeScript at Runtime — The Gap Zod Fills

**TypeScript is a compile-time tool. It cannot validate user input at runtime.**

```tsx
// TypeScript thinks this is fine:
interface FormValues {
  name: string;
  email: string;
}

const formData: FormValues = {
  name: "", // empty string — TypeScript: ✅  (it IS a string)
  email: "not-valid", // not an email — TypeScript: ✅  (it IS a string)
};
// TypeScript has no concept of "non-empty string" or "valid email format"
```

**What happens in production:**

1. User submits with an empty name field
2. `name` is `""` — TypeScript type is `string` — no compile error
3. Your API receives `{ name: "" }` — server returns a 422 validation error
4. The user sees a generic error, not "Full name is required"

**The gap:** TypeScript validates _shape_ at build time. Zod validates _values_ at runtime. You need both.

---

**SPEAKER NOTES**

**What:** The fundamental limitation of TypeScript for form validation — it checks types, not values.

**Why it matters:** This is the "why Zod" slide. Engineers often ask "if we're using TypeScript, why do we need Zod?" This answers it precisely. TypeScript and Zod are complementary, not redundant.

**Ask the room:** "In your backend services, do you have separate type declarations and runtime validation? DTOs at the boundary vs. type annotations in the code — same principle."

**Transition:** Let's see this live — then we'll add Zod to fix it.

---

## Slide 22: [LIVE CODE] Why TypeScript Isn't Enough — Live Demo

> **Trainer:** Submit the current form with empty fields to show nothing happens yet. Then open `src/schemas/employee.schema.ts`, temporarily add the block below at the bottom of the file, save, and show the console output in the browser.

```tsx
// TypeScript: ✅ (all strings)
// Runtime reality:
const badData = { name: "", email: "notanemail", phone: "abc", department: "" };

// Without Zod — TypeScript can't catch this:
const asTyped: FormValues = badData; // compiles fine

// With Zod — catches at runtime before it reaches the API:
// (add this temporarily to employee.schema.ts to demo, then remove)
const schema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional(),
  department: z.string().min(1, "Department is required"),
});

const result = schema.safeParse(badData);
// result.success = false
// result.error.issues: [
//   { path: ["name"],       message: "Full name is required" },
//   { path: ["email"],      message: "Enter a valid email address" },
//   { path: ["department"], message: "Department is required" },
// ]
```

> `safeParse` — never throws, always returns `{ success, data }` or `{ success, error }`. Use it at boundaries.

---

**SPEAKER NOTES**

**What:** Live demo showing the TypeScript gap, then Zod closing it. Run `safeParse` in the browser console to show the output.

**Why it matters:** Seeing the actual `error.issues` array makes the value concrete. Engineers immediately understand what React Hook Form will do with these — each issue maps to a field error message.

**Ask the room:** "Where else in a frontend codebase would you use `safeParse`? API responses — validate that the server returned the shape you expect, not just that TypeScript compiled."

**Transition:** Let's write the real schema for our form.

---

## Slide 23: Zod Schema — `employee.schema.ts`

> **Trainer:** Create `src/schemas/employee.schema.ts`.

```ts
// src/schemas/employee.schema.ts
import { z } from "zod";

export const employeeFormSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\d\s\-+().]{7,20}$/.test(val),
      "Enter a valid phone number",
    ),
  department: z.string().min(1, "Department is required"),
});

// z.infer derives the TypeScript type FROM the schema
// One source of truth — change the schema, the type updates automatically
export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
```

**`z.infer<typeof schema>` is the bridge:**

- Define the schema once
- TypeScript type is _derived from_ it — not defined separately
- Schema and types can never drift

---

**SPEAKER NOTES**

**What:** The complete project schema — walk through each field and its rules.

**Why it matters:** `z.infer` is the key insight. Engineers who've had to keep a TypeScript interface and a validation library in sync (and watched them drift) immediately appreciate this. One definition, two purposes.

**Ask the room:** "What's the difference between `z.string().optional()` and `z.string().nullable()`? Optional means the field can be absent from the object. Nullable means it can be present but `null`. Different shapes."

**Transition:** Now let's wire this schema into React Hook Form.

---

## Slide 24: [LIVE CODE] Wiring Zod + React Hook Form — `zodResolver`

> **Trainer:** Update `AddEmployeeForm.tsx` to use the schema via `zodResolver`.

```tsx
// src/components/AddEmployeeForm.tsx — with Zod validation
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  employeeFormSchema,
  type EmployeeFormValues,
} from "../schemas/employee.schema";

export function AddEmployeeForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema), // ← the bridge
  });

  async function onSubmit(data: EmployeeFormValues) {
    await fetch("https://jsonplaceholder.typicode.com/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Add employee form"
    >
      {isSubmitSuccessful && (
        <div role="status">Employee added successfully.</div>
      )}
      {/* ... inputs ... */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding…" : "Add Employee"}
      </button>
    </form>
  );
}
```

> `zodResolver` is the adapter — it runs `schema.parse(data)` inside `handleSubmit` and maps Zod errors to RHF's `formState.errors`.

---

**SPEAKER NOTES**

**What:** Live update — add `zodResolver` and see validation fire on submit. Show that TypeScript now infers `EmployeeFormValues` from the schema automatically.

**Why it matters:** `isSubmitting` driving the button disabled state is a small but important UX detail — prevents double-submits. `isSubmitSuccessful` for the success banner is the pattern engineers should use instead of manual success state.

**Ask the room:** "Submit with a valid email but an invalid phone. What happens? Only the phone error shows — field-level, not form-level."

**Transition:** The form validates correctly. Now let's make it accessible.

---

## Slide 25: Form Accessibility — The Fundamentals

Accessible forms require three things: **labels, error association, and keyboard navigation**.

**1. Label association — always use `htmlFor` + `id`:**

```tsx
// ❌ Visual only — screen readers can't associate this label with the input
<div>Full Name</div>
<input type="text" />

// ✅ Programmatic association — screen reader announces "Full Name, edit text"
<label htmlFor="name">Full Name</label>
<input id="name" type="text" {...register("name")} />
```

**2. Required field indication:**

```tsx
// Visually mark required fields AND communicate it to screen readers
<label htmlFor="name">
  Full Name <span aria-hidden="true">*</span>
  <span className="sr-only">(required)</span>
</label>
```

**3. Accessible error messages:**

```tsx
// ❌ Visual only
{
  errors.name && <p style={{ color: "red" }}>{errors.name.message}</p>;
}

// ✅ Announced by screen readers immediately
{
  errors.name && (
    <p role="alert" id="name-error">
      {errors.name.message}
    </p>
  );
}
```

---

**SPEAKER NOTES**

**What:** Three core requirements for accessible forms — label association, required field semantics, and error announcement.

**Why it matters:** Form accessibility is the most impactful a11y work in most web apps — forms are where users interact most. `role="alert"` makes the screen reader announce the error immediately without the user having to navigate to it.

**Ask the room:** "What's the difference between `role='alert'` and `role='status'`? Alert is assertive — announced immediately, interrupts. Status is polite — waits for the user to finish what they're doing."

**Transition:** Two more ARIA attributes complete the accessible form pattern.

---

## Slide 26: `aria-invalid` and `aria-describedby`

Connect the input to its error message so screen readers announce both together.

```tsx
// Complete accessible field pattern:
<div>
  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
    Email <span aria-hidden="true">*</span>
  </label>
  <input
    id="email"
    type="email"
    autoComplete="email"
    aria-invalid={errors.email ? true : undefined} // ← signals invalid state
    aria-describedby={errors.email ? "email-error" : undefined} // ← links to error msg
    className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm
      ${errors.email ? "border-red-500" : "border-gray-300"}`}
    {...register("email")}
  />
  {errors.email && (
    <p id="email-error" role="alert" className="mt-1 text-sm text-red-600">
      {errors.email.message}
    </p>
  )}
</div>
```

**Why `aria-describedby` matters:** when the input is focused, screen readers read: _"Email, edit text, Enter a valid email address"_ — the label and the error together. Without it, users have to navigate away to find the error.

---

**SPEAKER NOTES**

**What:** `aria-invalid` and `aria-describedby` complete the accessible error pattern — connecting input, label, and error message into one accessible unit.

**Why it matters:** This is the pattern that passes WCAG 2.1 SC 3.3.1 (Error Identification). It also improves UX for sighted users — the red border alone isn't enough for colour-blind users.

**Ask the room:** "Why is `aria-invalid={errors.email ? true : undefined}` better than `aria-invalid={!!errors.email}`? Because `aria-invalid='false'` on a valid field is unnecessary noise for screen readers."

**Transition:** Let's apply all of this to the full form.

---

## Slide 27: [LIVE CODE] Making `AddEmployeeForm` Fully Accessible

> **Trainer:** Update the full form with labels, `aria-invalid`, `aria-describedby`, and `role="alert"` on error messages.

```tsx
// Complete accessible input field (repeat pattern for each field):
<div>
  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
    Full Name <span aria-hidden="true">*</span>
  </label>
  <input
    id="name"
    type="text"
    autoComplete="name"
    aria-invalid={errors.name ? true : undefined}
    aria-describedby={errors.name ? "name-error" : undefined}
    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2
               text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    {...register("name")}
  />
  {errors.name && (
    <p id="name-error" role="alert" className="mt-1 text-sm text-red-600">
      {errors.name.message}
    </p>
  )}
</div>
```

> **Show:** Open VoiceOver (macOS: Cmd+F5) or a screen reader. Tab to the email field, submit with an empty value — the error is announced immediately.

---

**SPEAKER NOTES**

**What:** Live implementation of the full accessible form pattern — all fields, all ARIA attributes, success banner.

**Why it matters:** Engineers see accessibility as a concrete, testable set of requirements — not a vague extra. Tab-testing the form takes 30 seconds and immediately reveals missing label associations.

**Ask the room:** "Try tabbing through the form with keyboard only. Can you reach every field and the submit button? If not, something is broken."

**Transition:** Form done. Let's wire it into the app.

---

## Slide 28: In Our Project — `AddEmployeePage` and Routing

> **Trainer:** Create `src/pages/AddEmployeePage.tsx` and update `App.tsx`.

```tsx
// src/pages/AddEmployeePage.tsx
import { useNavigate } from "react-router-dom";
import { AddEmployeeForm } from "../components/AddEmployeeForm";

export function AddEmployeePage() {
  const navigate = useNavigate();
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-indigo-600"
          >
            ← Back to directory
          </button>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">
            Add Employee
          </h1>
        </div>
      </header>
      <div className="max-w-2xl mx-auto px-6 py-8">
        <AddEmployeeForm onSuccess={() => navigate("/")} />
      </div>
    </main>
  );
}
```

```tsx
// src/App.tsx — add the new route
import { AddEmployeePage } from "./pages/AddEmployeePage";

<Route path="/employees/new" element={<AddEmployeePage />} />;
```

---

**SPEAKER NOTES**

**What:** Wrap the form in a page, add the route. Show the full navigation flow: list → Add Employee button → form → success → back to list.

**Why it matters:** Engineers see how the session's pieces connect — the form component, the Zod schema, the page wrapper, and the router all working together.

**Ask the room:** "Where does the `onSuccess` callback pattern come from? It lets the page decide what happens after a successful submit — the form component stays reusable."

**Transition:** One final update — add the "Add Employee" button to the list page.

---

## Slide 29: In Our Project — Updated `EmployeeListPage` Header

> **Trainer:** Add the "Add Employee" navigation link to `EmployeeListPage`.

```tsx
// src/pages/EmployeeListPage.tsx — header update
import { Link } from "react-router-dom";

// Inside the <header> element:
<div className="max-w-5xl mx-auto flex items-center justify-between">
  <h1 className="text-2xl font-bold text-gray-900">Employee Directory</h1>
  <Link
    to="/employees/new"
    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium
               text-white hover:bg-indigo-700 focus:outline-none
               focus:ring-2 focus:ring-indigo-500"
  >
    Add Employee
  </Link>
</div>;
```

> **Use `<Link>` not `<button onClick={navigate}>` for navigation** — `<Link>` renders an `<a>` tag which is keyboard-navigable, right-click-openable, and accessible by default.

---

**SPEAKER NOTES**

**What:** Add the navigation entry point to the list page — the last piece of the feature.

**Why it matters:** The `<Link>` vs `<button>` distinction is a common accessibility mistake. A `<button>` styled to look like a link is semantically wrong — screen readers announce it as a button, not a link. If it navigates, use `<Link>`.

**Ask the room:** "What's the semantic difference between a link and a button? Links navigate; buttons perform actions. Users' mental models and assistive technology depend on this distinction."

**Transition:** Let's look at the final folder structure and wrap up.

---

## Slide 30: In Our Project — Final Folder Structure

After Session 2 homework is complete:

```
src/
├── components/
│   ├── AddEmployeeForm.tsx      ← built today
│   ├── EmployeeCard.tsx
│   ├── EmployeeCard.stories.tsx
│   └── EmployeeList.tsx
├── pages/
│   ├── AddEmployeePage.tsx      ← built today
│   ├── EmployeeListPage.tsx     ← updated (Add Employee button)
│   └── EmployeeDetailPage.tsx
├── hooks/
│   ├── useEmployees.ts
│   └── useEmployee.ts
├── schemas/
│   └── employee.schema.ts      ← built today (Zod schema)
├── services/
│   └── api.ts
└── types/
    └── employee.ts
```

---

**SPEAKER NOTES**

**What:** The complete project structure after Session 2 — what they'll see on the session-3-start branch.

**Why it matters:** Engineers can visualise the growth of the codebase across sessions. Each session adds one coherent slice: forms in Session 2, tests in Session 3, GraphQL in Session 4.

**Ask the room:** "Where would you add a `useAddEmployee` custom hook if you wanted to extract the form submission logic? `src/hooks/` — it wraps `useMutation` the same way `useEmployees` wraps `useQuery`."

**Transition:** Let's wrap up with the checkpoint.

---

---

## Slide 31: Session 2 Checkpoint ✅

**Hour 1 — State Management & Data Fetching**

- ✅ Client state vs server state — two different tools, two different problems
- ✅ State escalation: `useState` → `useReducer` → Context → Zustand
- ✅ TanStack Query: `QueryClient`, `useQuery`, `useMutation`, cache invalidation
- ✅ Layered data architecture: services → hooks → pages → components
- ✅ Loading and error states as explicit, required UI states

**Hour 2 — Forms, Validation & Accessibility**

- ✅ Controlled vs uncontrolled forms — why React Hook Form uses uncontrolled
- ✅ `useForm`, `register`, `handleSubmit`, `formState`
- ✅ TypeScript validates shape; Zod validates values — both are needed
- ✅ `z.infer` — one schema, one source of truth for type and validation
- ✅ `zodResolver` — the bridge between Zod and React Hook Form
- ✅ Accessible forms: `htmlFor`/`id`, `aria-invalid`, `aria-describedby`, `role="alert"`

---

**SPEAKER NOTES**

**What:** Summary of everything covered. Let engineers self-assess.

**Why it matters:** Reinforces retention and surfaces any gaps before homework.

**Ask the room:** "Which concept was most surprising or least familiar? The client/server state split tends to get the strongest reaction."

**Transition:** Here's the homework and a preview of Session 3.

---

## Slide 32: Homework + Session 3 Preview

### Homework — Before Session 3

**Work from `session-2-start`:**

```
git checkout session-2-start
npm install
npm run dev
```

**Build the Add Employee feature:**

1. Create `src/schemas/employee.schema.ts` — define the Zod schema for `name`, `email`, `phone` (optional), and `department`
2. Create `src/components/AddEmployeeForm.tsx` — React Hook Form + `zodResolver`, inline error messages, success banner, disabled submit during submission
3. Create `src/pages/AddEmployeePage.tsx` — page wrapper with heading and back button
4. Update `src/App.tsx` — add the `/employees/new` route
5. Update `EmployeeListPage` — add an "Add Employee" navigation link in the header

**Accessibility requirements:**

- Every input has an associated `<label>` via `htmlFor` / `id`
- Error messages use `role="alert"` and are linked via `aria-describedby`
- Inputs set `aria-invalid` when in an error state

**You're done when:** submitting an empty form shows field-level errors; submitting a valid form shows the success banner; `npm run build` is clean.

---

### Session 3 — Testing & Accessibility

- Testing philosophy: unit → integration → E2E
- React Testing Library: queries, user events, async patterns
- Playwright: E2E basics
- A11Y deep-dive: WCAG, POUR, ARIA, focus management
- Practical walkthrough: write tests for the feature built so far

---

**SPEAKER NOTES**

**What:** Clear homework steps and a preview of Session 3.

**Why it matters:** The stub files on `session-2-start` each contain a TODO comment describing exactly what to build. The slide reinforces the key requirement: accessibility is not optional.

**Ask the room:** "Any questions on the homework? The Zod schema is the hardest part — start there, then the form, then the plumbing."

**Transition:** Thank the room. Session 3 is 29 July. Questions welcome on Slack in #react-training.

---

---

## Appendix: Quick Reference

### TanStack Query at a glance

| API                               | Purpose                                          |
| --------------------------------- | ------------------------------------------------ |
| `QueryClient`                     | The cache — created once, outside React          |
| `QueryClientProvider`             | Makes the cache available via context            |
| `useQuery({ queryKey, queryFn })` | Read data — subscribes to the cache              |
| `useMutation({ mutationFn })`     | Write data — called explicitly via `mutate()`    |
| `queryClient.invalidateQueries`   | Mark data as stale — triggers background refetch |
| `isLoading`                       | `true` on first fetch (no cache yet)             |
| `isFetching`                      | `true` whenever a fetch is in progress           |

### Zod cheat sheet

| Zod API                  | Meaning                                                       |
| ------------------------ | ------------------------------------------------------------- |
| `z.string()`             | Must be a string                                              |
| `.min(1, "msg")`         | Minimum length (catches empty strings)                        |
| `.email("msg")`          | Must be a valid email format                                  |
| `.optional()`            | Field can be absent (undefined)                               |
| `.refine(fn, "msg")`     | Custom validator — runs `fn`, fails if it returns false       |
| `z.infer<typeof schema>` | Derive TypeScript type from schema                            |
| `schema.safeParse(data)` | Validate without throwing — returns `{ success, data/error }` |
| `schema.parse(data)`     | Validate and throw if invalid                                 |

### React Hook Form cheat sheet

| API                            | Purpose                                                         |
| ------------------------------ | --------------------------------------------------------------- |
| `useForm<T>({ resolver })`     | Initialise the form, attach a validation resolver               |
| `register("fieldName")`        | Connect an input to the form                                    |
| `handleSubmit(fn)`             | Wrap submit handler — runs validation, calls `fn` only if valid |
| `formState.errors`             | Object of field errors — `errors.name.message`                  |
| `formState.isSubmitting`       | `true` while submit handler is awaited                          |
| `formState.isSubmitSuccessful` | `true` after a successful submission                            |
| `reset()`                      | Reset all fields to initial values                              |
| `zodResolver(schema)`          | Adapter — runs Zod schema inside `handleSubmit`                 |

### Key files in the repo (after Session 2 homework)

| File                                 | Purpose                                    |
| ------------------------------------ | ------------------------------------------ |
| `src/services/api.ts`                | Pure fetch functions — no React dependency |
| `src/hooks/useEmployees.ts`          | TanStack Query hook — employee list        |
| `src/hooks/useEmployee.ts`           | TanStack Query hook — single employee      |
| `src/schemas/employee.schema.ts`     | Zod schema + inferred TypeScript type      |
| `src/components/AddEmployeeForm.tsx` | RHF + Zod form with accessibility          |
| `src/pages/AddEmployeePage.tsx`      | Page wrapper + routing                     |
| `src/App.tsx`                        | Routes + `QueryClientProvider`             |

---

### Useful Links

| Topic                   | URL                                                             |
| ----------------------- | --------------------------------------------------------------- |
| TanStack Query docs     | https://tanstack.com/query/latest                               |
| TanStack Query Devtools | https://tanstack.com/query/latest/docs/framework/react/devtools |
| Zustand                 | https://github.com/pmndrs/zustand                               |
| React Hook Form         | https://react-hook-form.com/                                    |
| `@hookform/resolvers`   | https://github.com/react-hook-form/resolvers                    |
| Zod                     | https://zod.dev/                                                |

---

_Session 2 · React Training Programme · 24 July_
