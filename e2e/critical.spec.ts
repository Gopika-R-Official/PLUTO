import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "pluto.preferences",
      JSON.stringify({
        displayName: "Alex Rao",
        interests: ["Technology"],
        followedTopics: [],
        topicBoosts: {},
        openCounts: {},
        dismissedIds: [],
        onboardingComplete: true,
      }),
    );
  });
});

test("navigates primary sections", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  // Navigation via primary discovery dock
  const nav = page.getByRole("navigation", { name: /primary/i });
  await nav.getByRole("link", { name: "Trending" }).first().click();
  await expect(page.getByRole("heading", { name: /moving right now/i })).toBeVisible();

  await nav.getByRole("link", { name: "My Space" }).first().click();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("search, favorite, and theme", async ({ page }) => {
  await page.goto("/");

  // Trigger search modal
  const searchBtn = page.getByRole("button", { name: /search/i }).first();
  await searchBtn.click();
  const searchInput = page.getByPlaceholder(/search across intelligence/i);
  await searchInput.fill("Interstellar");
  await searchInput.press("Enter");

  await page.waitForURL(/search\?q=/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Interstellar");

  // Navigate back to home
  await page.goto("/");

  // Test theme switch in floating dock
  const themeToggle = page.getByRole("button", { name: /switch to (dark|light) theme/i }).first();
  await themeToggle.click();
  await expect(page.locator("html")).toHaveClass(/dark|light/);

  // Navigate to Favorites
  const nav = page.getByRole("navigation", { name: /primary/i });
  await nav.getByRole("link", { name: "Favorites" }).first().click();
  await expect(page.getByRole("heading", { name: /kept for/i })).toBeVisible();
});
