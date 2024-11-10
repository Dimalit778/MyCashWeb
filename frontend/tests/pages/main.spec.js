// import { test, expect } from "@playwright/test";
// import { screen } from "@testing-library/react";

// // Mock data
// const mockApiResponse = {
//   monthlyData: [
//     { month: "January", income: 5000, expense: 3000 },
//     // ... other months
//   ],
//   yearSummary: {
//     totalIncome: 60000,
//     totalExpense: 40000,
//     balance: 20000,
//   },
// };

// test.describe("Main Component", () => {
//   test.beforeEach(async ({ page }) => {
//     // Mock API response
//     await page.route("**/api/transactions/yearly**", async (route) => {
//       await route.fulfill({
//         status: 200,
//         contentType: "application/json",
//         body: JSON.stringify(mockApiResponse),
//       });
//     });
//   });

//   test("renders main components correctly", async ({ page }) => {
//     await page.goto("/");

//     // Using screen.getByTestId instead of direct page queries
//     expect(await screen.getByTestId("yearly-calendar")).toBeInTheDocument();
//     expect(await screen.getByTestId("yearly-stats")).toBeInTheDocument();
//     expect(await screen.getByTestId("yearly-line-chart")).toBeInTheDocument();
//     expect(await screen.getByTestId("categories")).toBeInTheDocument();
//   });

//   test("displays loading state", async ({ page }) => {
//     await page.route("**/api/transactions/yearly**", async (route) => {
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       await route.fulfill({
//         status: 200,
//         contentType: "application/json",
//         body: JSON.stringify(mockApiResponse),
//       });
//     });

//     await page.goto("/");

//     // Using screen queries
//     expect(await screen.getByTestId("main-skeleton")).toBeInTheDocument();
//     await expect(screen.getByTestId("yearly-stats")).toBeInTheDocument();
//     await expect(screen.queryByTestId("main-skeleton")).not.toBeInTheDocument();
//   });

//   test("handles API error correctly", async ({ page }) => {
//     await page.route("**/api/transactions/yearly**", async (route) => {
//       await route.fulfill({
//         status: 500,
//         contentType: "application/json",
//         body: JSON.stringify({ error: "Internal Server Error" }),
//       });
//     });

//     await page.goto("/");

//     // Using screen.getByText instead of page.getByText
//     expect(await screen.getByText("Failed to load data. Please try again later.")).toBeInTheDocument();
//   });

//   test("year selection updates data", async ({ page }) => {
//     await page.goto("/");

//     const newYearData = {
//       monthlyData: [{ month: "January", income: 6000, expense: 4000 }],
//       yearSummary: {
//         totalIncome: 72000,
//         totalExpense: 48000,
//         balance: 24000,
//       },
//     };

//     await page.route("**/api/transactions/yearly**", async (route) => {
//       const url = route.request().url();
//       if (url.includes("year=2023")) {
//         await route.fulfill({
//           status: 200,
//           contentType: "application/json",
//           body: JSON.stringify(newYearData),
//         });
//       }
//     });

//     // Using screen queries for interactions and assertions
//     const yearSelector = screen.getByTestId("year-selector");
//     await yearSelector.click();
//     await screen.getByText("2023").click();

//     expect(await screen.getByText("72000")).toBeInTheDocument();
//     expect(await screen.getByText("48000")).toBeInTheDocument();
//   });

//   test("data refresh on route change", async ({ page }) => {
//     let apiCallCount = 0;
//     await page.route("**/api/transactions/yearly**", async (route) => {
//       apiCallCount++;
//       await route.fulfill({
//         status: 200,
//         contentType: "application/json",
//         body: JSON.stringify(mockApiResponse),
//       });
//     });

//     await page.goto("/");
//     await page.goto("/some-other-route");
//     await page.goto("/");

//     expect(apiCallCount).toBe(2);
//   });
// });
