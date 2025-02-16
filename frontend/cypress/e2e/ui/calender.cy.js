import { format } from "date-fns";

describe("Calendar Component", () => {
  beforeEach(() => {
    cy.intercept({
      method: "GET",
      url: "**/api/transactions/monthly*",
    }).as("monthlyData");
    cy.loginUser();
    cy.visit("/transactions/expenses");
  });

  it.only("handles prev month navigation", () => {
    cy.getDataCy("calendar-title").invoke("text");
    cy.getDataCy("calendar-prev-button").click();

    cy.wait("@monthlyData").then((interception) => {
      const url = new URL(interception.request.url);
      const params = new URLSearchParams(url.search);
      console.log("prev url", url);

      const month = parseInt(params.get("month"));
      const year = parseInt(params.get("year"));
      console.log("prev month", month);
      console.log("prev year", year);

      const expectedDate = new Date(year, month - 1);
      console.log("prev expectedDate", expectedDate);

      const expectedTitle = format(expectedDate, "MMMM yyyy");
      console.log("prev expectedTitle", expectedTitle);
      cy.getDataCy("calendar-title").should("have.text", expectedTitle);
    });
  });

  it("handles next month navigation", () => {
    cy.getDataCy("calendar-title").invoke("text");
    cy.getDataCy("calendar-next-button").click();

    cy.wait("@monthlyData").then((interception) => {
      const url = new URL(interception.request.url);
      console.log("next url", url);
      const params = new URLSearchParams(url.search);

      const month = parseInt(params.get("month"));
      const year = parseInt(params.get("year"));
      console.log("next month", month);
      console.log("next year", year);
      const expectedDate = new Date(year, month);
      console.log("next expectedDate", expectedDate);
      const expectedTitle = format(expectedDate, "MMMM yyyy");
      cy.getDataCy("calendar-title").should("have.text", expectedTitle);
    });
  });
  xit("expands to year view correctly", () => {
    cy.getDataCy("calendar-title").click();
    // Check if year is displayed
    cy.getDataCy("calendar-title")
      .invoke("text")
      .should("match", /^\d{4}$/);

    // Check if months grid is visible
    cy.getDataCy("months-overlay").should("be.visible");
    cy.getDataCy("months-grid").should("be.visible");

    // Check if prev/next buttons are visible
    cy.getDataCy("calendar-prev-button").should("be.visible");
    cy.getDataCy("calendar-next-button").should("be.visible");

    // Check if month buttons are visible

    cy.getDataCy("month-button-0").should("be.visible");
    cy.getDataCy("month-button-1").should("be.visible");

    cy.getDataCy("calendar-title").click();
    cy.getDataCy("months-overlay").should("not.exist");
    cy.getDataCy("months-grid").should("not.exist");

    cy.getDataCy("calendar-title")
      .invoke("text")
      .should("match", /^[A-Z][a-z]+ \d{4}$/);
  });

  xit("highlights current month and matches URL parameters", () => {
    cy.getDataCy("calendar-title").click();
    cy.wait("@monthlyData").then((interception) => {
      // Get month from URL parameters
      const url = new URL(interception.request.url);
      const params = new URLSearchParams(url.search);
      const monthFromUrl = parseInt(params.get("month") - 1);
      const yearFromUrl = parseInt(params.get("year"));

      // // Verify button with matching month is selected
      cy.getDataCy(`month-button-${monthFromUrl}`)
        .should("have.attr", "data-selected", "true") // Check boolean attribute
        .and("have.attr", "data-month", monthFromUrl.toString()) // Check month index
        .and("have.class", "selected");

      // Verify title shows correct month/year
      cy.getDataCy("calendar-title").should("have.text", yearFromUrl.toString());
    });
  });

  xit("handles month selection", () => {
    const months = [3, 6, 9, 12];

    months.forEach((month) => {
      cy.getDataCy("calendar-title").click();
      cy.getDataCy(`month-button-${month - 1}`).click();

      cy.wait("@monthlyData").then((interception) => {
        const url = new URL(interception.request.url);
        const params = new URLSearchParams(url.search);

        const month = parseInt(params.get("month"));
        const year = parseInt(params.get("year"));

        const expectedDate = new Date(year, month - 1);
        const expectedTitle = format(expectedDate, "MMMM yyyy");

        cy.getDataCy("calendar-title").should("have.text", expectedTitle);

        cy.getDataCy("months-overlay").should("not.exist");
      });
    });
  });

  xit("handles year navigation", () => {
    cy.getDataCy("calendar-title").click();
    cy.getDataCy("calendar-title")
      .invoke("text")
      .then((initialYear) => {
        cy.getDataCy("calendar-title").should("have.text", parseInt(initialYear).toString());
        // Click next year
        cy.getDataCy("calendar-next-button").click();
        cy.getDataCy("calendar-title").should("have.text", (parseInt(initialYear) + 1).toString());
      });
    cy.getDataCy("calendar-title")
      .invoke("text")
      .then((initialYear) => {
        cy.getDataCy("calendar-title").should("have.text", parseInt(initialYear).toString());
        // Click previous year
        cy.getDataCy("calendar-prev-button").click();
        cy.getDataCy("calendar-title").should("have.text", (parseInt(initialYear) - 1).toString());
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
