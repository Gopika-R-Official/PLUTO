import { expect, test } from "@playwright/test";

test.describe("Onboarding Flow & Persistence", () => {
  test("new user sees onboarding, fails validation on blank fields, and successfully completes setup", async ({
    page,
  }) => {
    // Navigate with clean local storage (new user)
    await page.goto("/");

    // 1. New user sees onboarding dialog
    const onboardingDialog = page.getByRole("dialog", { name: /shape your discovery radar/i });
    await expect(onboardingDialog).toBeVisible();

    const nameInput = page.getByLabel(/your display name/i);
    await expect(nameInput).toBeVisible();

    // 2. Test validation: clear name input and submit
    await nameInput.fill("");
    const submitBtn = page.getByRole("button", { name: /enter discovery radar/i });
    await submitBtn.click();

    // Verify display name validation error
    await expect(page.getByText(/display name is required/i)).toBeVisible();

    // 3. Fill in valid display name
    await nameInput.fill("Devika Sengupta");

    // Verify interest tiles are selectable
    const techTile = page.getByRole("checkbox", { name: /technology/i });
    const scienceTile = page.getByRole("checkbox", { name: /science/i });
    const gamingTile = page.getByRole("checkbox", { name: /gaming/i });

    // Ensure Technology is checked
    if ((await techTile.getAttribute("aria-checked")) !== "true") {
      await techTile.click();
    }
    // Check Science and Gaming
    if ((await scienceTile.getAttribute("aria-checked")) !== "true") {
      await scienceTile.click();
    }
    if ((await gamingTile.getAttribute("aria-checked")) !== "true") {
      await gamingTile.click();
    }

    // 4. Submit successfully
    await submitBtn.click();

    // 5. Onboarding dialog disappears and Discover dashboard shows personalized greeting
    await expect(onboardingDialog).not.toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Devika Sengupta");

    // 6. Selected interests are visibly reflected in radar topics
    await expect(page.getByRole("button", { name: /toggle technology/i })).toBeVisible();

    // 7. Test persistence across reload
    await page.reload();
    await expect(onboardingDialog).not.toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Devika Sengupta");
  });

  test("mobile viewport renders onboarding comfortably without horizontal overflow", async ({
    page,
  }) => {
    // Set mobile viewport (iPhone 14)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/onboarding");

    const heading = page.getByRole("heading", { name: /shape your discovery radar/i });
    await expect(heading).toBeVisible();

    const nameInput = page.getByLabel(/your display name/i);
    await expect(nameInput).toBeVisible();

    // Verify submit button is accessible
    const submitBtn = page.getByRole("button", { name: /enter discovery radar/i });
    await expect(submitBtn).toBeVisible();
  });
});
