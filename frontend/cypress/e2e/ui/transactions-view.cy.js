import { format } from "date-fns";
import { isMobile } from "../../support/utils";

describe("app layout and responsiveness", () => {
  beforeEach(() => {
    cy.setupApiMonitors();
    cy.loginUser();
    cy.visit("/transactions/expenses");
  });
  describe("should display responsive navbar", () => {
    it("should display responsive navbar", () => {
      if (isMobile()) {
        cy.getDataCy("bottom-nav").should("be.visible");
        cy.getDataCy("topBar").should("be.visible");
        cy.getDataCy("left-sidebar").should("not.be.visible");
      } else {
        cy.getDataCy("bottom-nav").should("not.be.visible");
        cy.getDataCy("topBar").should("not.be.visible");
        cy.getDataCy("left-sidebar").should("be.visible");
      }
    });
  });
  describe("should display calendar component", () => {
    it("displays current month and year correctly", () => {
      cy.getDataCy("calendar-title").should("be.visible");
      cy.wait("@monthlyData").then((interception) => {
        const url = new URL(interception.request.url);
        const searchParams = new URLSearchParams(url.search);

        const month = parseInt(searchParams.get("month"));
        const year = parseInt(searchParams.get("year"));

        const date = new Date(year, month - 1);
        const expectedTitle = format(date, "MMMM yyyy");

        cy.getDataCy("calendar-title").should("have.text", expectedTitle);
      });
    });
    //   cy.getDataCy("calendar-title").should("have.text", `${format(currentDate, "MMMM yyyy")}`);
    //   cy.getDataCy("calendar-title").click();
    //   cy.getDataCy("calendar-title").should("have.text", `${currentDate.getFullYear()}`);

    //   cy.getDataCy("months-overlay").should("be.visible");

    //   cy.getDataCy("calendar-title").click();
    //   cy.getDataCy("months-overlay").should("not.exist");
    //   cy.getDataCy("calendar-title").should("have.text", `${format(currentDate, "MMMM yyyy")}`);
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
