// tests/auth/authenticated.spec.js
import { test, expect } from "@playwright/test";

test.describe("Authenticated User Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Start each test at the home page
    await page.goto("/");
  });

  test("redirects from login/signup to main when authenticated", async ({ page }) => {
    // Try accessing login page
    await page.goto("/login");
    await expect(page).toHaveURL("/main");

    // Try accessing signup page
    await page.goto("/signup");
    await expect(page).toHaveURL("/main");
  });

  test("displays user interface elements correctly", async ({ page }) => {
    await page.goto("/main");

    // Check TopBar elements for authenticated user
    await expect(page.locator('img[alt="profile"]')).toBeVisible();
    await expect(page.locator('img[alt="logout"]')).toBeVisible();

    // Verify auth buttons are not visible
    await expect(page.getByRole("link", { name: "Login" })).not.toBeVisible();
    await expect(page.getByRole("link", { name: "Sign Up" })).not.toBeVisible();
  });

  test("maintains authentication after page refresh", async ({ page }) => {
    await page.goto("/main");
    await page.reload();

    // Should still be on main page
    await expect(page).toHaveURL("/main");
    await expect(page.locator('img[alt="profile"]')).toBeVisible();
  });

  test("handles logout process", async ({ page }) => {
    await page.goto("/main");

    // Click logout button
    await page.locator('img[alt="logout"]').click();

    // Should redirect to home
    await expect(page).toHaveURL("/");

    // Should show login/signup buttons
    await expect(page.getByRole("link", { name: "Login" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign Up" })).toBeVisible();

    // Should not show authenticated user elements
    await expect(page.locator('img[alt="profile"]')).not.toBeVisible();
    await expect(page.locator('img[alt="logout"]')).not.toBeVisible();

    // Try accessing protected route after logout
    await page.goto("/main");
    await expect(page).toHaveURL("/login");
  });

  test("preserves authentication across multiple pages", async ({ page }) => {
    // Navigate through different pages
    await page.goto("/main");
    await expect(page.locator('img[alt="profile"]')).toBeVisible();

    // Try different routes while authenticated
    const routes = ["/", "/welcome", "/main"];

    for (const route of routes) {
      await page.goto(route);
      // Should still show authenticated user elements
      await expect(page.locator('img[alt="profile"]')).toBeVisible();
      await expect(page.locator('img[alt="logout"]')).toBeVisible();
    }
  });

  test("handles failed logout gracefully", async ({ page }) => {
    await page.goto("/main");

    // Mock a failed logout request
    await page.route("**/api/auth/logout", async (route) => {
      await route.fulfill({ status: 500 });
    });

    // Click logout
    await page.locator('img[alt="logout"]').click();

    // Should still be on main page
    await expect(page).toHaveURL("/main");
    await expect(page.locator('img[alt="profile"]')).toBeVisible();
  });

  test("profile elements show correct user info", async ({ page }) => {
    await page.goto("/main");

    // Check profile image
    const profileImg = page.locator('img[alt="profile"]');
    await expect(profileImg).toBeVisible();

    // If user has avatar, check it's loaded correctly
    const avatarSrc = await profileImg.getAttribute("src");
    // if (avatarSrc !== n) {
    //   // avatarIcon is your default icon
    //   expect(avatarSrc).toBeTruthy();
    // }
  });

  test("navigation menu shows correct authenticated options", async ({ page }) => {
    await page.goto("/main");

    // Verify authenticated navigation items are visible
    const expectedNavItems = ["Profile", "Settings", "Dashboard"];

    for (const item of expectedNavItems) {
      await expect(page.getByRole("link", { name: item })).toBeVisible();
    }

    // Verify unauthenticated navigation items are not visible
    const unauthorizedItems = ["Login", "Sign Up", "Forgot Password"];

    for (const item of unauthorizedItems) {
      await expect(page.getByRole("link", { name: item })).not.toBeVisible();
    }
  });
});
