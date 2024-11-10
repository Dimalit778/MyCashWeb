import { expect, test as setup } from "@playwright/test";

const authFile = "tests/auth/user.json";

setup("authenticate", async ({ page }, testInfo) => {
  const user = testInfo.project.use.user;
  const password = testInfo.project.use.password;

  // Navigate to login page
  await page.goto("/login");

  // Fill login form
  await page.getByPlaceholder("Email").fill(user);
  await page.getByPlaceholder("Password").fill(password);

  // Submit form
  await page.getByRole("button", { name: "Login" }).click();

  // Wait for successful navigation
  await page.waitForURL("/main");

  // Use a more specific selector for profile image

  //   await expect(page.getByTestId("nav-profile-icon")).toBeVisible();

  // Or use multiple attributes to be more specific
  // await expect(
  //   page.locator('nav img[alt="profile"]').first()
  // ).toBeVisible();

  // Store authentication state
  await page.context().storageState({ path: authFile });
});
