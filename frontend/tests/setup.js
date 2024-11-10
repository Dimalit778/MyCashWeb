import { expect, test as setup } from "@playwright/test";

const authFile = "tests/user.json";

setup("authenticate", async ({ page }, { testInfo }) => {
  const user = testInfo.projects.use.user;
  const password = testInfo.projects.use.password;
  // Send authentication request. Replace with your own.
  await page.goto("/login");
  await page.getByPlaceholder("Email").fill(user);
  await page.getByPlaceholder("Password").fill(password);
  await page.getByRole("button", { name: "Login" }).click();

  await page.waitForURL("/main");
  await expect(page.locator("#user")).toHaveText("dimitryd.l@gmail.com");

  await page.context().storageState({ path: authFile });
});
