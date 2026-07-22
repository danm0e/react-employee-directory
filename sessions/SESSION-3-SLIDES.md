# React Training — Session 3: Testing & Accessibility

### Employee Directory · 29 July

---

## Slide 1: Session 3 — Testing & Accessibility

**React Training Programme · Session 3 of 4**
**29 July**

---

### Today's Agenda

|                   |                                                              |
| ----------------- | ------------------------------------------------------------ |
| **Hour 1**        | Testing                                                      |
|                   | Testing philosophy — the pyramid                             |
|                   | React Testing Library — queries, user events, async patterns |
|                   | Mocks — vi.fn(), vi.stubGlobal, lifecycle hooks              |
|                   | Playwright — E2E basics and real-world interaction patterns  |
|                   | Standards, coverage, CI, and contract testing                |
| ☕ **Break**      | 10 minutes                                                   |
| **Hour 2**        | Accessibility                                                |
|                   | WCAG and POUR principles                                     |
|                   | Semantic HTML, ARIA, focus management                        |
|                   | Tooling: eslint-plugin-jsx-a11y, browser DevTools            |
|                   | Practical audit of the feature                               |
| ✅ **Checkpoint** | Tests written + A11Y audit passed on the Employee Directory  |

---

**SPEAKER NOTES**

**What:** Welcome back. Orient the room — testing and accessibility are the quality gates that make the feature production-ready.

**Why it matters:** You can build a feature that works perfectly in happy-path demos and still be inaccessible to 20% of users and completely untestable. This session addresses both.

**Ask the room:** "Does your current team have a testing culture? What does code review look like for test coverage?"

**Transition:** Let's start with where we left off.

---

## Slide 2: Where We Left Off — Session 2 Recap

**What was built in Session 2:**

- `src/schemas/employee.schema.ts` — Zod schema with runtime validation
- `src/components/AddEmployeeForm.tsx` — React Hook Form + Zod, accessible markup
- `src/pages/AddEmployeePage.tsx` — page wrapper with back navigation
- Route `/employees/new` wired into `App.tsx`
- "Add Employee" link in `EmployeeListPage` header

**What's already running on `session-3-start`:**

```
npm run dev      → list page, detail page, and Add Employee form all working
npm run storybook → EmployeeCard and AddEmployeeForm in the sidebar
```

> The form already has correct accessibility markup — `htmlFor`/`id`, `aria-invalid`, `aria-describedby`, `role="alert"`. We'll audit this in Hour 2.

---

**SPEAKER NOTES**

**What:** Quick recap of Session 2 output — the full feature is now built. Today we add quality.

**Why it matters:** Engineers should be able to run the app immediately and see everything working before we start writing tests.

**Ask the room:** "Did everyone get the form working? Any questions before we move on?"

**Transition:** Testing is a large topic. Let's start with the mental model — the pyramid.

---

## Slide 3: What We're Testing Today

**The two stubs we're filling in:**

```
src/components/EmployeeCard.test.tsx    ← unit tests: render + click
src/components/AddEmployeeForm.test.tsx ← unit tests: validation + async submit
e2e/employee-list.spec.ts              ← Playwright E2E: full user journey
```

**And a live accessibility audit of:**

```
src/pages/EmployeeListPage.tsx         ← keyboard navigation, heading order
src/components/EmployeeCard.tsx        ← interactive element semantics
```

**Run tests:** `npm run test` (Vitest, watch mode)

---

**SPEAKER NOTES**

**What:** Orient engineers to exactly what they're building in this session.

**Why it matters:** Engineers who can see the target files are more engaged — they know which stubs they're filling in.

**Ask the room:** "Has anyone used Vitest before? It's essentially Jest with better Vite integration — the API is almost identical."

**Transition:** Before we write a single test, let's understand the testing pyramid.

---

---

# HOUR 1

## Testing

---

## Slide 4: The Testing Pyramid

```
              ╱─────────────╲
             ╱               ╲
            ╱   E2E tests      ╲   ← Few, slow, high confidence
           ╱   (Playwright)     ╲
          ╱─────────────────────╲
         ╱                       ╲
        ╱  Integration tests       ╲  ← Some, moderate speed
       ╱   (RTL + real rendering)   ╲
      ╱─────────────────────────────╲
     ╱                               ╲
    ╱       Unit tests                ╲  ← Many, fast, focused
   ╱     (isolated, mocked deps)       ╲
  ╱───────────────────────────────────╲
```

| Layer           | What it tests                          | Speed           | Quantity |
| --------------- | -------------------------------------- | --------------- | -------- |
| **Unit**        | One component or function in isolation | Fast (~ms)      | Most     |
| **Integration** | Components working together            | Medium          | Some     |
| **E2E**         | Full user journey in a real browser    | Slow (~seconds) | Few      |

> The pyramid is a guide, not a law. The right balance depends on your risk profile.

---

**SPEAKER NOTES**

**What:** The testing pyramid — more unit tests at the base, fewer E2E at the top.

**Why it matters:** Engineers often default to "write lots of E2E tests" because they feel comprehensive. E2E tests are slow, brittle, and expensive to maintain. The pyramid helps explain why a mix is better.

**Ask the room:** "What's the most painful type of test failure you've experienced? Flaky E2E tests top most engineers' lists."

**Transition:** Within this pyramid, a key principle shapes which tests to write — test behaviour, not implementation.

---

## Slide 5: What to Test — Behaviour, Not Implementation

**The key principle: test what a user can see and do.**

```tsx
// ❌ Testing implementation — tightly coupled to internals
expect(component.state.isLoading).toBe(false);
expect(wrapper.find(".spinner")).toHaveLength(0);

// ✅ Testing behaviour — what the user actually experiences
expect(screen.queryByText("Loading employees…")).not.toBeInTheDocument();
expect(screen.getAllByRole("article")).toHaveLength(10);
```

**What's worth testing:**

- Components render the right content given their props
- User interactions trigger the right outcomes (clicks, form submits)
- Async operations show the right loading/error/success states
- Validation rules fire on the right inputs

**What's NOT worth testing:**

- Component internals (state values, private methods)
- Implementation details that can change without user impact
- Third-party library behaviour (Zod, RHF, TanStack Query)

---

**SPEAKER NOTES**

**What:** Test what users experience, not how the code is structured internally.

**Why it matters:** Tests that target internals break every time you refactor, even when the feature still works. Tests that target behaviour survive refactors — they only break when something actually goes wrong.

**Ask the room:** "If you change a CSS class name or rename a state variable, should your tests break? No — only user-visible behaviour should break tests."

**Transition:** React Testing Library was built around this principle. Let's look at its core API.

---

## Slide 6: React Testing Library — The Core API

RTL renders components into a real DOM (jsdom) and exposes them the way a user would see them.

```tsx
import { render, screen } from "@testing-library/react";
import { EmployeeCard } from "./EmployeeCard";

render(<EmployeeCard employee={sampleEmployee} />);

// Query by role — the most accessible, most resilient query
screen.getByRole("heading", { name: "Leanne Graham" });

// Query by label text — for form inputs
screen.getByLabelText("Full Name");

// Query by text content
screen.getByText("Romaguera-Crona");

// Query by placeholder
screen.getByPlaceholderText("Search by name…");
```

**Query variants:**

| Prefix    | Throws if missing? | Returns            |
| --------- | ------------------ | ------------------ |
| `getBy`   | Yes                | Element            |
| `queryBy` | No — returns null  | Element or null    |
| `findBy`  | Yes (async)        | Promise\<Element\> |

---

**SPEAKER NOTES**

**What:** RTL's three query prefixes and the priority order for choosing between them.

**Why it matters:** `getByRole` is the most resilient query because it tests the accessible name — exactly what screen reader users experience. If `getByRole` can't find your element, your ARIA is probably wrong.

**Ask the room:** "When would you use `queryBy` instead of `getBy`? When asserting that something is NOT present — `expect(screen.queryByText('Error')).not.toBeInTheDocument()`."

**Transition:** Let's write our first real test.

---

## Slide 7: [LIVE CODE] First Unit Test — `EmployeeCard.test.tsx`

> **Trainer:** Open `src/components/EmployeeCard.test.tsx`. Replace the stub with the full test file.

```tsx
// src/components/EmployeeCard.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmployeeCard } from "./EmployeeCard";

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

describe("EmployeeCard", () => {
  it("renders the employee name", () => {
    render(<EmployeeCard employee={sampleEmployee} />);
    expect(
      screen.getByRole("heading", { name: "Leanne Graham" }),
    ).toBeInTheDocument();
  });

  it("renders company name, email, and phone", () => {
    render(<EmployeeCard employee={sampleEmployee} />);
    expect(screen.getByText("Romaguera-Crona")).toBeInTheDocument();
    expect(screen.getByText("sincere@april.biz")).toBeInTheDocument();
    expect(screen.getByText("1-770-736-8031 x56442")).toBeInTheDocument();
  });

  it("calls onClick when the card is clicked", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(<EmployeeCard employee={sampleEmployee} onClick={handleClick} />);
    await user.click(screen.getByRole("article"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

> **Show:** run `npm run test` — three passing tests. Then delete `"Leanne Graham"` from the assertion — watch it fail with a clear message.

---

**SPEAKER NOTES**

**What:** Live build of the first unit test. Show passing, then deliberately break one to demonstrate the error message quality.

**Why it matters:** Good test failure messages are as important as passing tests. RTL's messages tell you exactly what was rendered vs what was expected.

**Ask the room:** "Why does `vi.fn()` not need an import? Vitest is configured with `globals: true` — `describe`, `it`, `expect`, `vi` are all globally available without importing."

**Transition:** `userEvent.setup()` gives us realistic user interactions. Let's look at why that matters.

---

## Slide 8: `userEvent` vs `fireEvent`

Both trigger events on elements — `userEvent` is almost always the right choice.

```tsx
import userEvent from "@testing-library/user-event";
import { fireEvent } from "@testing-library/react";

// ❌ fireEvent — fires a single synthetic event, skips browser behaviour
fireEvent.click(button);
fireEvent.change(input, { target: { value: "Alice" } });

// ✅ userEvent — simulates real user behaviour (focus, keyboard, pointer events)
const user = userEvent.setup();
await user.click(button); // focuses, then clicks — like a real user
await user.type(input, "Alice"); // types character by character, firing keyboard events
await user.tab(); // tabs between focusable elements
```

**Why `userEvent.setup()`?**

The `setup()` call creates a user session that tracks pointer and keyboard state across multiple interactions — essential for testing focus management and keyboard navigation.

> Always `await` userEvent calls — they're asynchronous.

---

**SPEAKER NOTES**

**What:** `userEvent` simulates real browser behaviour; `fireEvent` just dispatches synthetic events.

**Why it matters:** Forms with React Hook Form rely on focus events and blur events to trigger validation. `fireEvent.change()` won't trigger the same validation as `userEvent.type()` — leading to tests that pass but don't reflect real behaviour.

**Ask the room:** "What would happen if you used `fireEvent.click` on the submit button of a form with RHF? Validation might not fire — the test passes when the real user experience would show an error."

**Transition:** Many real interactions are async. Let's look at the async testing patterns.

---

## Slide 9: Async Patterns — `findBy` and `waitFor`

Most meaningful UI updates are async — data fetches, form submissions, validation.

```tsx
// findBy — waits for the element to appear (retries until timeout)
const successBanner = await screen.findByText("Employee added successfully.");

// waitFor — waits for an assertion to stop throwing
await waitFor(() => {
  expect(screen.getByText("Employee added successfully.")).toBeInTheDocument();
});

// ❌ Don't use getBy for things that appear after async work
const banner = screen.getByText("Employee added successfully."); // fails immediately
```

**RTL retries `findBy` and `waitFor` until:**

- The assertion passes, or
- A timeout elapses (default 1000ms)

**Common async scenarios in this project:**

- Form submit → POST to API → success banner appears
- Validation → RHF runs schema → error messages appear
- Data fetch → loading state → employee cards render

---

**SPEAKER NOTES**

**What:** `findBy` and `waitFor` handle async UI updates. Never use `getBy` for elements that appear after async operations.

**Why it matters:** This is the source of the most common RTL test failures — using `getBy` for something that doesn't exist yet. The fix is almost always to swap to `findBy` or add `await`.

**Ask the room:** "What's the difference between `findByText` and `waitFor(() => screen.getByText(...))`? They're functionally equivalent for simple cases — `findBy` is the shorthand."

**Transition:** To test async operations like form submissions, we need to mock network requests.

---

## Slide 10: Mocks — `vi.fn()` and `vi.stubGlobal`

Mocks replace real dependencies so tests run fast and predictably.

```tsx
// vi.fn() — a function that records how it was called
const handleClick = vi.fn();
await user.click(button);
expect(handleClick).toHaveBeenCalledTimes(1);
expect(handleClick).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));

// vi.stubGlobal — replace a global (like fetch) for the duration of a test
vi.stubGlobal(
  "fetch",
  vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ id: 11 }),
  }),
);

// Lifecycle — reset mocks between tests to prevent leakage
beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }),
  );
});

afterEach(() => {
  vi.unstubAllGlobals(); // restore fetch to the real implementation
});
```

> Only mock external dependencies (network, storage, timers). Don't mock the code you're actually testing.

---

**SPEAKER NOTES**

**What:** `vi.fn()` creates spy functions; `vi.stubGlobal` replaces globals. `beforeEach`/`afterEach` ensure isolation between tests.

**Why it matters:** Tests that make real network requests are slow, flaky, and dependent on external systems. Mocking fetch makes tests hermetic — they pass regardless of network conditions.

**Ask the room:** "What's the risk of not cleaning up mocks between tests? A mock set in one test leaks into the next — the second test's fetch returns the wrong value and you spend hours debugging a false failure."

**Transition:** Let's put this all together and test the AddEmployeeForm.

---

## Slide 11: [LIVE CODE] `AddEmployeeForm.test.tsx` — Validation

> **Trainer:** Open `src/components/AddEmployeeForm.test.tsx`. Build the validation tests first.

```tsx
// src/components/AddEmployeeForm.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddEmployeeForm } from "./AddEmployeeForm";

describe("AddEmployeeForm — validation", () => {
  it("shows required field errors on empty submit", async () => {
    const user = userEvent.setup();
    render(<AddEmployeeForm />);

    await user.click(screen.getByRole("button", { name: "Add Employee" }));

    expect(screen.getByText("Full name is required")).toBeInTheDocument();
    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Department is required")).toBeInTheDocument();
  });

  it("shows an invalid email error", async () => {
    const user = userEvent.setup();
    render(<AddEmployeeForm />);

    await user.type(screen.getByLabelText("Full Name"), "Alice Smith");
    await user.type(screen.getByLabelText("Email"), "not-valid");
    await user.type(screen.getByLabelText("Department"), "Engineering");
    await user.click(screen.getByRole("button", { name: "Add Employee" }));

    expect(screen.getByText("Enter a valid email address")).toBeInTheDocument();
  });
});
```

> **Point out:** `getByLabelText("Full Name")` works because `<label htmlFor="name">` is correctly associated. If the label were broken, this query would fail — the test doubles as an accessibility check.

---

**SPEAKER NOTES**

**What:** Live build of form validation tests. Show both failing and then fix them as you build.

**Why it matters:** These tests verify the Zod schema is wired correctly — if someone changes the error messages in the schema, the tests catch it. Also note that `getByLabelText` failing would surface a broken label association.

**Ask the room:** "Notice we're testing the _error message text_ from the Zod schema. What happens if someone changes 'Full name is required' to 'Name is required'? The test fails — which is correct, it's a user-visible change."

**Transition:** Now let's test the success path, which requires mocking fetch.

---

## Slide 12: [LIVE CODE] `AddEmployeeForm.test.tsx` — Success Path

> **Trainer:** Add the success tests to the same file. Add the `beforeEach`/`afterEach` mock lifecycle.

```tsx
describe("AddEmployeeForm — success", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 11 }),
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows the success banner after valid submission", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    render(<AddEmployeeForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText("Full Name"), "Alice Smith");
    await user.type(screen.getByLabelText("Email"), "alice@example.com");
    await user.type(screen.getByLabelText("Department"), "Engineering");
    await user.click(screen.getByRole("button", { name: "Add Employee" }));

    expect(
      await screen.findByText("Employee added successfully."),
    ).toBeInTheDocument();
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });
});
```

> **Show:** `findByText` (not `getByText`) — the banner appears asynchronously after the fetch resolves.

---

**SPEAKER NOTES**

**What:** Live build of the async success test with fetch mock and lifecycle cleanup.

**Why it matters:** The `findByText` vs `getByText` distinction is critical here. If you use `getByText`, the test fails because the banner hasn't appeared yet. This is the most common async testing mistake.

**Ask the room:** "What does `onSuccess` being a `vi.fn()` let us assert? That the parent component was notified — we can verify the callback contract without caring about what the parent does with it."

**Transition:** Unit and integration tests cover components in isolation. E2E tests cover the full user journey in a real browser. That's Playwright.

---

## Slide 13: Playwright — E2E Philosophy and Setup

Playwright controls a real browser — no jsdom, no mocking, real network requests.

**When to use E2E vs RTL:**

- Use **RTL** for component logic, validation, state changes
- Use **Playwright** for full user journeys that cross page boundaries

**Setup (homework task):**

```bash
# Install Playwright and Chromium
npx playwright install --with-deps chromium
```

```ts
// playwright.config.ts — create this file
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: { baseURL: "http://localhost:5173" },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
```

```json
// package.json — add this script
"test:e2e": "playwright test"
```

---

**SPEAKER NOTES**

**What:** Playwright controls a real Chromium browser. `webServer` in the config starts the Vite dev server automatically before tests run.

**Why it matters:** Engineers often ask "why bother with E2E if we have RTL?" The answer is: RTL can't test navigation, URL changes, browser back/forward, or network-dependent behaviour across pages.

**Ask the room:** "Notice `reuseExistingServer: !process.env.CI` — in CI the server always starts fresh. Locally, if `npm run dev` is already running, Playwright reuses it. What does that save?"

**Transition:** Now let's look at Playwright's locator strategy.

---

## Slide 14: Playwright — Locators and Assertions

Playwright's locators mirror RTL's philosophy: prefer role-based queries.

```ts
import { test, expect } from "@playwright/test";

// Role-based (preferred — resilient to CSS/layout changes)
page.getByRole("heading", { name: "Employee Directory" });
page.getByRole("button", { name: "Add Employee" });
page.getByRole("article"); // all EmployeeCard elements

// Label-based (forms)
page.getByLabel("Full Name");

// Placeholder-based
page.getByPlaceholder("Search by name…");

// Assertions — automatically wait for the condition to be true
await expect(page).toHaveURL("/employees/1");
await expect(cards).toHaveCount(10);
await expect(heading).toBeVisible();
```

**`await` on every assertion** — Playwright retries automatically until the assertion passes or times out.

---

**SPEAKER NOTES**

**What:** Playwright's locator API is almost identical to RTL's — `getByRole`, `getByLabel`, etc. The key difference is that all assertions are async.

**Why it matters:** Engineers familiar with RTL can transfer knowledge directly. The mental model is the same: query by what users see, not by CSS selectors or test IDs.

**Ask the room:** "What's the danger of using `page.locator('.employee-card')` as a selector? It breaks if you rename the class. `getByRole('article')` will survive a full CSS rewrite."

**Transition:** Let's build the E2E spec for the employee list.

---

## Slide 15: [LIVE CODE] `e2e/employee-list.spec.ts`

> **Trainer:** Open `e2e/employee-list.spec.ts`. Replace the stub with the full spec.

```ts
// e2e/employee-list.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Employee Directory", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("shows the page heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Employee Directory" }),
    ).toBeVisible();
  });

  test("loads 10 employee cards from the API", async ({ page }) => {
    await expect(page.getByRole("article")).toHaveCount(10);
  });

  test("search filters the employee list", async ({ page }) => {
    await page.getByPlaceholder("Search by name…").fill("Leanne");
    await expect(page.getByRole("article")).toHaveCount(1);
  });

  test("clicking a card navigates to the detail page", async ({ page }) => {
    await page.getByRole("article").first().click();
    await expect(page).toHaveURL(/\/employees\/\d+/);
  });

  test("back button returns to the directory", async ({ page }) => {
    await page.getByRole("article").first().click();
    await page.getByRole("button", { name: "← Back to directory" }).click();
    await expect(page).toHaveURL("/");
  });
});
```

---

**SPEAKER NOTES**

**What:** Live build of the full Playwright spec. Run `npm run test:e2e` and watch Chromium launch and navigate.

**Why it matters:** Seeing the browser open and actually click through the app is a powerful demonstration. Engineers immediately see the difference between unit tests (invisible DOM operations) and E2E tests (a real browser doing real things).

**Ask the room:** "The search test `fills` the input and expects 1 card. Does this test require mocking the API? No — it calls the real JSONPlaceholder API. That's a deliberate choice: E2E tests test the full stack."

**Transition:** Now that we can write tests, let's talk about standards — how much testing is enough?

---

## Slide 16: Testing Standards and Coverage

**Coverage is a metric, not a goal.**

```
------------|---------|----------|---------|---------|
File        | % Stmts | % Branch | % Funcs | % Lines |
------------|---------|----------|---------|---------|
EmployeeCard| 100     | 100      | 100     | 100     |
AddEmployee | 88.5    | 75       | 85.7    | 88.5    |
------------|---------|----------|---------|---------|
```

**What 100% coverage does NOT mean:**

- Your component is bug-free
- Edge cases are handled
- The UX is good

**What to actually care about:**

- Critical paths have tests (form validation, error states, navigation)
- Tests run in CI and block merges on failure
- Tests are readable — a failing test should tell you what broke

**A practical stance:**

- Cover all user-facing behaviour
- Aim for 80%+ as a floor, not a ceiling
- Delete tests that test implementation details and break on every refactor

---

**SPEAKER NOTES**

**What:** Coverage numbers are useful as a floor to prevent regressions, not as a quality signal.

**Why it matters:** Teams that chase 100% coverage end up with fragile tests that test nothing meaningful. Engineers need to distinguish between "this line executed" and "this behaviour is verified."

**Ask the room:** "Has anyone been in a codebase with 90%+ coverage that still had production bugs? What did that tell you about the tests?"

**Transition:** Tests only matter if they run. Let's look at CI.

---

## Slide 17: CI Integration — Where Tests Live in the Pipeline

Tests that only run locally don't prevent production bugs.

```yaml
# Example: GitHub Actions workflow (conceptual)
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run test -- --run # Vitest — no watch mode in CI
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
```

**Key practices:**

- Unit tests block the PR — fast feedback, no merge if tests fail
- E2E tests run on merge to main — slower, but gates deployment
- `--run` flag on Vitest disables watch mode in CI environments
- Test results uploaded as artefacts — engineers can see Playwright traces on failure

---

**SPEAKER NOTES**

**What:** Tests must run in CI to be meaningful. Show the conceptual pipeline shape.

**Why it matters:** The value of tests is directly proportional to how quickly they give feedback. Tests that only run locally are advisory; tests that block PRs are enforced contracts.

**Ask the room:** "In your current project, do tests block PRs? What's the cost of a broken main branch vs the cost of slower PR reviews?"

**Transition:** One more testing concept before the break — contract testing. A brief awareness piece only.

---

## Slide 18: Contract Testing — Brief Awareness

**The problem it solves:** integration tests can't catch breaking API changes across team boundaries.

```
Frontend                    Backend
────────────────            ─────────────────────
useEmployees()      →       GET /users
expects: Employee[]         returns: { data: User[] }
                            ↑ shape mismatch — caught only at runtime
```

**Contract testing inserts a verification step:**

- The **consumer** (frontend) defines what it expects from the API (a "contract")
- The **provider** (backend) verifies it meets that contract in CI
- Breaking changes are caught before either team deploys

**Common tool:** [Pact](https://pact.io)

**When teams reach for it:**

- Multiple frontend clients consuming the same API
- Backend and frontend are deployed independently
- Runtime 422 errors are a recurring problem

> This is a 5-minute awareness item. You won't write Pact tests today — but you should know the name and the problem.

---

**SPEAKER NOTES**

**What:** Contract testing is a technique for catching API mismatches between consumers and providers before they hit production.

**Why it matters:** Backend engineers in this room will likely be the ones writing the provider side of contracts when frontend teams start using Pact. Knowing what it is helps them engage with the conversation.

**Ask the room:** "Has anyone been in a situation where a backend API change broke the frontend without warning? Contract testing is the systematic fix for that problem."

**Transition:** That's Hour 1. Time for a break.

---

---

# ☕ BREAK — 10 MINUTES

---

**SPEAKER NOTES**

**What:** 10-minute break.

**Why it matters:** Hour 2 is accessibility — a topic that benefits from fresh attention.

**Ask the room:** On return: "Any questions from Hour 1 before we move into accessibility?"

**Transition:** Hour 2 — accessibility.

---

---

# HOUR 2

## Accessibility

---

## Slide 19: Why Accessibility Matters

**It's not a nice-to-have.**

- **1 in 5** people globally has a permanent disability
- A further **1 in 5** has a progressive impairment
- Keyboard-only users, screen reader users, and users with motor impairments are real users of real products
- In many jurisdictions (UK Equality Act, US ADA, EU Web Accessibility Directive) — **inaccessible products are legally actionable**

**The practical argument for engineers:**

- Accessible HTML is more resilient HTML — semantic elements are easier to test, maintain, and search-engine-index
- RTL and Playwright both query by role — if your tests can't find an element by role, your ARIA is probably wrong
- Catching issues during development costs ~10× less than catching them in a user complaint or legal notice

---

**SPEAKER NOTES**

**What:** Accessibility affects 20%+ of users and carries legal obligations. The engineering case is that it also produces better code.

**Why it matters:** Engineers who see accessibility as a checkbox task will do the minimum. Engineers who understand the numbers and the legal context take it seriously.

**Ask the room:** "Has your team ever had an accessibility complaint or audit? What was the most common issue found?"

**Transition:** The foundation is WCAG and the POUR principles.

---

## Slide 20: WCAG and the POUR Principles

**WCAG** (Web Content Accessibility Guidelines) is the international standard. The four principles are **POUR**:

| Principle          | Meaning                        | Example in our app                        |
| ------------------ | ------------------------------ | ----------------------------------------- |
| **Perceivable**    | Users can perceive all content | Error messages have text, not just colour |
| **Operable**       | Users can operate all UI       | Form can be completed with keyboard only  |
| **Understandable** | Content and UI are clear       | Input labels tell you what to type        |
| **Robust**         | Works with assistive tech      | `<button>` not `<div onClick>`            |

**Conformance levels:** A (minimum), AA (standard), AAA (enhanced)
Most legal requirements reference **WCAG 2.1 AA**.

> The simplest test: can a user complete the key journey using only the Tab key and Enter?

---

**SPEAKER NOTES**

**What:** WCAG is the standard; POUR is the mental model behind it.

**Why it matters:** Engineers who know POUR can reason from first principles — "is this Perceivable? Operable?" — rather than looking up every guideline individually.

**Ask the room:** "Which of these four do you think is most commonly failed in React apps? Operable — specifically keyboard navigation — because onClick handlers on non-interactive elements don't respond to Enter or Space."

**Transition:** Semantic HTML is the foundation of Robust. Let's look at that first.

---

## Slide 21: Semantic HTML — The Right Element for the Right Job

The single highest-impact accessibility practice: **use the HTML element that means what you're doing.**

```tsx
// ❌ Semantically wrong — no keyboard support, no role, no accessible name
<div onClick={() => navigate("/employees/1")} className="card">
  Employee Card
</div>

// ✅ Correct — keyboard-accessible, announces as "link" to screen readers
<a href="/employees/1" className="card">Employee Card</a>

// ❌ Looks like a button, behaves like a div
<div onClick={handleSubmit} className="btn">Submit</div>

// ✅ Correct — keyboard-accessible, submits form on Enter
<button type="submit">Submit</button>
```

**The rule:**

- Does it **navigate**? → `<a href>`
- Does it **trigger an action**? → `<button>`
- Is it **a section of content**? → `<article>`, `<section>`, `<nav>`
- Is it **a heading**? → `<h1>` – `<h6>` in order, no skipped levels

---

**SPEAKER NOTES**

**What:** Semantic HTML gives you keyboard support, screen reader announcements, and browser built-ins for free — without ARIA.

**Why it matters:** This is the most common accessibility mistake in React apps. Engineers reach for `<div>` because it's flexible, but lose all built-in semantics. ARIA can compensate but semantic HTML is always preferable.

**Ask the room:** "What does a screen reader announce when it encounters a `<button>`? 'Submit, button'. What does it announce for `<div onClick>`? Nothing — it's invisible to the accessibility tree."

**Transition:** When semantic HTML isn't enough, ARIA fills the gaps.

---

## Slide 22: ARIA — When to Use It (and When Not To)

**First rule of ARIA: don't use ARIA.**
Use semantic HTML. ARIA is for when HTML semantics are insufficient.

```tsx
// ❌ Redundant ARIA — button already has role="button"
<button role="button">Submit</button>

// ✅ ARIA fills a semantic gap — div acting as a live region
<div role="alert">{errorMessage}</div>

// ✅ ARIA describes relationships HTML can't express
<input
  id="email"
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? "email-error" : undefined}
/>
<p id="email-error" role="alert">{errors.email?.message}</p>
```

**The ARIA hierarchy:**

1. Use semantic HTML elements (covers 80% of cases)
2. Add ARIA roles when HTML semantics are wrong for the use case
3. Add ARIA properties (`aria-label`, `aria-describedby`) to supplement context
4. Use `aria-live` regions for dynamic content updates

---

**SPEAKER NOTES**

**What:** ARIA supplements HTML semantics — it doesn't replace them. Bad ARIA is worse than no ARIA.

**Why it matters:** Engineers who learn "just add ARIA" often add it everywhere, including on elements that already have the right semantics. This creates noise for screen reader users and can actively worsen the experience.

**Ask the room:** "When a screen reader encounters `role='alert'` on an element, what happens? The content is announced immediately and assertively — even if the user is in the middle of reading something else. Use it only for errors and urgent messages."

**Transition:** Three ARIA attributes appear throughout our AddEmployeeForm. Let's look at them.

---

## Slide 23: ARIA Roles, Labels, and Live Regions

**The three patterns in our project:**

```tsx
// 1. role="alert" — announces error messages immediately
<p id="name-error" role="alert">Full name is required</p>

// 2. aria-invalid — signals the field is in an error state
<input aria-invalid={errors.name ? true : undefined} />

// 3. aria-describedby — links an input to its error message
<input aria-describedby={errors.name ? "name-error" : undefined} />
```

**What the screen reader says when a field is invalid:**

> _"Full Name, edit text, Full name is required"_

The input's label, its role, and the linked error are announced together.

**role="status" vs role="alert":**

|                      | `role="alert"`   | `role="status"`  |
| -------------------- | ---------------- | ---------------- |
| Interrupts the user? | Yes — assertive  | No — polite      |
| Use for              | Errors, failures | Success messages |

In our form: error messages use `role="alert"`, success uses `role="status"`.

---

**SPEAKER NOTES**

**What:** Three ARIA attributes — alert, aria-invalid, aria-describedby — and how they work together.

**Why it matters:** These three are the minimum required to make form errors accessible. The key insight is that `aria-describedby` links two elements — the input and the error message — so screen readers can announce them together.

**Ask the room:** "Notice the success banner uses `role='status'` not `role='alert'`. Why? The employee was added — that's good news, not urgent. We don't want to interrupt the user's reading flow."

**Transition:** Forms are one challenge. SPAs create another — focus management.

---

## Slide 24: Focus Management in SPAs — Route Transitions

In traditional web apps, navigating to a new page resets focus to the top of the document.

**In a SPA, navigation is JavaScript — focus stays wherever it was.**

```tsx
// The problem:
// User is focused on the 5th employee card
// They click the card → JavaScript navigates to the detail page
// Focus is still "on" the old card position — not on the new page content
// Screen reader users don't know anything changed

// The solution — move focus to the new page's main content on navigation
const headingRef = useRef<HTMLHeadingElement>(null);

useEffect(() => {
  headingRef.current?.focus();
}, []); // run once on mount (i.e., when the new page renders)

return (
  <main>
    <h1 ref={headingRef} tabIndex={-1}>
      {employee.name}
    </h1>
    {/* tabIndex={-1} makes it focusable via code, not Tab key */}
  </main>
);
```

> React Router doesn't manage focus automatically. It's a developer responsibility.

---

**SPEAKER NOTES**

**What:** SPAs break browser-native focus management on navigation. Fix: move focus to the page heading on mount.

**Why it matters:** Screen reader users rely on focus position to understand where they are. A SPA that doesn't manage focus is effectively unusable for non-sighted users — they navigate and nothing announces the page change.

**Ask the room:** "What does `tabIndex={-1}` do? It makes the element programmatically focusable without adding it to the natural Tab order — you can focus it via code but users can't accidentally Tab to it."

**Transition:** The same problem appears in modals and dynamic content.

---

## Slide 25: Focus Management — Modals and Dynamic Content

**Modals require a focus trap** — when a modal is open, Tab should cycle only within it.

```tsx
// When a modal opens:
// 1. Move focus to the first focusable element inside the modal
// 2. Trap Tab and Shift+Tab within the modal
// 3. On close, return focus to the element that triggered the modal

// Libraries that handle this:
// - @radix-ui/react-dialog (our recommendation)
// - focus-trap-react
// - Headless UI Dialog

// The key pattern:
const triggerRef = useRef<HTMLButtonElement>(null);

const handleClose = () => {
  setOpen(false);
  triggerRef.current?.focus(); // return focus to the trigger
};

<button ref={triggerRef} onClick={() => setOpen(true)}>
  Open Modal
</button>;
```

**Dynamic content announcements:**

```tsx
// Announce list updates to screen readers without moving focus
<div aria-live="polite" aria-atomic="true">
  {employees.length} employees found
</div>
```

---

**SPEAKER NOTES**

**What:** Modals need focus traps; dynamic content needs aria-live regions. Both are about keeping screen reader users oriented.

**Why it matters:** A modal without a focus trap means keyboard users can Tab behind the modal into content they can't see — effectively getting lost in the page. This is a WCAG 2.1 Level A failure (2.1.2 No Keyboard Trap).

**Ask the room:** "Has anyone noticed their cursor ending up 'behind' a modal in a web app? That's exactly this bug — the focus trap wasn't implemented."

**Transition:** Let's look at the accessibility already built into our form, then audit the list page.

---

## Slide 26: In Our Project — `AddEmployeeForm` Accessibility

The form already implements the full accessible pattern from Session 2. Let's trace it:

```tsx
// Every field follows this pattern:
<label htmlFor="name">                      {/* 1. Label associated via htmlFor */}
  Full Name <span aria-hidden="true">*</span> {/* 2. * hidden from screen readers */}
</label>
<input
  id="name"                                  {/* 3. id matches htmlFor */}
  aria-invalid={errors.name ? true : undefined} {/* 4. signals error state */}
  aria-describedby={errors.name ? "name-error" : undefined} {/* 5. links to error */}
  {...register("name")}
/>
{errors.name && (
  <p id="name-error" role="alert">          {/* 6. error announced immediately */}
    {errors.name.message}
  </p>
)}
```

**Screen reader experience on invalid submit:**

1. User presses Enter → `role="alert"` announces all errors
2. User Tabs to the first invalid field → `aria-invalid` marks it red (visually and semantically)
3. On focus: _"Full Name, edit text, Full name is required"_ — label + error together via `aria-describedby`

---

**SPEAKER NOTES**

**What:** Walk through the complete accessible form pattern that's already in the codebase.

**Why it matters:** Engineers seeing this pattern in real code, not just a slide, can understand why each attribute is there and what removing it would break.

**Ask the room:** "What would happen if you removed `aria-describedby`? The screen reader announces 'Full Name, edit text' — the error message is never connected to the field. Users hear it separately when they Tab to it."

**Transition:** The form is solid. Let's audit the list page — keyboard-test it live.

---

## Slide 27: [LIVE CODE] Keyboard Audit — `EmployeeListPage`

> **Trainer:** Open the running app in Chrome. Disable the mouse entirely. Navigate using Tab, Shift+Tab, and Enter only.

**What to check:**

1. Tab to the search input — does it get a visible focus ring?
2. Tab to the "Add Employee" link — is it focusable? Does Enter navigate?
3. Tab to the first employee card — does the `<article>` receive focus? Can you activate it with Enter?
4. Check heading order — h1 → h2 for each card heading? (DevTools: Elements panel → Accessibility tree)
5. Open Chrome DevTools → Accessibility panel → check for any issues flagged

**What you'll find:**

The `<article>` element with `onClick` is **not keyboard-accessible** — it receives no focus and cannot be activated with Enter. This is an WCAG 2.1 Level A failure (1.3.1 Info and Relationships, 2.1.1 Keyboard).

---

**SPEAKER NOTES**

**What:** Live keyboard audit revealing the EmployeeCard accessibility issue.

**Why it matters:** Engineers who discover accessibility issues by actually using the keyboard understand the problem viscerally. This is far more effective than describing it theoretically.

**Ask the room:** "Try Tab through the page without a mouse. When you hit the employee cards, what happens? Nothing — keyboard users cannot access the employee details at all."

**Transition:** Let's fix it live.

---

## Slide 28: [LIVE CODE] Fixing the `EmployeeCard` Keyboard Issue

> **Trainer:** Show the EmployeeCard component. The `<article onClick>` pattern is inaccessible. Fix it live.

```tsx
// ❌ Current — onClick on article, not keyboard accessible
<article
  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md
             transition-shadow cursor-pointer"
  onClick={onClick}
>

// ✅ Fix — wrap content in a button or convert to a link
// Option A: button (if onClick is an action handler like navigate)
<article className="bg-white rounded-lg border border-gray-200 p-6">
  <button
    onClick={onClick}
    className="w-full text-left hover:shadow-md transition-shadow
               focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg"
    aria-label={`View ${employee.name}'s profile`}
  >
    {/* card content */}
  </button>
</article>

// Option B: Link (if onClick navigates to a URL — preferred)
<article className="bg-white rounded-lg border border-gray-200">
  <Link
    to={`/employees/${employee.id}`}
    className="block p-6 hover:shadow-md transition-shadow
               focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg"
  >
    {/* card content */}
  </Link>
</article>
```

---

**SPEAKER NOTES**

**What:** Live fix of the EmployeeCard keyboard issue. Show Option B (Link) is preferred since this is navigation.

**Why it matters:** Option B (`<Link>`) is semantically correct for navigation — screen readers announce it as a link, it works with right-click "open in new tab", and it gets all keyboard behaviour for free. This is a real improvement, not just compliance.

**Ask the room:** "After fixing this, re-run the keyboard audit. Tab to a card and press Enter. What happens now? The detail page loads — keyboard users can now use the entire feature."

**Transition:** Catching these issues manually is slow. Let's look at the tooling.

---

## Slide 29: Tooling — `eslint-plugin-jsx-a11y`

Catch accessibility mistakes as you type — before the browser.

```bash
npm install -D eslint-plugin-jsx-a11y
```

```js
// eslint.config.js — add the plugin
import jsxA11y from "eslint-plugin-jsx-a11y";

export default [
  jsxA11y.flatConfigs.recommended,
  // ... other config
];
```

**What it catches automatically:**

| Rule                                    | Catches                                 |
| --------------------------------------- | --------------------------------------- |
| `jsx-a11y/click-events-have-key-events` | `onClick` without `onKeyDown`/`onKeyUp` |
| `jsx-a11y/interactive-supports-focus`   | Interactive elements missing `tabIndex` |
| `jsx-a11y/label-has-associated-control` | Labels not linked to inputs             |
| `jsx-a11y/alt-text`                     | `<img>` without `alt`                   |
| `jsx-a11y/anchor-is-valid`              | `<a>` without valid `href`              |

> This plugin would have flagged the `<article onClick>` issue before it shipped.

---

**SPEAKER NOTES**

**What:** eslint-plugin-jsx-a11y adds accessibility linting to the editor and CI pipeline.

**Why it matters:** Linting catches issues at the lowest cost — in the editor, before the code is even run. This plugin would have caught the article/onClick issue before it was committed.

**Ask the room:** "The rule `click-events-have-key-events` flags our `<article onClick>` — what's the lint message? 'Visible, non-interactive elements with click handlers must have at least one keyboard listener.' Exactly the issue we just fixed."

**Transition:** For issues that get through, browser DevTools has an accessibility panel.

---

## Slide 30: Tooling — Browser DevTools Accessibility Panel

**Chrome DevTools — Accessibility tab (Elements panel):**

- Select any element → Accessibility tab shows its computed role, name, and properties
- The accessibility tree shows what screen readers actually see (not the DOM)
- Contrast checker built in — flag low-contrast text
- Lighthouse → Accessibility audit → automated WCAG checklist

**The accessibility tree vs the DOM:**

```
DOM:                              Accessibility tree:
<label htmlFor="name">            [label] "Full Name"
  Full Name                         ↓ for →
  <span aria-hidden>*</span>      [textbox] "Full Name"
</label>                             aria-invalid: false
<input id="name" ... />              aria-describedby: (none)
```

> If your `aria-describedby` isn't showing up in the accessibility tree, the `id` reference is broken.

---

**SPEAKER NOTES**

**What:** Chrome's accessibility panel shows the computed accessibility tree — what assistive technology actually sees.

**Why it matters:** The DOM and the accessibility tree are different. Engineers who only look at the DOM miss what screen readers experience. The DevTools panel closes that gap without needing a screen reader installed.

**Ask the room:** "Open DevTools on the search input. What's the computed accessible name? 'Search employees' — from the sr-only label. Without that label, the accessible name would be empty."

**Transition:** Let's wrap up with the session checkpoint.

---

---

## Slide 31: Session 3 Checkpoint ✅

**Hour 1 — Testing**

- ✅ Testing pyramid — unit, integration, E2E and when to use each
- ✅ RTL: `render`, `screen`, role-based queries, `getBy` / `queryBy` / `findBy`
- ✅ `userEvent.setup()` — realistic interactions vs `fireEvent`
- ✅ Mocks: `vi.fn()`, `vi.stubGlobal`, `beforeEach`/`afterEach` lifecycle
- ✅ Playwright: locators, assertions, `webServer` config, `test.beforeEach`
- ✅ CI: tests block PRs; `--run` flag for non-watch mode
- ✅ Contract testing — what it solves, when teams reach for it

**Hour 2 — Accessibility**

- ✅ WCAG and POUR — the framework behind every accessibility decision
- ✅ Semantic HTML — the right element eliminates the need for ARIA
- ✅ ARIA: `role="alert"`, `aria-invalid`, `aria-describedby`, `aria-live`
- ✅ Focus management — SPA routes and modal focus traps
- ✅ Tooling: `eslint-plugin-jsx-a11y` and Chrome DevTools accessibility tree

---

**SPEAKER NOTES**

**What:** Summary of everything covered. Engineers self-assess against the checklist.

**Why it matters:** Reinforces retention and surfaces gaps before the homework.

**Ask the room:** "Which of these is most directly applicable to your current project? What's the first thing you'd audit?"

**Transition:** Here's the homework and a preview of Session 4.

---

## Slide 32: Homework + Session 4 Preview

### Homework — Before Session 4

**Work from `session-3-start`:**

```
git checkout session-3-start
npm install
npm run dev
npm run test
```

**Write the tests:**

1. Complete `src/components/EmployeeCard.test.tsx` — render, content, click handler
2. Complete `src/components/AddEmployeeForm.test.tsx` — validation errors, invalid email, success with fetch mock
3. Create `playwright.config.ts` and add `"test:e2e": "playwright test"` to `package.json`
4. Install Playwright: `npx playwright install --with-deps chromium`
5. Complete `e2e/employee-list.spec.ts` — heading, 10 cards, search, navigation, back button

**Accessibility tasks:**

6. Fix the `EmployeeCard` keyboard accessibility issue (replace `<article onClick>` with a `<Link>`)
7. Add `eslint-plugin-jsx-a11y` and fix any linting errors it surfaces

**You're done when:** `npm run test` is all green, `npm run test:e2e` passes, and keyboard-only navigation works across the full feature.

---

### Session 4 — GraphQL, API Patterns & Architecture

- GraphQL primer — queries, mutations, fragments
- Apollo Client — `ApolloProvider`, `useQuery`, `useMutation`
- The normalised cache — reads, writes, policies
- Migrating the data layer from TanStack Query to Apollo
- Architectural patterns — container/presentational, compound components, micro frontends
- Micro frontends — how the Employee Directory slots into a larger platform

---

**SPEAKER NOTES**

**What:** Clear homework with the full task list, and a preview that makes micro frontends visible upfront.

**Why it matters:** Session 4 is the final session. Engineers should arrive having completed the testing homework — `session-4-start` is the completed solution. Mentioning micro frontends early signals to the client that the specific request is covered.

**Ask the room:** "Any questions on the homework? The Playwright config is the most complex new piece — the config file itself is in the slides."

**Transition:** Thank the room. Session 4 is 31 July. Questions on Slack in #react-training.

---

---

## Appendix: Quick Reference

### RTL query priority

| Query type             | When to use                                   |
| ---------------------- | --------------------------------------------- |
| `getByRole`            | First choice — tests accessible name and role |
| `getByLabelText`       | Form inputs — tests label association         |
| `getByPlaceholderText` | When no label is available                    |
| `getByText`            | Static text content                           |
| `getByTestId`          | Last resort — not user-visible                |

### Vitest mock API

| API                            | Purpose                                  |
| ------------------------------ | ---------------------------------------- |
| `vi.fn()`                      | Create a spy function                    |
| `vi.fn().mockResolvedValue(v)` | Spy that resolves a Promise              |
| `vi.stubGlobal("fetch", fn)`   | Replace a global                         |
| `vi.unstubAllGlobals()`        | Restore all globals                      |
| `vi.clearAllMocks()`           | Clear call history (keep implementation) |
| `vi.resetAllMocks()`           | Clear history + remove implementation    |

### ARIA reference

| Attribute            | Purpose                      | Example                             |
| -------------------- | ---------------------------- | ----------------------------------- |
| `role="alert"`       | Announce content immediately | Error messages                      |
| `role="status"`      | Announce content politely    | Success banners                     |
| `aria-invalid`       | Mark input as invalid        | `aria-invalid={true}`               |
| `aria-describedby`   | Link input to description    | `aria-describedby="field-error"`    |
| `aria-label`         | Provide accessible name      | `aria-label="View profile"`         |
| `aria-hidden`        | Hide from accessibility tree | `<span aria-hidden="true">*</span>` |
| `aria-live="polite"` | Announce dynamic updates     | Search result counts                |
| `tabIndex={-1}`      | Focusable via code, not Tab  | Focus management targets            |

### Playwright config (copy-paste)

```ts
// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: { baseURL: "http://localhost:5173" },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
```

### Useful Links

| Topic                          | URL                                                          |
| ------------------------------ | ------------------------------------------------------------ |
| React Testing Library          | https://testing-library.com/docs/react-testing-library/intro |
| `@testing-library/user-event`  | https://testing-library.com/docs/user-event/intro            |
| Vitest docs                    | https://vitest.dev/                                          |
| Playwright docs                | https://playwright.dev/docs/writing-tests                    |
| WCAG 2.1 guidelines            | https://www.w3.org/WAI/WCAG21/quickref/                      |
| ARIA Authoring Practices Guide | https://www.w3.org/WAI/ARIA/apg/                             |
| `eslint-plugin-jsx-a11y`       | https://github.com/jsx-eslint/eslint-plugin-jsx-a11y         |
| WebAIM colour contrast checker | https://webaim.org/resources/contrastchecker/                |

---

_Session 3 · React Training Programme · 29 July_
