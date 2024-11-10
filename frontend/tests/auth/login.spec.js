// tests/auth/login.spec.js
import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("successful login redirects to main page", async ({ page }) => {
    // Fill login form
    await page.getByPlaceholder("Email").fill("dimitryd.l@gmail.com");
    await page.getByPlaceholder("Password").fill("144695");

    // Click login button
    await page.getByRole("button", { name: "Login" }).click();

    // Verify redirect
    await expect(page).toHaveURL("/main");

    // Verify profile elements are visible
    await expect(page.locator('img[alt="profile"]')).toBeVisible();
  });

  test("shows error for invalid credentials", async ({ page }) => {
    // Fill form with invalid credentials
    await page.getByPlaceholder("Email").fill("wrong@email.com");
    await page.getByPlaceholder("Password").fill("wrongpass");

    // Submit form
    await page.getByRole("button", { name: "Login" }).click();

    // Verify error message
    await expect(page.locator("text=Invalid credentials")).toBeVisible();

    // Verify we stay on login page
    await expect(page).toHaveURL("/login");
  });

  test("login form validation", async ({ page }) => {
    // Try to submit empty form
    await page.getByRole("button", { name: "Login" }).click();

    // Check validation messages
    await expect(page.locator("text=Email is required")).toBeVisible();
    await expect(page.locator("text=Password is required")).toBeVisible();
  });

  test("logout functionality", async ({ page }) => {
    // First login
    await page.getByPlaceholder("Email").fill("dimitryd.l@gmail.com");
    await page.getByPlaceholder("Password").fill("144695");
    await page.getByRole("button", { name: "Login" }).click();

    // Wait for login to complete
    await expect(page).toHaveURL("/main");

    // Click logout
    await page.locator('img[alt="logout"]').click();

    // Verify redirect to login page
    await expect(page).toHaveURL("/");

    // Verify auth elements are not visible
    await expect(page.locator('img[alt="profile"]')).not.toBeVisible();
  });
});

// tests/auth/authenticated.spec.js
test.describe("Authenticated User Tests", () => {
  test("authenticated user redirected from login page", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveURL("/main");
  });

  test("authenticated user can access protected routes", async ({ page }) => {
    await page.goto("/main");
    await expect(page).toHaveURL("/main");
    await expect(page.locator('img[alt="profile"]')).toBeVisible();
  });

  test("persists authentication between page reloads", async ({ page }) => {
    await page.goto("/main");
    await page.reload();
    await expect(page).toHaveURL("/main");
    await expect(page.locator('img[alt="profile"]')).toBeVisible();
  });
});
