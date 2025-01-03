import { format } from "date-fns";
const checkMonthlyStats = (data) => {
  cy.getDataCy("loading").should("not.exist"); // Your LoadingOverlay component

  // Check the transaction table data
  if (data.data.transactions?.length) {
    cy.getDataCy("transactions-table")
      .find("tr")
      .should("have.length", data.data.transactions.length + 1); // +1 for header row
  }

  // // Check progress bar data
  if (data.data.total) {
    cy.getDataCy("progress-total").invoke("text").should("include", data.data.total);
  }

  // // Check if categories match the type (like in your yearly stats)
  // const type = data.data.transactions[0]?.type || "expense";
  // cy.getDataCy("category-item").each(($category) => {
  //   cy.wrap($category).should("have.attr", "data-type", type);
  // });
};
const testProgressBar = (data) => {
  const { categories } = data.data;

  cy.getDataCy("loading").should("not.exist");
  console.log("test categories", categories);

  if (!categories?.length) {
    cy.getDataCy("progress-container").should("not.exist");
    cy.contains("No Item in Progress bar").should("be.visible");
  } else {
    const sortedCategories = [...categories].sort((a, b) => b.total - a.total);
    // Check container and items existence
    cy.getDataCy("progress-container").should("be.visible");
    cy.getDataCy("progress-bar-item").should("have.length", categories.length);

    cy.get('[data-cy="progress-container"] > div')
      .invoke("css", "grid-template-columns")
      .then((gridColumns) => {
        if (categories?.length > 5) {
          expect(gridColumns.split(" ").length).to.equal(2); // For "repeat(2, 1fr)"
        } else {
          expect(gridColumns.split(" ").length).to.equal(1); // For "1fr"
        }
      });

    // Check each progress bar item
    sortedCategories.forEach((category, index) => {
      cy.getDataCy("progress-bar-item")
        .eq(index)
        .within(() => {
          cy.getDataCy("progress-bar-title").invoke("text").should("equal", category.category);

          cy.getDataCy("progress-bar-total").should("have.attr", "data-total", category.total.toString());
        });
    });
  }
};
describe("Home Page", () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth().toString();
  const currentDate = new Date();

  beforeEach(() => {
    cy.loginUser();
    cy.visit("/transactions/expenses");
    cy.url().should("include", "/transactions/expenses");

    cy.wait("@monthlyData").its("response.statusCode").should("equal", 200);
  });
  // xit("Shows monthly transaction data correctly", () => {
  //   cy.fetchMonthData({
  //     type: "expenses",
  //     year: currentYear,
  //     month: currentMonth,
  //   }).then((data) => {
  //     // checkMonthlyStats(data);
  //     testProgressBar(data);
  //   });
  // });
  describe("Calendar Month Component", () => {
    it.only("displays current month and year correctly", () => {
      cy.getDataCy("calendar-title").should("have.text", `${format(currentDate, "MMMM yyyy")}`);
      cy.getDataCy("calendar-title").click();
      cy.getDataCy("calendar-title").should("have.text", `${currentDate.getFullYear()}`);

      cy.getDataCy("months-overlay").should("be.visible");

      // cy.getDataCy("calendar-title").click();
      // cy.getDataCy("months-overlay").should("not.exist");
      // cy.getDataCy("calendar-title").should("have.text", `${format(currentDate, "MMMM yyyy")}`);
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
  });
});
