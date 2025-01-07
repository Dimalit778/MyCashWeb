import { format } from "date-fns";

describe("Calendar Component", () => {
  beforeEach(() => {
    cy.intercept({
      method: "GET",
      url: "**/api/transactions/monthly*",
    }).as("monthlyData");
    cy.loginUser();
    cy.visit("/transactions/expenses");
    cy.wait("@monthlyData");
  });

  // describe("Month Navigation", () => {
  //   it("handles prev month navigation", () => {
  //     cy.getDataCy("calendar-title").invoke("text");
  //     cy.getDataCy("calendar-prev-button").click();

  //     cy.wait("@monthlyData").then((interception) => {
  //       const url = new URL(interception.request.url);
  //       const params = new URLSearchParams(url.search);
  //       const month = parseInt(params.get("month"));
  //       const year = parseInt(params.get("year"));

  //       const expectedDate = new Date(year, month - 1);
  //       const expectedTitle = format(expectedDate, "MMMM yyyy");
  //       cy.getDataCy("calendar-title").should("have.text", expectedTitle);
  //     });
  //   });

  //   it("handles next month navigation", () => {
  //     cy.getDataCy("calendar-title").invoke("text");
  //     cy.getDataCy("calendar-next-button").click();

  //     cy.wait("@monthlyData").then((interception) => {
  //       const url = new URL(interception.request.url);
  //       const params = new URLSearchParams(url.search);
  //       const month = parseInt(params.get("month"));
  //       const year = parseInt(params.get("year"));

  //       const expectedDate = new Date(year, month - 1);
  //       const expectedTitle = format(expectedDate, "MMMM yyyy");
  //       cy.getDataCy("calendar-title").should("have.text", expectedTitle);
  //     });
  //   });
  // });

  describe("Year View", () => {
    beforeEach(() => {
      // Expand to year view
      cy.getDataCy("calendar-title").click();
    });

    it("expands to year view correctly", () => {
      // Check if year is displayed
      cy.getDataCy("calendar-title")
        .invoke("text")
        .should("match", /^\d{4}$/);

      // Check if months grid is visible
      cy.getDataCy("months-overlay").should("be.visible");
      cy.getDataCy("months-grid").should("be.visible");
    });

    it("highlights current month", () => {
      // Get current month
      const currentMonth = new Date().toLocaleString("default", { month: "short" });

      // Check if current month is highlighted
      cy.getDataCy(`month-button-${currentMonth.toLowerCase()}`).should("have.class", "selected");
    });

    xit("handles month selection", () => {
      // Click on March
      cy.getDataCy("month-button-mar").click();

      // Check loading state
      cy.getDataCy("loading-overlay").should("be.visible");

      // Wait for data fetch
      cy.wait("@monthlyData").then((interception) => {
        const url = new URL(interception.request.url);
        const params = new URLSearchParams(url.search);
        expect(params.get("month")).to.equal("3"); // March is month 3

        // Verify calendar shows correct month and year
        cy.getDataCy("calendar-title").should("have.text", format(new Date(2025, 2), "MMMM yyyy")); // Month 2 is March (0-based)

        // Verify months overlay is hidden
        cy.getDataCy("months-overlay").should("not.exist");
        cy.getDataCy("loading-overlay").should("not.exist");
      });
    });

    xit("handles year navigation", () => {
      // Get initial year
      cy.getDataCy("calendar-title")
        .invoke("text")
        .then((initialYear) => {
          // Click next year
          cy.getDataCy("calendar-next-button").click();
          cy.getDataCy("calendar-title").should("have.text", (parseInt(initialYear) + 1).toString());

          // Click previous year twice
          cy.getDataCy("calendar-prev-button").click().click();
          cy.getDataCy("calendar-title").should("have.text", (parseInt(initialYear) - 1).toString());
        });
    });

    xit("collapses year view on second click", () => {
      // Already expanded from beforeEach
      cy.getDataCy("months-overlay").should("be.visible");

      // Click title again to collapse
      cy.getDataCy("calendar-title").click();

      // Verify collapsed state
      cy.getDataCy("months-overlay").should("not.exist");
      cy.getDataCy("calendar-title")
        .invoke("text")
        .should("match", /^[A-Z][a-z]+ \d{4}$/); // Format: "Month YYYY"
    });
  });
});
// xit("expands to show months when clicking on title", () => {
//   // Click title to expand
//   cy.getDataCy("calendar-title").click();

//   // Should now show only year
//   cy.getDataCy("calendar-title").should("have.text", `${currentDate.getFullYear()}`);

//   // Check months grid is visible
//   cy.get(".months-grid")
//     .should("be.visible")
//     .within(() => {
//       // Check all months are present
//       const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//       months.forEach((month) => {
//         cy.contains(month).should("be.visible");
//       });

//       // Current month should have special styling
//       cy.contains("Dec").should("have.class", "current");
//     });
//   cy.getDataCy("calendar-title").click();
//   cy.getDataCy("months-overlay").should("not.exist");
// });

// it("collapses months view when clicking year again", () => {
//   // Expand
//   cy.getDataCy("calendar-title").click();
//   // Collapse
//   cy.getDataCy("calendar-title").click();

//   // Should show month and year again
//   cy.getDataCy("calendar-title").should("have.text", `${format(currentDate, "MMMM yyyy")}`);

//   // Months grid should not be visible
//   cy.get(".months-grid").should("not.exist");
// });

// xit("navigates months correctly with arrow buttons", () => {
//   // Click next month
//   cy.get(".nav-button").eq(1).click();
//   cy.getDataCy("calendar-title").should("have.text", "January 2025");

//   // Click previous month twice
//   cy.get(".nav-button").first().click();
//   cy.get(".nav-button").first().click();
//   cy.getDataCy("calendar-title").should("have.text", "November 2024");
// });

// xit("navigates years when expanded", () => {
//   // Expand calendar
//   cy.getDataCy("calendar-title").click();

//   // Click next year
//   cy.get(".nav-button").eq(1).click();
//   cy.getDataCy("calendar-title").should("have.text", currentDate.getFullYear() + 1);

//   // Click previous year
//   cy.get(".nav-button").first().click();
//   cy.getDataCy("calendar-title").should("have.text", currentDate.getFullYear() - 1);
// });

// xit("selects month and fetches new data", () => {
//   // Expand calendar
//   cy.getDataCy("calendar-title").click();

//   // Select March
//   cy.contains("Mar").click();

//   // Calendar should collapse and show March 2024
//   cy.getDataCy("calendar-title").should("have.text", "March 2024");

//   // Should show loading while fetching new data
//   cy.getDataCy("loading").should("be.visible");
//   cy.getDataCy("loading").should("not.exist");

//   // Verify API call was made with correct params
//   cy.wait("@getMonthlyTransactions").its("request.url").should("include", "month=3").and("include", "year=2024");
// });

// xit("has correct styling for current and selected months", () => {
//   cy.getDataCy("calendar-title").click();

//   cy.get(".months-grid").within(() => {
//     // Current month (December) should have current class
//     cy.contains("Dec").should("have.class", "current").should("have.css", "border-color", "rgb(255, 140, 0)"); // #ff8c00

//     // Selected month should have orange background
//     cy.contains("Dec").should("have.class", "selected").should("have.css", "background-color", "rgb(255, 140, 0)");
//   });
// });
