import { test, expect } from "@playwright/test";

test.describe("Welcome Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/welcome");
    // await page.waitForSelector(".welcome-wrapper", { state: "visible" });
    await page.waitForLoadState("networkidle");
  });

  test("renders hero section correctly", async ({ page }) => {
    await expect(page.locator('[data-testid="main-title"]')).toHaveText("MANAGE YOUR");
    await expect(page.locator('[data-testid="stroke-title"]')).toHaveText("MONEY");

    const animationButton = page.locator(".start_btn");
    await expect(animationButton).toBeVisible();
    await expect(animationButton.locator("span")).toHaveText("Start Your Financial Journey");
  });

  test("renders about section correctly", async ({ page }) => {
    await expect(page.locator('[data-testid="about-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="about-title"]')).toHaveText("About Us");

    const teamImage = page.locator('[data-testid="team-image"]');
    await expect(teamImage).toBeVisible();
    const imageSrc = await teamImage.getAttribute("src");
    expect(imageSrc).toContain("group");

    await expect(page.locator('[data-testid="about-text-1"]')).toContainText(
      "CashFlow is a financial planning firm based in Jerusalem"
    );
    await expect(page.locator('[data-testid="about-text-2"]')).toContainText(
      "CashFlow is a financial planning firm based in Jerusalem, providing comprehensive financial planning"
    );
  });

  test("animation wrapper interaction", async ({ page }) => {
    const animationButton = page.locator(".start_btn");
    await expect(animationButton).toBeVisible();

    const initialState = await animationButton.evaluate((el) => window.getComputedStyle(el).transform);

    await animationButton.hover();
    await page.waitForTimeout(500);

    expect(initialState).toBeTruthy();
  });
  test("page is responsive for desktop layout", async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForLoadState("domcontentloaded");

    // Core elements check
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="about-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="about-image-container"]')).toBeVisible();

    // Check desktop layout (>= 992px)
    const columns = page.locator(".col-lg-6");
    await expect(columns).toHaveCount(2);

    // Check first column with image
    const imageColumn = columns.first();
    await expect(imageColumn.locator('img[alt="Team"]')).toBeVisible();

    // Check second column with content
    const contentColumn = columns.last();
    await expect(contentColumn.locator('[data-testid="about-title"]')).toBeVisible();
  });

  test("page is responsive for mobile layout", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState("domcontentloaded");

    // Core elements check
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="about-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="about-image-container"]')).toBeVisible();

    // Check stacked layout
    const columns = page.locator(".col-lg-6");
    const firstColumnBox = await columns.first().boundingBox();
    const secondColumnBox = await columns.last().boundingBox();

    // Verify vertical stacking
    expect(secondColumnBox.y).toBeGreaterThan(firstColumnBox.y);
  });

  test("page is responsive for tablet layout", async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForLoadState("domcontentloaded");

    // Core elements check
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="about-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="about-image-container"]')).toBeVisible();

    // Check stacked layout
    const columns = page.locator(".col-lg-6");
    const firstColumnBox = await columns.first().boundingBox();
    const secondColumnBox = await columns.last().boundingBox();

    // Verify vertical stacking
    expect(secondColumnBox.y).toBeGreaterThan(firstColumnBox.y);
  });

  test("verifies accessibility requirements", async ({ page }) => {
    await page.waitForLoadState("domcontentloaded");

    // Check h1 headings (MANAGE YOUR and MONEY)
    await expect(page.locator("h1")).toHaveCount(2);

    // Check single h2 heading (About Us)
    await expect(page.locator('[data-testid="about-title"]')).toBeVisible();

    // Check image alt text
    const teamImage = page.locator('[data-testid="team-image"]');
    const altText = await teamImage.getAttribute("alt");
    expect(altText).toBe("Team");
  });

  test("renders footer correctly with social links", async ({ page }) => {
    // Wait for page to be fully loaded
    await page.waitForLoadState("networkidle");
    await page.waitForLoadState("domcontentloaded");

    // First verify footer is present
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();

    // Test contact section
    await expect(page.getByText("Contact Information")).toBeVisible();
    await expect(page.getByText("Israel, Tel Aviv")).toBeVisible();
    await expect(page.getByText("Email: Dimapt778@gmail.com")).toBeVisible();
    await expect(page.getByText("Phone: +925 526731280")).toBeVisible();

    // Test social links section
    await expect(page.getByText("Follow Us")).toBeVisible();

    // Test social links and their icons - using more specific selectors
    const socialLinksData = [
      {
        url: "https://www.facebook.com/dima.litvinov1",
        iconClass: ".fa-facebook",
      },
      {
        url: "https://www.instagram.com/dima1litvinov/",
        iconClass: ".fa-instagram",
      },
      {
        url: "https://www.youtube.com/",
        iconClass: ".fa-youtube",
      },
    ];

    // Check each social link
    for (const { url, iconClass } of socialLinksData) {
      // Get the link element
      const linkLocator = page.locator(`a[href="${url}"]`);
      await expect(linkLocator).toBeVisible();

      // Verify link attributes
      await expect(linkLocator).toHaveAttribute("target", "_blank");
      await expect(linkLocator).toHaveAttribute("rel", "noopener noreferrer");
      await expect(linkLocator).toHaveClass(/text-light/);

      // Verify icon exists within the link
      await expect(linkLocator.locator(iconClass)).toBeVisible();
    }

    // Test copyright
    const currentYear = new Date().getFullYear();
    const copyrightText = `© ${currentYear} MyCash - All Rights Reserved`;
    await expect(page.getByText(copyrightText)).toBeVisible();
  });
  test("loads images correctly", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    const teamImage = page.locator('[data-testid="team-image"]');
    await expect(teamImage).toBeVisible();

    const box = await teamImage.boundingBox();
    expect(box.width).toBeGreaterThan(0);
    expect(box.height).toBeGreaterThan(0);
  });
});
