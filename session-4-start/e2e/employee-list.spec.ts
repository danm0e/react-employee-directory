import { test, expect } from "@playwright/test";

test.describe("Employee Directory", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("displays the page heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Employee Directory" }),
    ).toBeVisible();
  });

  test("loads and displays 10 employee cards", async ({ page }) => {
    const cards = page.getByRole("article");
    await expect(cards).toHaveCount(10, { timeout: 10_000 });
  });

  test("filters employees by name when searching", async ({ page }) => {
    // Wait for the full list to load before typing
    await expect(page.getByRole("article")).toHaveCount(10, {
      timeout: 10_000,
    });

    await page.getByRole("searchbox").fill("Leanne");

    await expect(page.getByRole("article")).toHaveCount(1);
    await expect(page.getByText("Leanne Graham")).toBeVisible();
  });

  test("clears the filter when the search input is cleared", async ({
    page,
  }) => {
    await expect(page.getByRole("article")).toHaveCount(10, {
      timeout: 10_000,
    });

    await page.getByRole("searchbox").fill("Leanne");
    await expect(page.getByRole("article")).toHaveCount(1);

    await page.getByRole("searchbox").clear();
    await expect(page.getByRole("article")).toHaveCount(10);
  });

  test("navigates to the detail page when a card is clicked", async ({
    page,
  }) => {
    await expect(page.getByRole("article")).toHaveCount(10, {
      timeout: 10_000,
    });

    await page.getByRole("article").first().click();

    await expect(page).toHaveURL(/\/employees\/\d+/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("navigates back to the directory from the detail page", async ({
    page,
  }) => {
    await expect(page.getByRole("article")).toHaveCount(10, {
      timeout: 10_000,
    });

    await page.getByRole("article").first().click();
    await page.getByRole("button", { name: /back to directory/i }).click();

    await expect(page).toHaveURL("/");
    await expect(
      page.getByRole("heading", { name: "Employee Directory" }),
    ).toBeVisible();
  });
});
