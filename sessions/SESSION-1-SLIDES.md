# React Training — Session 1: React Foundations

### Employee Directory · 22 July

---

## Slide 1: Session 1 — React Foundations

**React Training Programme · Session 1 of 4**
**22 July**

---

### Today's Agenda

|                   |                                                     |
| ----------------- | --------------------------------------------------- |
| **Hour 1**        | Core React + TypeScript                             |
|                   | The React ecosystem                                 |
|                   | Components, JSX, props & state                      |
|                   | TypeScript with React                               |
|                   | Core hooks: useState, useEffect, useRef, useContext |
|                   | Performance basics                                  |
| ☕ **Break**      | 10 minutes                                          |
| **Hour 2**        | Styling and Component Architecture                  |
|                   | Styling approaches: inline → CSS Modules → Tailwind |
|                   | Design systems and Storybook                        |
|                   | Component composition and folder structure          |
| ✅ **Checkpoint** | Styled, typed EmployeeCard                          |

---

**SPEAKER NOTES**

**What:** Welcome and orient the room — what we'll cover today, how the session is structured.

**Why it matters:** Engineers know what they're committing to for the next two hours and can see how Session 1 connects to the overall programme.

**Ask the room:** "Quick show of hands — who has written any React at all, even a tutorial? Anyone done Vue or Angular?"

**Transition:** Let's start with the big picture — what React actually is and where it fits.

---

## Slide 2: About This Programme

**4 sessions. One feature. Real code.**

You'll build an **Employee Directory** app — the same repo, extended each session.

| Session       | Focus                                               |
| ------------- | --------------------------------------------------- |
| **1 (today)** | React foundations, TypeScript, Tailwind, Storybook  |
| **2**         | State management, data fetching, forms & validation |
| **3**         | Testing & accessibility                             |
| **4**         | GraphQL, API patterns & architecture                |

**Session 1 (Today) — React Foundations**

- TypeScript & Tailwind
- Storybook
- Core components

**Session 2 — State, Data & Forms**

- State management
- Data fetching
- Forms & validation

**Session 3 — Testing & Accessibility**

- RTL & Playwright
- Testing philosophy
- A11Y & WCAG

**Session 4 — GraphQL, API Patterns & Architecture**

- GraphQL 101
- Apollo Client
- Architectural patterns

**How it works:** Sessions are trainer-led demos. The repo is your homework. Each session has a `session-N-start` branch — that's your starting point.

> The goal is not to make you a frontend developer overnight. It's to make you dangerous enough to contribute to, review, and reason about React codebases.

---

**SPEAKER NOTES**

**What:** Sets expectations about the programme format — it's demo-driven, not a workshop.

**Why it matters:** Experienced engineers know deep specialisation takes time. Framing this as "dangerous enough to contribute" is more honest and more motivating than "become a frontend dev."

**Ask the room:** "Have you cloned the repo yet? Any issues getting it running?"

**Transition:** Before we write any code, let's understand what React actually is — and isn't.

---

## Slide 3: The `session-1-start` Branch

```
src/
├── components/
│   └── EmployeeCard.tsx      ← you'll build this today
├── pages/
│   └── EmployeeListPage.tsx
├── types/
│   └── employee.ts           ← Employee interface already defined
└── App.tsx                   ← routing already wired
```

**What's already done for you:**

- Vite + React + TypeScript scaffold
- Tailwind CSS configured
- Storybook configured
- React Router wired in `App.tsx`

**What you're writing today:** `EmployeeCard.tsx` — a typed, styled, reusable component.

---

**SPEAKER NOTES**

**What:** Orient engineers to the repo structure so they're not lost when they open it later.

**Why it matters:** Experienced engineers appreciate not wasting time on tooling config. The scaffold is set up; they can focus on learning React patterns.

**Ask the room:** "Has anyone used Vite before? It's the modern replacement for create-react-app — much faster."

**Transition:** Let's understand what React is before we touch any code.

---

---

# HOUR 1

## Core React + TypeScript

---

## Slide 4: What Is React?

**A JavaScript library for building user interfaces.**

- Created by Facebook in 2013, maintained by Meta + open source
- **It is a view layer only** — no opinions on routing, data fetching, or state management
- Declarative: you describe _what_ the UI should look like; React handles the DOM
- Component-based: small, encapsulated pieces that compose into full UIs

**What React is NOT:**

- Not a framework (Angular is a framework; React is a library)
- Not full-stack (Next.js wraps React and adds SSR/routing — that's a framework)
- Not magic — it's JavaScript with a thin abstraction over the DOM

> React is the view layer only — like separating presentation from business logic in any layered architecture. It renders UI; separate libraries handle routing, data fetching, and state.

---

**SPEAKER NOTES**

**What:** React is a UI library, not a full framework. It handles rendering only.

**Why it matters:** Engineers often arrive expecting a "full stack JS framework." Clarifying the scope helps them understand why they'll see lots of companion libraries (React Router, TanStack Query, Zod) rather than one giant framework.

**Ask the room:** "Has anyone worked in a project where React was used but something felt wrong architecturally — like too much going on in one component?"

**Transition:** Let's look at how React fits into a typical frontend stack.

---

## Slide 5: The React Ecosystem

```
┌─────────────────────────────────────────────┐
│             YOUR APPLICATION                │
│  Components · JSX · Hooks · State · Props   │
├─────────────────────────────────────────────┤
│             REACT CORE                      │
│  Virtual DOM · Reconciler · Renderer        │
├──────────────┬──────────────┬───────────────┤
│   Routing    │ Data/State   │  Styling      │
│ React Router │ Apollo /     │ Tailwind /    │
│              │ TanStack Q   │ Styled Comp.  │
├──────────────┴──────────────┴───────────────┤
│           BROWSER / NATIVE                  │
└─────────────────────────────────────────────┘
```

**In this project:**

- Routing → React Router v6
- Data → TanStack Query (REST)
- Styling → Tailwind CSS
- Forms → React Hook Form + Zod

---

**SPEAKER NOTES**

**What:** The layered stack shows that React handles rendering; everything else is pluggable.

**Why it matters:** Engineers used to opinionated, batteries-included frameworks (Spring, Rails, Laravel) can find React's "pick your own libraries" model chaotic at first — this diagram shows it's actually structured, just modular.

**Ask the room:** "In your current backend stack, what's the equivalent of each layer here? What handles routing, data access, validation?"

**Transition:** Before we write components, let's quickly orient on where React apps run.

---

## Slide 6: Rendering Types — Brief Awareness

| Type                             | Where it renders       | When to use                                    |
| -------------------------------- | ---------------------- | ---------------------------------------------- |
| **CSR** — Client-Side Rendering  | Browser                | SPAs, internal tools, auth-gated apps          |
| **SSR** — Server-Side Rendering  | Server on each request | SEO-critical, personalised pages               |
| **SSG** — Static Site Generation | Build time             | Marketing sites, docs, rarely-changing content |

**This project uses CSR** — the Vite dev server serves a shell HTML file; React boots in the browser and takes over.

> We won't go deep on SSR/SSG today. If you ever work with Next.js, these become first-class concerns. For now, just know the distinction exists.

---

**SPEAKER NOTES**

**What:** Three rendering strategies exist; this project uses CSR and that's all you need to know today.

**Why it matters:** Engineers may hear "SSR" thrown around and wonder where it fits. A one-line rationale for each:

- **CSR** — the server delivers a near-empty HTML shell; React boots in the browser and renders everything. Zero server rendering cost, but slow first paint and no SEO. Right call for auth-gated internal tools where search indexing is irrelevant.
- **SSR** — the server renders full HTML on every request; the user sees content immediately. Better SEO and faster first paint, but every request hits the server. SSR pages also go through **hydration** — React boots in the browser and attaches event handlers to the server-rendered HTML. You'll hit this term immediately in Next.js, and "hydration errors" are a common gotcha.
- **SSG** — pages are rendered once at build time, served as static files from a CDN. Fastest possible delivery, but content is stale until the next build. Right for docs and marketing sites that rarely change.
- Next.js lets you mix all three per-page — which is the main reason it dominates production React.

**Ask the room:** "Has anyone worked on a project that had SEO requirements that drove architecture decisions?"

**Transition:** Now let's actually write React. Starting with the building block: the component.

---

## Slide 7: Functional Components

A React component is a **function that returns JSX**.

```tsx
// The simplest possible component
function Greeting() {
  return <h1>Hello, world</h1>;
}

// A component with props — the pattern we'll use throughout
function WelcomeCard({ name, role }) {
  return (
    <div className="card">
      <p>Welcome, {name}!</p>
      <p>Role: {role}</p>
    </div>
  );
}

// Usage — props passed down from the parent
<WelcomeCard name="Alice" role="Admin" />;
```

**Rules:**

- Component names must start with a capital letter (`WelcomeCard`, not `welcomeCard`)
- Must return a single root element (or a Fragment `<>...</>`)
- Pure by default — same inputs → same output

> Think of a component as a pure function: given the same props, it always returns the same UI. No hidden state, no side effects in the return value itself.

---

**SPEAKER NOTES**

**What:** Components are functions. That's the whole mental model.

**Why it matters:** Java engineers are used to classes. Functional components feel too simple — "where's the lifecycle? where's the state?" That simplicity is intentional and a feature of modern React.

**Ask the room:** "React used to have class components with lifecycle methods. We won't cover those today — but has anyone seen them in older codebases?"

**Transition:** Components return JSX. Let's look at what JSX actually is.

---

## Slide 8: JSX — Syntax Sugar Over `createElement`

JSX is **not HTML**. It compiles to JavaScript function calls.

```tsx
// What you write:
const el = <h1 className="title">Hello</h1>;

// What the compiler produces:
const el = React.createElement("h1", { className: "title" }, "Hello");
```

**JSX rules:**

- Use `className`, not `class` (it's a JS reserved word)
- All tags must be closed: `<img />` not `<img>`
- Must return a single root — wrap in `<div>` or a Fragment `<></>`
- Expressions go in `{}` — `{employee.name}`, `{2 + 2}`, `{isActive && <Badge />}`

```tsx
// Fragment — no extra DOM node
const Card = () => (
  <>
    <h2>Leanne Graham</h2>
    <p>Romaguera-Crona</p>
  </>
);
```

---

**SPEAKER NOTES**

**What:** JSX is syntactic sugar — it compiles to function calls. It's not a templating language, it's JavaScript.

**Why it matters:** Understanding this removes the "magic" feeling. It also explains why you can use full JavaScript logic inside JSX (`.map()`, ternaries, `&&`) — it's just a function argument.

**Ask the room:** "In server-side templating (Jinja2, Handlebars, ERB), expressions go in special syntax like `{{ }}` or `<%= %>`. JSX uses `{}` for the same purpose — does that feel familiar?"

**Transition:** Let's write our first real component — the EmployeeCard.

---

## Slide 9: [LIVE CODE] First Component — EmployeeCard Skeleton

> **Trainer:** Build this from scratch in `src/components/EmployeeCard.tsx`. Show the file is empty and start typing.

```tsx
// src/components/EmployeeCard.tsx

export function EmployeeCard() {
  return (
    <article>
      <h2>Leanne Graham</h2>
      <p>Romaguera-Crona</p>
      <p>sincere@april.biz</p>
    </article>
  );
}
```

**Then use it in `EmployeeListPage.tsx`:**

```tsx
import { EmployeeCard } from "../components/EmployeeCard";

// Inside the return:
<EmployeeCard />;
```

> **Point out:** hardcoded data is useless. We need props — coming next.

---

**SPEAKER NOTES**

**What:** Live demo — create a minimal component, render it on the page. Deliberately hardcode data first to show why props are needed.

**Why it matters:** The cycle of "write component → see it render → iterate" is the core feedback loop of frontend development. Engineers need to experience it.

**Ask the room:** "What would you need to change to make this component show data for a different employee?"

**Transition:** Props solve the hardcoding problem. Let's add them — and type them properly with TypeScript.

---

## Slide 10: Props — Read-Only Inputs

Props are **function parameters** for components.

```tsx
// Typed props using an interface
interface EmployeeCardProps {
  name: string;
  company: string;
  email: string;
}

function EmployeeCard({ name, company, email }: EmployeeCardProps) {
  return (
    <article>
      <h2>{name}</h2>
      <p>{company}</p>
      <p>{email}</p>
    </article>
  );
}
```

**Key rules:**

- Props flow **one way — down the tree** (parent → child)
- Props are **read-only** — a component never mutates its own props
- Optional props use `?`: `onClick?: () => void`

---

**SPEAKER NOTES**

**What:** Props are typed parameters. One-way data flow is a core React constraint.

**Why it matters:** One-way data flow is what makes React UIs predictable. In two-way binding frameworks (like AngularJS), tracking where a change came from is notoriously hard. React's constraint prevents that class of bugs.

**Ask the room:** "In any HTTP handler, the incoming request is read-only — you receive it, you don't mutate it. One-way data flow in React is the same constraint applied to the UI tree."

**Transition:** We're typing individual props inline. Our project has a richer Employee type. Let's look at TypeScript interfaces properly.

---

## Slide 11: TypeScript with React — Typing Props

**Three approaches, one right answer for components:**

```tsx
// 1. Inline — fine for simple components
const User = ({ name }: { name: string }) => <div>{name}</div>;

// 2. Type alias — common, flexible
type EmployeeCardProps = { name: string; email: string };

// 3. Interface — preferred for component props (extendable)
interface EmployeeCardProps {
  employee: Employee;
  onClick?: () => void; // optional prop
}
```

**When to use which:**

- `interface` for component props and object shapes — it's extendable
- `type` for unions, intersections, and aliases: `type Status = 'active' | 'inactive'`
- Never use `any` — it turns off the type checker

**`React.FC` vs plain destructuring — you'll see both in the wild:**

```tsx
// React.FC<UserProps> — older style, explicit generic
const User: React.FC<UserProps> = ({ username }) => <div>{username}</div>;

// Plain destructuring — preferred in modern React
const User = ({ username }: UserProps) => <div>{username}</div>;
```

Modern React favours plain destructuring — `React.FC` adds little and used to include implicit `children` typing that caused confusion.

> TypeScript interfaces describe shape contracts — any object with the right fields satisfies the interface, regardless of where it was created.

---

**SPEAKER NOTES**

**What:** Three ways to type props; use `interface` for component props as a convention.

**Why it matters:** TypeScript is a major productivity win on large codebases. Type errors at compile time are far cheaper than runtime bugs in production.

**Ask the room:** "In any statically typed language, catching nullability at compile time is far cheaper than a runtime exception in production. TypeScript's `?` and strict null checks give you that safety — what does your current stack use?"

**Transition:** Let's look at the actual Employee type we use in this project.

---

## Slide 12: In Our Project — The `Employee` Interface

> **File:** `src/types/employee.ts`

```ts
export interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
  };
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };
}
```

This type is the **single source of truth** for the Employee shape across the entire app. Every component that deals with an employee imports it.

---

**SPEAKER NOTES**

**What:** The Employee interface is a shared contract — define once, use everywhere.

**Why it matters:** This is the same discipline as a shared type contract or DTO. Define the shape in one place and let the compiler enforce correctness everywhere it's used.

**Ask the room:** "Where do the rest of the fields come from? They're fetched from the JSONPlaceholder REST API using TanStack Query — we'll connect that in Session 2. Today we work with the type."

**Transition:** Now let's update EmployeeCard to accept the full Employee type as a prop.

---

## Slide 13: [LIVE CODE] Typed EmployeeCard Props

> **Trainer:** Update `src/components/EmployeeCard.tsx` to use the `Employee` type.

```tsx
// src/components/EmployeeCard.tsx
import type { Employee } from "../types/employee";

interface EmployeeCardProps {
  employee: Employee;
  onClick?: () => void;
}

export function EmployeeCard({ employee, onClick }: EmployeeCardProps) {
  return (
    <article onClick={onClick}>
      <h2>{employee.name}</h2>
      <p>{employee.company.name}</p>
      <p>{employee.email}</p>
      <p>{employee.phone}</p>
    </article>
  );
}
```

> **Show:** autocomplete on `employee.` — TypeScript gives you the full Employee shape. Delete `email` and show the compiler error.

---

**SPEAKER NOTES**

**What:** Live demo — replace loose string props with a typed Employee object. Show IDE autocomplete and compiler errors.

**Why it matters:** This is the productivity payoff of TypeScript. The compiler catches `employee.emlai` typos that would silently fail at runtime in plain JavaScript.

**Ask the room:** "Do you define shared type contracts for API responses in your current stack? How does your tooling catch shape mismatches at build time rather than runtime?"

**Transition:** Props let us pass data in. State lets components manage data that changes over time.

---

## Slide 14: State — `useState`

State is **data that belongs to a component** and changes over time. When state changes, React re-renders the component.

```tsx
import { useState } from "react";

// useState returns a tuple: [currentValue, setter]
// TypeScript infers the type from the initial value
const [search, setSearch] = useState("");
const [count, setCount] = useState<number>(0);

// Calling the setter triggers a re-render
setSearch("Alice");
```

**Compare to: no state (broken)**

```tsx
// ❌ Direct mutation — React doesn't know to re-render
let search = "";
search = "Alice"; // Nothing updates on screen
```

> Think of state as a signal: when it changes via the setter, React schedules a re-render. Direct variable mutation bypasses the signal entirely — React never sees it.

---

**SPEAKER NOTES**

**What:** `useState` returns a value and a setter. Call the setter to update; React re-renders.

**Why it matters:** The "don't mutate directly" rule is fundamental. React can only track changes it controls — direct variable mutation is invisible to the renderer.

**Ask the room:** "In any event-driven UI framework, you notify the renderer after changing data. The setter IS that notification to React — and it carries the new value, so React knows exactly what changed."

**Transition:** When state changes, React re-renders. Let's look at exactly what that means.

---

## Slide 15: Re-Renders — When and Why

A component re-renders when:

1. **Its own state changes** — `setSearch("Alice")` causes `EmployeeListPage` to re-render
2. **Its parent re-renders** — children re-render by default when a parent does
3. **Context value changes** — anything consuming that context re-renders
4. **A hook's return value changes** — custom hooks are no different

**Re-render cascade — a state change at a parent propagates down to every child:**

```
App                   ✓ re-renders
└── Layout            ✓ re-renders
    └── Header        ✓ re-renders
        └── UserMenu  ✓ re-renders
            └── Avatar  ✓ re-renders
                ↑ state change here
```

```tsx
// src/pages/EmployeeListPage.tsx (simplified)
export function EmployeeListPage() {
  const [search, setSearch] = useState("");

  // Every keystroke sets state → re-renders this component
  // The filtered list recalculates on every render
  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()),
  );
  // ...
}
```

> Re-renders are cheap by design. Don't pre-optimise — measure first.

---

**SPEAKER NOTES**

**What:** Re-renders are the core React update mechanism. They're triggered by state and prop changes.

**Why it matters:** Engineers often hear "too many re-renders" as a performance problem and jump to memoisation immediately. The honest picture is: re-renders are intended and usually fine. We'll cover when to optimise shortly.

**Ask the room:** "How does this compare to dirty-checking or observer patterns in other frameworks you've seen?"

**Transition:** Let's look at the search filter live, then move on to useEffect for side effects.

---

## Slide 16: [LIVE CODE] `useState` — Search Filter

> **Trainer:** Show `src/pages/EmployeeListPage.tsx`. Walk through the search state and filter logic.

```tsx
// src/pages/EmployeeListPage.tsx (core logic)
import { useState } from "react";

export function EmployeeListPage() {
  const [search, setSearch] = useState("");

  const employees = [
    { id: 1, name: "Leanne Graham" /* ... */ },
    { id: 2, name: "Ervin Howell" /* ... */ },
  ];

  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name…"
      />
      {filtered.map((emp) => (
        <EmployeeCard key={emp.id} employee={emp} />
      ))}
    </>
  );
}
```

> **Point out:** `key={emp.id}` on list items — required, must be stable and unique.

---

**SPEAKER NOTES**

**What:** Live walkthrough of controlled input pattern (value + onChange) and filtered list rendering.

**Why it matters:** The controlled input is the React way — the input's value is always driven by state, not the DOM. This is the opposite of jQuery's "read the DOM when you need it" pattern.

**Ask the room:** "What happens if you pass `key={index}` instead of `key={emp.id}` when items can be reordered or removed?"

**Transition:** The live demo just used conditional rendering and `.map()` with keys — let's look at those patterns properly.

---

## Slide 17: Conditional Rendering + Lists

**Conditional rendering:**

```tsx
// Short-circuit — only renders if isLoading is true
{
  isLoading && <p className="text-gray-500">Loading employees…</p>;
}

// Ternary — true/false branch
{
  isError ? (
    <p className="text-red-600">Failed to load.</p>
  ) : (
    <EmployeeList employees={employees} />
  );
}
```

**Lists — always use a stable key:**

```tsx
// ✅ Stable unique ID from the data
{
  employees.map((employee) => (
    <li key={employee.id}>
      <EmployeeCard employee={employee} />
    </li>
  ));
}

// ❌ Array index — breaks if items reorder or delete
{
  employees.map((employee, index) => <li key={index}>...</li>);
}
```

Keys help React identify which items changed, added, or removed — without them, React re-renders the whole list.

---

**SPEAKER NOTES**

**What:** Conditional rendering with `&&` and ternary. Lists require stable `key` props.

**Why it matters:** The `key` prop is one of the most misunderstood concepts in React. Engineers default to array index; explain why that breaks on reorder/delete with a concrete example.

**Ask the room:** "What happens to form input state if you use array index as key and then delete the first item? The second item becomes key=0 and React reuses the old DOM node — form values shift."

**Transition:** State handles synchronous data. For async operations and side effects, we need `useEffect`.

---

---

---

## Slide 18: `useEffect` — Running Side Effects

`useEffect` runs **after the component renders**. Use it for: data fetching, subscriptions, DOM manipulation — anything that isn't pure rendering.

```tsx
import { useEffect, useState } from "react";

useEffect(() => {
  // Runs after every render (no deps array — rarely what you want)
});

useEffect(() => {
  // Runs once — on mount only (empty array)
}, []);

useEffect(() => {
  // Runs when userId changes
  fetchUser(userId);
}, [userId]);
```

**The dependency array controls when the effect re-runs.**
Omit it → runs every render. Empty `[]` → runs once. `[userId]` → runs when `userId` changes.

> Think of the dependency array as "what this effect watches." Empty means "run once, on mount." A value in the array means "re-run whenever that value changes."

⚠️ **Rules of Hooks:**

- Only call hooks at the **top level** — never inside loops, conditions, or nested functions
- Only call hooks from **React function components** or other custom hooks

---

**SPEAKER NOTES**

**What:** `useEffect` is for side effects. The dependency array is the most important thing to get right.

**Why it matters:** Wrong dependency arrays are one of the top sources of React bugs — either effects run too often (performance) or not often enough (stale data). The ESLint `exhaustive-deps` rule catches most mistakes automatically.

**Ask the room:** "Has anyone seen a bug where data didn't refresh when a route parameter changed? That's almost always a missing dependency."

**Transition:** The most critical useEffect pattern is async data fetching with cleanup. Let's look at that properly.

---

## Slide 19: `useEffect` — Async Fetch with Cleanup

Build up the pattern step by step:

**Step 1 — naive async (broken):**

```tsx
// ❌ Runs immediately on every render, outside the component lifecycle
(async () => {
  const res = await fetch(`/api/employees/${id}`);
  setEmployee(await res.json());
})();
```

**Step 2 — inside useEffect (better):**

```tsx
useEffect(() => {
  (async () => {
    const res = await fetch(`/api/employees/${id}`);
    setEmployee(await res.json());
  })();
}, [id]);
```

**Step 3 — with cleanup (correct):**

```tsx
useEffect(() => {
  const controller = new AbortController();

  (async () => {
    const res = await fetch(`/api/employees/${id}`, {
      signal: controller.signal,
    });
    setEmployee(await res.json());
  })();

  return () => controller.abort(); // cancel if id changes or component unmounts
}, [id]);
```

Without cleanup, a fetch that resolves after the component unmounts tries to call `setEmployee` on nothing — a memory leak and a React warning.

> In our project, TanStack Query handles this via `useQuery`. Session 2 covers that in detail.

---

**SPEAKER NOTES**

**What:** The cleanup return function prevents memory leaks from async effects. Walk through the three steps — show why each matters before moving to the next.

**Why it matters:** This is the kind of subtle frontend bug that causes intermittent errors in production. Engineers appreciate knowing the "why" behind the pattern, not just the "what."

**Ask the room:** "Like a destructor or finally block in any language, the cleanup function ensures resources are released regardless of why the component stopped rendering — does that framing help?"

**Transition:** `useRef` is another escape hatch — for when you need to interact with the DOM directly.

---

## Slide 20: `useRef` — Escape the Render Cycle

`useRef` gives you a **mutable object that persists across renders** without triggering a re-render.

**Use case 1: DOM access**

```tsx
import { useRef, useEffect } from "react";

function SearchInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus(); // Focus the input on mount
  }, []);

  return <input ref={inputRef} placeholder="Search…" />;
}
```

**Use case 2: Storing a value that shouldn't trigger re-renders**

```tsx
const renderCount = useRef(0);
renderCount.current += 1; // Increments without causing a re-render
```

> Reach for `useRef` when you need "imperative escape hatch" — timers, focus, scroll position, third-party library integration.

---

**SPEAKER NOTES**

**What:** `useRef` creates a stable mutable reference. Mutations to `.current` don't trigger re-renders.

**Why it matters:** It's the "last resort" for DOM manipulation — exactly what direct DOM access is in most frameworks. React encourages declarative code; `useRef` is for when the DOM absolutely must be touched imperatively.

**Ask the room:** "When might you need to call `.focus()` programmatically? Form error handling — when a validation error fires, auto-focus the first invalid field."

**Transition:** `useContext` solves a different problem — sharing state across the component tree without passing props at every level.

---

## Slide 21: `useContext` — Avoiding Prop Drilling

**Prop drilling:** passing a prop through many levels just to reach a deeply nested child.

```tsx
// ❌ Prop drilling — theme passed through components that don't use it
<App theme="dark">
  <Layout theme="dark">
    <Sidebar theme="dark">
      <Button theme="dark" /> {/* only this needs it */}
    </Sidebar>
  </Layout>
</App>
```

```tsx
// ✅ Context — Button reads directly from context
const ThemeContext = React.createContext<"light" | "dark">("light");

const App = () => (
  <ThemeContext.Provider value="dark">
    <Layout /> {/* no theme prop needed */}
  </ThemeContext.Provider>
);

const Button = () => {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Click</button>;
};
```

---

**SPEAKER NOTES**

**What:** Context provides a way to share values between components without prop drilling.

**Why it matters:** Prop drilling is a genuine pain point in large React trees. Context is the built-in solution; for complex global state there are libraries (Zustand, Redux), but context covers most intra-feature cases.

**Ask the room:** "What does Session 2 use as its context wrapper? `QueryClientProvider` in `App.tsx` — that's context. TanStack Query uses it to make the client cache available to every component."

**Transition:** Hooks can be composed. Let's look at custom hooks — the pattern that makes React logic truly reusable.

---

## Slide 22: Custom Hooks — Extracting Reusable Logic

A custom hook is a **function prefixed with `use`** that can call other hooks.

```tsx
// Extract data-fetching logic from the component
export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/employees")
      .then((r) => r.json())
      .then((data) => {
        setEmployees(data);
        setIsLoading(false);
      });
  }, []);

  return { employees, isLoading };
}

// Component is now clean — no data-fetching logic in JSX
function EmployeeListPage() {
  const { employees, isLoading } = useEmployees();
  if (isLoading) return <p>Loading…</p>;
  return <EmployeeList employees={employees} />;
}
```

---

**SPEAKER NOTES**

**What:** Custom hooks extract logic into reusable functions — just like extracting a service layer in any layered architecture.

**Why it matters:** The separation of data-fetching from rendering is the single most impactful architecture pattern in React. It makes components readable and logic testable in isolation.

**Ask the room:** "In any layered architecture, you'd extract business logic into a service. Custom hooks are the exact same pattern — thin views, fat logic."

**Transition:** In our project, we have this exact pattern. Let's look at it.

---

## Slide 23: In Our Project — `useEmployees`

> **File:** `src/hooks/useEmployees.ts`

```ts
import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "../services/api";

// queryKey uniquely identifies this query in TanStack Query's cache.
// Any component that calls useEmployees() shares the same cached data.
export function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
  });
}
```

- Wraps TanStack Query's `useQuery` — caching, loading and error states for free
- Components see a clean `{ data, isLoading, isError }` interface
- Swappable — `EmployeeListPage` doesn't know or care how the data is fetched

> Session 2 covers TanStack Query in full — the cache model, mutations, and error handling.

---

**SPEAKER NOTES**

**What:** Shows the real custom hook in the codebase — wraps TanStack Query's `useQuery` and exposes a clean interface to the component.

**Why it matters:** The `{ data, isLoading, isError }` shape is a stable contract. Swap the fetching implementation (REST today, GraphQL in Session 4) and the page component doesn't change at all. That's the adapter pattern in practice.

**Ask the room:** "What would you need to change in `EmployeeListPage` if you swapped `getEmployees` for a GraphQL query? Nothing — only the hook internals change."

**Transition:** We've covered hooks. Before we break, let's look at performance — when and how to optimise re-renders.

---

## Slide 24: Performance Basics — When Re-Renders Become a Problem

**Most of the time, re-renders are fine. Optimise when you measure a real problem.**

Common real scenarios:

- A list of 1000+ items re-renders on every keystroke
- A child component does expensive computation on every parent render
- A function prop causes a memoised child to re-render unnecessarily

**The three tools:**

| Tool            | What it does                                               |
| --------------- | ---------------------------------------------------------- |
| `React.memo()`  | Skip re-rendering a component if its props haven't changed |
| `useMemo()`     | Cache the result of an expensive computation               |
| `useCallback()` | Stabilise a function reference passed as a prop            |

> Rule of thumb: if you can't feel the lag, you don't need memoisation. Profile with React DevTools first.

---

**SPEAKER NOTES**

**What:** Memoisation tools exist for performance. Don't reach for them by default.

**Why it matters:** Premature optimisation is as real in React as in any other system. Over-memoising adds complexity without benefit. Engineers from performance-critical backends are especially prone to this.

**Ask the room:** "Profile before optimising — React DevTools Profiler gives you per-component render timing. Has anyone used it?"

**Transition:** Let's look at each tool briefly.

---

## Slide 25: `React.memo`, `useMemo`, `useCallback`

```tsx
// React.memo: skip re-render if props are the same (shallow compare)
const EmployeeCard = React.memo(function EmployeeCard({ employee, onClick }) {
  return <article>...</article>;
});

// useMemo: cache expensive computation
const filtered = useMemo(
  () => employees.filter((e) => e.name.includes(search)),
  [employees, search], // recompute only when these change
);

// useCallback: stable function reference (crucial when passing to memo'd children)
// ❌ New function created every render — breaks React.memo on EmployeeCard
<EmployeeCard onClick={() => navigate(`/employees/${id}`)} />;

// ✅ Stable reference
const handleClick = useCallback(
  () => navigate(`/employees/${id}`),
  [navigate, id],
);
<EmployeeCard onClick={handleClick} />;
```

---

**SPEAKER NOTES**

**What:** Three memoisation tools. `React.memo` wraps components; `useMemo` / `useCallback` stabilise values inside a component.

**Why it matters:** The inline-function-as-prop anti-pattern is extremely common. Engineers need to see the before/after to understand _why_ it breaks `React.memo`.

**Ask the room:** "If React.memo does a shallow comparison of props, what happens when the prop is an object created inline like `style={{ color: 'red' }}`? It breaks memo — same issue."

**Transition:** One more performance technique before the break — code splitting for initial load time.

---

## Slide 26: Lazy Loading + `Suspense`

Split your bundle at the route level so users only download code they need.

```tsx
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Each page is a separate chunk — not in the initial bundle
const EmployeeListPage = lazy(() => import("./pages/EmployeeListPage"));
const EmployeeDetailPage = lazy(() => import("./pages/EmployeeDetailPage"));
const AddEmployeePage = lazy(() => import("./pages/AddEmployeePage"));

function App() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <Routes>
        <Route path="/" element={<EmployeeListPage />} />
        <Route path="/employees/:id" element={<EmployeeDetailPage />} />
        <Route path="/employees/new" element={<AddEmployeePage />} />
      </Routes>
    </Suspense>
  );
}
```

> Start with route-level splitting — biggest impact, lowest effort. Component-level splitting is rarely worth it.

---

**SPEAKER NOTES**

**What:** `lazy()` + `Suspense` defer loading a module until it's needed. `Suspense` handles the loading state.

**Why it matters:** Initial bundle size directly affects time-to-interactive. This is especially noticeable on mobile networks. Route-level splitting is a one-time, low-risk win.

**Ask the room:** "Server-side module boundaries work on the same principle — only load what's needed, when it's needed. Route-level splitting is the frontend equivalent."

**Transition:** Before the break, let's cover the most common React mistakes to watch for in code review.

---

## Slide 27: Common Pitfalls — Avoid These

**Prop drilling:**

```tsx
// ❌ Passing userId through 5 layers to reach a button
// ✅ Use context or lift state to the nearest common ancestor
```

**Inline functions as props (breaks memo):**

```tsx
// ❌ New function instance every render
<EmployeeCard onClick={() => onSelectEmployee(employee.id)} />;

// ✅ Stable reference (or accept the re-render if perf isn't an issue)
const handleClick = useCallback(
  () => onSelectEmployee(employee.id),
  [employee.id],
);
```

**Missing useEffect dependencies:**

```tsx
// ❌ Stale closure — userId changes but effect doesn't re-run
useEffect(() => {
  fetchUser(userId);
}, []);

// ✅ Declare the dependency
useEffect(() => {
  fetchUser(userId);
}, [userId]);
```

**Enable the ESLint `react-hooks/exhaustive-deps` rule — it catches #3 automatically.**

---

**SPEAKER NOTES**

**What:** Three of the most common React mistakes and their fixes.

**Why it matters:** Engineers will encounter all three in production codebases within their first month of React work. Knowing the anti-pattern by name helps them spot it in code review.

**Ask the room:** "Has anyone already spotted any of these patterns in the repo? The inline onClick in EmployeeList — `() => onSelectEmployee(employee.id)` — is that a problem?"

**Transition:** That's Hour 1 done. Time for a break.

---

---

---

# ☕ BREAK — 10 MINUTES

---

**SPEAKER NOTES**

**What:** 10-minute break.

**Why it matters:** Reset before the styling and architecture section.

**Ask the room:** On return: "Any questions from Hour 1 before we move into styling?"

**Transition:** Hour 2 — styling approaches and component architecture.

---

---

# HOUR 2

## Styling and Component Architecture

---

## Slide 28: The Styling Spectrum

Five approaches — each with real trade-offs:

| Approach          | Scoping        | Colocation | Theming   | Best for               |
| ----------------- | -------------- | ---------- | --------- | ---------------------- |
| Inline styles     | ✅ Component   | ✅ Yes     | ❌ Poor   | Dynamic one-off values |
| Global CSS        | ❌ None        | ❌ No      | ✅ OK     | Legacy apps, resets    |
| CSS Modules       | ✅ File-scoped | ✅ Yes     | ✅ OK     | Moderate-size apps     |
| Styled Components | ✅ Component   | ✅ Yes     | ✅ Strong | Design systems         |
| **Tailwind CSS**  | ✅ Component   | ✅ Yes     | ✅ Strong | **This project**       |

> There is no universally correct answer. The right choice depends on team size, design system maturity, and whether you have a designer in the loop.

---

**SPEAKER NOTES**

**What:** Five styling approaches, each with different trade-off profiles.

**Why it matters:** Engineers joining frontend teams will encounter all five. Understanding the trade-offs helps them evaluate and contribute to architectural decisions rather than just following cargo-cult conventions.

**Ask the room:** "Have you heard strong opinions about CSS-in-JS vs. utility-first? What was the argument?"

**Transition:** Let's walk through each briefly before landing on Tailwind — which is what this project uses.

---

## Slide 29: Inline Styles — and Their Limits

```tsx
// Fine for dynamic values — logic that CSS can't express
const badge = (active: boolean) => ({
  color: active ? "#16a34a" : "#6b7280",
  fontWeight: 600,
});

return <span style={badge(employee.isActive)}>{employee.name}</span>;
```

**Limitations:**

- No pseudo-classes (`:hover`, `:focus`) — you'd need `onMouseEnter` state
- No media queries — responsive design requires JS
- No design tokens — magic numbers scattered everywhere
- Verbose for anything beyond simple cases

> Inline styles have a place for **dynamic, computed values**. They are not a general styling solution.

---

**SPEAKER NOTES**

**What:** Inline styles are JavaScript objects. Fine for computed values, not for general layout and design.

**Why it matters:** Engineers instinctively reach for inline styles because it feels "clean" (no CSS file to manage). Show them the walls they'll hit quickly.

**Ask the room:** "How would you implement a hover effect with inline styles? You'd need a `useState(false)` for `isHovered`. Tailwind solves this with `hover:` prefix — zero JS."

**Transition:** CSS Modules give you scoping without the limitations of inline styles.

---

## Slide 30: CSS Modules — Scoped Class Names

```css
/* EmployeeCard.module.css */
.card {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
}
.card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

```tsx
// EmployeeCard.tsx
import styles from "./EmployeeCard.module.css";

export function EmployeeCard({ employee }: EmployeeCardProps) {
  return (
    <article className={styles.card}>
      <h2>{employee.name}</h2>
    </article>
  );
}
```

**How it works:** The build tool rewrites `.card` to a unique class like `.EmployeeCard_card_3x2f`. No global collisions, full CSS feature support, zero runtime cost.

---

**SPEAKER NOTES**

**What:** CSS Modules are local by default — the build step ensures class names are unique per file.

**Why it matters:** CSS has global scope by default, which causes "this change broke something I didn't touch" bugs at scale. CSS Modules fix this with no runtime overhead.

**Ask the room:** "CSS global scope is like putting all your code in one namespace with no visibility rules. CSS Modules scope class names to the file — like module-level visibility in any language."

**Transition:** Tailwind takes a different approach — no CSS file at all.

---

## Slide 31: Tailwind CSS — Utility-First

Tailwind provides **pre-defined utility classes** — you compose design directly in JSX.

```tsx
// Before Tailwind: write CSS, name classes, context-switch
<article className="card">...</article>

// With Tailwind: compose design in JSX, no CSS file needed
<article className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md">
  ...
</article>
```

**The trade-offs honestly:**

| Pro                                           | Con                                           |
| --------------------------------------------- | --------------------------------------------- |
| No naming CSS classes                         | Long class strings in JSX                     |
| Design constraints built in (scale)           | Requires learning the utility names           |
| No dead CSS — unused utilities are purged     | Non-trivial dynamic styles need `cn()` helper |
| Responsive + pseudo-classes (`hover:`, `sm:`) | Looks noisy until you're fluent               |

> Teams either love it or hate it. After a week, most engineers stop thinking about it.

---

**SPEAKER NOTES**

**What:** Tailwind replaces the CSS authoring step with composable utility classes in JSX.

**Why it matters:** Tailwind has become dominant in new React projects. Understanding its model is practically necessary for modern frontend work.

**Ask the room:** "Initial reaction? The class strings do look verbose. What are you trading away in exchange for that verbosity?"

**Transition:** Let's apply Tailwind to EmployeeCard in a live demo.

---

## Slide 32: [LIVE CODE] Styling EmployeeCard with Tailwind

> **Trainer:** Style the EmployeeCard skeleton using Tailwind. This is the target — the component that already exists in the repo.

```tsx
// src/components/EmployeeCard.tsx
import type { Employee } from "../types/employee";

interface EmployeeCardProps {
  employee: Employee;
  onClick?: () => void;
}

export function EmployeeCard({ employee, onClick }: EmployeeCardProps) {
  return (
    <article
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div>
        <h2 className="text-base font-semibold text-gray-900">
          {employee.name}
        </h2>
        <p className="text-sm text-indigo-600 mt-0.5">
          {employee.company.name}
        </p>
      </div>

      <dl className="mt-4 space-y-1">
        <div>
          <dt className="sr-only">Email</dt>
          <dd className="text-sm text-gray-600">{employee.email}</dd>
        </div>
        <div>
          <dt className="sr-only">Phone</dt>
          <dd className="text-sm text-gray-600">{employee.phone}</dd>
        </div>
      </dl>
    </article>
  );
}
```

---

**SPEAKER NOTES**

**What:** Live demo — apply the full Tailwind styling to EmployeeCard, arriving at the repo's actual implementation.

**Why it matters:** Engineers see Tailwind in practice, not just description. The `sr-only` class is worth calling out — it hides the `<dt>` label visually but keeps it for screen readers. Accessibility built into the utility library.

**Ask the room:** "What does `hover:shadow-md` expand to in CSS? It's a conditional class — only applies on hover. No JS, no state, no event handlers."

**Transition:** Those utility classes come from a design system — let's look at what that means.

---

## Slide 33: Design System Fundamentals

A design system is a **set of decisions codified as reusable constraints**.

**Core concepts:**

- **Tokens** — named values for spacing, colour, typography: `gray-900`, `indigo-600`, `text-sm`
- **Primitives** — base components that implement tokens: `Button`, `Badge`, `Card`
- **Consistency** — every engineer picks from the same palette; no magic hex values
- **Tailwind as a lightweight design system** — the scale is the token set

```js
// tailwind.config.js — you can extend the default token set
export default {
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#4f46e5", hover: "#4338ca" },
      },
    },
  },
};
```

> Notice `indigo-600` used consistently throughout the project — links, buttons, focus rings. That's intentional token discipline.

---

**SPEAKER NOTES**

**What:** A design system is constraints-as-code. Tailwind's built-in scale is a good-enough design system for most internal tools.

**Why it matters:** Without a token system, engineers and designers pick arbitrary values and the UI becomes visually inconsistent. This is the frontend equivalent of magic strings vs. constants.

**Ask the room:** "In any codebase, you'd extract magic strings into a constants file. What's the CSS equivalent of a magic `#4f46e5` scattered across 30 files?"

**Transition:** Let's look at how Storybook fits into this — it's where you document and test components in isolation.

---

## Slide 34: In Our Project — Tailwind Tokens in Practice

> Consistent token use across `src/` — no arbitrary hex values:

| Token        | Meaning         | Where used                          |
| ------------ | --------------- | ----------------------------------- |
| `indigo-600` | Brand primary   | Links, buttons, focus rings, labels |
| `gray-900`   | Primary text    | Headings, important content         |
| `gray-600`   | Secondary text  | Body copy, metadata                 |
| `gray-200`   | Borders         | Cards, inputs, dividers             |
| `gray-50`    | Page background | `main` elements                     |

```tsx
// EmployeeListPage.tsx header
<Link
  className="rounded-md bg-indigo-600 px-4 py-2 text-sm
                 font-medium text-white hover:bg-indigo-700
                 focus:ring-2 focus:ring-indigo-500"
>
  Add Employee
</Link>
```

Every interactive element uses the same `indigo` scale — instantly recognisable as interactive.

---

**SPEAKER NOTES**

**What:** A specific example of token discipline in the actual codebase.

**Why it matters:** Engineers can audit this in the repo. It shows that "design system" isn't just a design team concept — it's enforced by engineers choosing tokens consistently.

**Ask the room:** "If a designer said 'make the button blue', what's the wrong way and the right way to implement that change? Wrong: add `color: #0000FF`. Right: update the token, propagate everywhere."

**Transition:** Storybook is where these components are documented and developed in isolation.

---

## Slide 35: What Is Storybook?

**Storybook is a workshop for UI components** — develop and document them in isolation, outside the running app.

**Why teams use it:**

- Develop components without needing a live backend or auth flow
- Visual test all component states (empty, loading, error, populated)
- Auto-generates documentation from TypeScript types and JSDoc
- Shareable component library — designers and other engineers can browse

**A story = a named component state:**

```tsx
// One story = one visual state of the component
export const Default: Story = {
  args: { employee: sampleEmployee },
};

export const WithClickHandler: Story = {
  args: { employee: sampleEmployee, onClick: () => {} },
};
```

> Think of it as a living style guide that can't go stale — it's in the codebase.

---

**SPEAKER NOTES**

**What:** Storybook isolates components so they can be developed and reviewed without the full app.

**Why it matters:** Backend engineers often have to spin up the full app to see a UI component. Storybook removes that dependency. It's also the primary tool designers use to review implementations.

**Ask the room:** "How do you currently test UI changes in your backend services? Do you have a staging environment? Storybook is similar — but for individual components, not full environments."

**Transition:** Let's look at the EmployeeCard story in the project.

---

## Slide 36: [LIVE CODE] `EmployeeCard.stories.tsx`

> **Trainer:** Open `src/components/EmployeeCard.stories.tsx` in the browser via Storybook. Show the Default and WithClickHandler stories.

```tsx
// src/components/EmployeeCard.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { EmployeeCard } from "./EmployeeCard";

const meta: Meta<typeof EmployeeCard> = {
  title: "Components/EmployeeCard",
  component: EmployeeCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof EmployeeCard>;

const sampleEmployee = {
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

export const Default: Story = {
  args: {
    employee: sampleEmployee,
  },
};

export const WithClickHandler: Story = {
  args: {
    employee: sampleEmployee,
    onClick: () => console.log("Card clicked"),
  },
};
```

---

**SPEAKER NOTES**

**What:** Live walkthrough of a real story file. Show the Storybook UI — the Docs tab generated by `autodocs`, the Controls panel, the interactive args.

**Why it matters:** Engineers see the full story authoring cycle: define component → write story → Storybook renders it with live controls. This is how component iteration should work.

**Ask the room:** "Notice we're importing the real `EmployeeCard` with the real `Employee` type. What happens in Storybook's Controls panel if you change `employee.name`?"

**Transition:** Now that we have a styled, documented component, let's look at how components compose and how to organise them.

---

## Slide 37: In Our Project — Storybook Autodocs

The `tags: ["autodocs"]` annotation in the story meta generates a full docs page automatically:

- **Props table** — generated from `EmployeeCardProps` TypeScript interface
- **Interactive controls** — each prop editable in the browser
- **Story variants** — Default and WithClickHandler rendered side-by-side
- **Code snippets** — copy-pasteable JSX for each story

Run Storybook: `npm run storybook`

> Autodocs means the documentation is always in sync with the component interface — it can't drift because it's derived from the types.

---

**SPEAKER NOTES**

**What:** The autodocs feature generates living documentation from TypeScript types and stories.

**Why it matters:** Written documentation goes stale. Type-derived documentation cannot — the types are the source of truth. This is the same principle as OpenAPI spec-first API design.

**Ask the room:** "How do you document your API contracts today? OpenAPI? Autodocs is the same concept for UI components — specification-derived, always in sync."

**Transition:** Storybook works best when components are well-composed and have clear responsibilities. Let's look at component architecture.

---

## Slide 38: Component Composition

**Favour composition over inheritance** — a principle that applies in any object-oriented system.

```tsx
// ❌ One bloated component doing everything
function EmployeePage({ id }: { id: number }) {
  // fetches data, handles loading/error, renders header,
  // renders list, handles search, manages navigation — 300 lines
}

// ✅ Each component has one job
function EmployeeDetailPage() {
  // orchestrates
  const { data, isLoading } = useEmployee(id);
  return <EmployeeProfile employee={data} />;
}

function EmployeeProfile({ employee }: { employee: Employee }) {
  // pure render — just display, no data fetching
  return <article>...</article>;
}
```

**The rule:** if you can't describe a component's job in one sentence, it needs splitting.

---

**SPEAKER NOTES**

**What:** Composition — many small, focused components — over monolithic components.

**Why it matters:** Large components are God classes. They're hard to test, hard to reuse, and hard to read. The same discipline that keeps service layers clean applies here.

**Ask the room:** "What's the equivalent of a God class in React? A 500-line component that fetches data, manages a form, handles routing, and renders everything. How do you recognise one?"

**Transition:** Composition leads naturally to a clear separation between components that fetch data and components that display it.

---

## Slide 39: Container vs. Presentational Components

**A pattern that maps directly to layered architecture:**

| Container (Smart)         | Presentational (Dumb)                |
| ------------------------- | ------------------------------------ |
| Knows about data sources  | Receives data via props              |
| Calls hooks, fetches data | Pure render — no side effects        |
| Not easily reusable       | Highly reusable                      |
| Hard to unit-test         | Trivial to unit-test (and Storybook) |

```
EmployeeListPage (container)
  ↓ passes employees[]
EmployeeList (container-ish)
  ↓ passes employee
EmployeeCard (presentational) ← pure, testable, Storybook-able
```

> `EmployeeCard` is a perfect presentational component — it receives an `Employee` prop and renders it. No hooks, no data fetching, no side effects.

---

**SPEAKER NOTES**

**What:** The smart/dumb component split. Smart components fetch and orchestrate; dumb components just render.

**Why it matters:** Presentational components are trivially testable and reusable. Isolating data-fetching into container layers makes the fetching logic independently testable too (via custom hooks).

**Ask the room:** "Think about a layered server-side architecture: handler → service → data access. Is the container/presentational split analogous? What maps to what?"

**Transition:** How should we structure files and folders to support this pattern?

---

## Slide 40: Folder Structure

```
src/
├── components/         # Shared presentational components
│   ├── EmployeeCard.tsx
│   ├── EmployeeCard.stories.tsx
│   └── EmployeeList.tsx
├── pages/              # Route-level container components
│   ├── EmployeeListPage.tsx
│   └── EmployeeDetailPage.tsx
├── hooks/              # Custom hooks (shared data/logic)
│   ├── useEmployees.ts
│   └── useEmployee.ts
├── services/           # API layer
│   └── api.ts
└── types/              # Shared TypeScript types
    └── employee.ts
```

**Naming conventions:**

- Components: `PascalCase` — `EmployeeCard`, `EmployeeList`
- Hooks: `camelCase` prefixed with `use` — `useEmployees`, `useEmployee`
- Files: match the named export — `EmployeeCard.tsx`, `useEmployees.ts`
- Types/interfaces: `PascalCase` — `Employee`, `EmployeeCardProps`

> Structure reflects responsibility. `pages/` = containers. `components/` = presentational. `hooks/` = reusable logic. `types/` = contracts.

---

**SPEAKER NOTES**

**What:** The project's actual folder structure and the reasoning behind it.

**Why it matters:** Consistency in folder structure is a team-level agreement. Engineers who understand the "why" enforce it in code review; engineers who only know the "what" break it.

**Ask the room:** "If you added a reusable search input component, where does it go? `src/components/`. If you added a custom hook for debounced input, where? `src/hooks/`."

**Transition:** Let's see how the components in our project fit together as a system.

---

## Slide 41: In Our Project — Component Hierarchy

```
App.tsx
└── QueryClientProvider (TanStack Query context)
    └── BrowserRouter (routing context)
        └── Routes
            ├── / → EmployeeListPage (container)
            │         ├── useEmployees()  ← TanStack Query hook
            │         └── EmployeeList (presentational)
            │               └── EmployeeCard (presentational) ← Session 1 target
            │
            └── /employees/:id → EmployeeDetailPage (container)
                                    └── useEmployee(id)
```

**Today's milestone:** `EmployeeCard` — the leaf node. Typed, styled, Storybooked.

**Session 2** moves up the tree — adding state management patterns and a validated Add Employee form.

---

**SPEAKER NOTES**

**What:** The full component tree from App down to EmployeeCard. Shows where today's work fits.

**Why it matters:** Engineers can see the forest, not just the trees. EmployeeCard being a leaf node is significant — it's the purest, most reusable part of the system.

**Ask the room:** "Where is the QueryClientProvider in the tree, and why does it have to be at the root? Any component below it can call useQuery — that's the context pattern from earlier."

**Transition:** Let's wrap up with the session checkpoint.

---

---

## Slide 42: Session 1 Checkpoint ✅

**Hour 1 — Core React + TypeScript**

- ✅ What React is and where it sits in the frontend stack
- ✅ Functional components, JSX, props, and state
- ✅ TypeScript: interfaces, prop typing, the `Employee` type
- ✅ Hooks: `useState`, `useEffect`, `useRef`, `useContext`, custom hooks
- ✅ Performance: `React.memo`, `useMemo`, `useCallback`, `lazy`/`Suspense`

**Hour 2 — Styling and Component Architecture**

- ✅ Styling spectrum: inline → CSS Modules → Tailwind
- ✅ Design system tokens and consistency
- ✅ Storybook: stories, autodocs, component isolation
- ✅ Composition, container/presentational split, folder structure

---

**SPEAKER NOTES**

**What:** Summary of everything covered in Session 1.

**Why it matters:** Reinforces retention and lets engineers self-assess before leaving.

**Ask the room:** "Which of these felt most unfamiliar? Which felt similar to patterns you already know?"

**Transition:** Here's the homework and a preview of Session 2.

---

## Slide 43: Homework + Session 2 Preview

### Homework — Before Session 2

**Explore the `session-1-start` branch:**

```
git checkout session-1-start
npm install
npm run dev
npm run storybook
```

**Build `EmployeeCard`:**

1. Define `EmployeeCardProps` using the `Employee` interface from `src/types/employee.ts`
2. Render `name`, `company.name`, `email`, and `phone`
3. Style it with Tailwind — reference the final version in `src/components/EmployeeCard.tsx`
4. Write a story in `EmployeeCard.stories.tsx` with at least two named story variants
5. Stretch goal: add an `EmployeeList` that maps over a hardcoded array and renders a grid of cards

---

**SPEAKER NOTES**

**What:** Clear homework with concrete steps, and a preview that connects today's work to Session 2.

**Why it matters:** Engineers need to know exactly what "done" looks like for the homework. Vague homework doesn't get done.

**Ask the room:** "Any questions on the homework? Is the `session-1-start` branch accessible to everyone?"

**Transition:** Thank the room. Session 2 is [date TBD]. Questions welcome on Slack in #react-training.

---

---

## Appendix: Quick Reference

### Hooks at a glance

| Hook          | Purpose                     | Re-renders?             |
| ------------- | --------------------------- | ----------------------- |
| `useState`    | Local component state       | Yes — on setter call    |
| `useEffect`   | Side effects after render   | No                      |
| `useRef`      | Mutable ref / DOM access    | No                      |
| `useContext`  | Read context value          | Yes — on context change |
| `useMemo`     | Cache expensive computation | No                      |
| `useCallback` | Stable function reference   | No                      |

### Tailwind classes used in this project

| Class                                        | Meaning                           |
| -------------------------------------------- | --------------------------------- |
| `bg-white rounded-lg border border-gray-200` | Card base                         |
| `p-6`                                        | 24px padding                      |
| `hover:shadow-md transition-shadow`          | Hover elevation                   |
| `text-base font-semibold text-gray-900`      | Card heading                      |
| `text-sm text-indigo-600`                    | Company / link label              |
| `text-sm text-gray-600`                      | Body metadata                     |
| `sr-only`                                    | Visually hidden (accessible only) |

### Key files in the repo

| File                                      | Purpose                                    |
| ----------------------------------------- | ------------------------------------------ |
| `src/types/employee.ts`                   | `Employee` interface — the shared contract |
| `src/components/EmployeeCard.tsx`         | Session 1 target component                 |
| `src/components/EmployeeCard.stories.tsx` | Storybook stories                          |
| `src/pages/EmployeeListPage.tsx`          | Container — search state + rendering       |
| `src/hooks/useEmployees.ts`               | Custom hook — TanStack Query + REST        |
| `src/App.tsx`                             | Root — routing and providers               |

---

_Session 1 · React Training Programme · 22 July_
