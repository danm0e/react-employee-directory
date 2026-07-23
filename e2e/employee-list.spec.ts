// Session 3 homework: write Playwright E2E tests for the Employee Directory.
//
// Setup first (see README step 3):
//   1. Create playwright.config.ts — see Session 3 slides — "Playwright Config"
//   2. Add "test:e2e": "playwright test" to package.json scripts
//   3. npx playwright install --with-deps chromium
//
// Import:
//   import { test, expect } from "@playwright/test"
//
// Tests to write (run with: npm run test:e2e):
//   1. The page heading "Employee Directory" is visible
//   2. 10 employee cards load from the network
//   3. Typing "Leanne" in the search box leaves exactly 1 card visible
//   4. Clicking the first card navigates to /employees/:id
//   5. Clicking "Back to directory" returns to /
//
// Reference: Session 3 slides — "Playwright — E2E Basics"
