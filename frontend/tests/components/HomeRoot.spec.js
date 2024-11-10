import { test, expect } from "@playwright/test";

test.describe("HomeRoot Component", () => {
  test.beforeEach(async ({ page }) => {
    // Setup base URL and initial state

    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("renders home page for non-authenticated user", async ({ page }) => {
    // Verify base layout
    await expect(page.locator(".bg-black")).toBeVisible();
    await expect(page.locator(".main-content")).toBeVisible();

    // Check title
    await expect(page).toHaveTitle("MyCash");

    // Check TopBar elements
    const navbar = page.locator("nav.navbar");
    await expect(navbar).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign Up" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Login" })).toBeVisible();
  });

  test("redirects authenticated user to main page", async ({ page }) => {
    // Set authenticated state
    await mockReduxState(page, mockAuthenticatedState);
    await page.goto("/");

    // Check redirect
    await expect(page).toHaveURL("/main");
  });

  test("handles logout correctly", async ({ page }) => {
    // Setup authenticated state
    await mockReduxState(page, mockAuthenticatedState);
    await page.goto("/main");

    // Mock logout endpoint
    await mockApiResponse(page, "auth/logout", { success: true });

    // Trigger logout
    await page.locator('img[alt="logout"]').click();

    // Verify redirect and UI updates
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("link", { name: "Sign Up" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Login" })).toBeVisible();
  });

  test("TopBar shows correct navigation links", async ({ page }) => {
    // Test navigation to signup
    await page.getByRole("link", { name: "Sign Up" }).click();
    await expect(page).toHaveURL("/signup");

    // Test navigation to login
    await page.getByRole("link", { name: "Login" }).click();
    await expect(page).toHaveURL("/login");

    // Test logo navigation
    await page.locator("a").first().click();
    await expect(page).toHaveURL("/");
  });

  test("shows authenticated user UI elements", async ({ page }) => {
    // Set authenticated state
    await mockReduxState(page, mockAuthenticatedState);
    await page.goto("/main");

    // Check for user-specific elements
    await expect(page.locator('img[alt="profile"]')).toBeVisible();
    await expect(page.locator('img[alt="logout"]')).toBeVisible();

    // Verify auth buttons are not visible
    await expect(page.getByRole("link", { name: "Sign Up" })).not.toBeVisible();
    await expect(page.getByRole("link", { name: "Login" })).not.toBeVisible();
  });

  test("handles failed logout gracefully", async ({ page }) => {
    // Setup authenticated state
    await mockReduxState(page, mockAuthenticatedState);
    await page.goto("/main");

    // Mock failed logout
    await mockApiResponse(page, "auth/logout", { error: "Logout failed" }, 500);

    // Attempt logout
    await page.locator('img[alt="logout"]').click();

    // Verify user remains on main page
    await expect(page).toHaveURL("/main");
    await expect(page.locator('img[alt="profile"]')).toBeVisible();
  });
});
