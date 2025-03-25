import { format } from "date-fns";

describe("Month Calendar Navigation", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/api/transactions/monthly*", {
      statusCode: 200,
      body: {
        data: {
          transactions: [],
          total: 0,
        },
      },
    }).as("monthlyData");
    cy.intercept("GET", "**/api/categories/get*", { fixture: "categoriesData" }).as("categories");

    cy.fakeUser();
    cy.visit(`/transactions/expenses`);
    cy.url().should("include", "/transactions/expenses");
  });

  it("Open and Close months overlay when clicking the calendar title", () => {
    cy.getDataCy("calendar-title").should("be.visible");
    cy.getDataCy("months-overlay").should("not.exist");

    cy.getDataCy("calendar-title").click();
    cy.getDataCy("months-overlay").should("be.visible");

    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].forEach((month) => {
      cy.contains(month).should("be.visible");
    });

    cy.getDataCy("calendar-title").click();
    cy.getDataCy("months-overlay").should("not.exist");
  });

  it("navigates to monthly view when clicking a month", () => {
    cy.getDataCy("calendar-title").should("be.visible");
    cy.getDataCy("months-overlay").should("not.exist");

    cy.getDataCy("calendar-title").click();
    cy.contains("Aug").click();

    cy.get("@monthlyData").then((interception) => {
      const url = new URL(interception.request.url);
      const month = url.searchParams.get("month");
      const year = url.searchParams.get("year");
      const dateString = format(new Date(year, month), "MMMM yyyy");

      expect(month).to.equal("7");
      expect(year).to.equal("2025");

      cy.getDataCy("calendar-title").should("contain", dateString);
    });
    cy.getDataCy("months-overlay").should("not.exist");
  });

  it("Should navigate to Next Month", () => {
    const currentMonth = new Date().getMonth() + 1;
    cy.getDataCy("calendar-title").should("be.visible");

    cy.getDataCy("calendar-next-button").should("be.visible").click();

    cy.get("@monthlyData").then((interception) => {
      const url = new URL(interception.request.url);
      const month = url.searchParams.get("month");
      const year = url.searchParams.get("year");
      const dateString = format(new Date(year, month), "MMMM yyyy");

      expect(month).to.equal(currentMonth.toString());

      cy.getDataCy("calendar-title").should("contain", dateString);
    });
  });
  it("Should navigate to Previous Month", () => {
    const currentMonth = new Date().getMonth() - 1;
    console.log("currentMonth", currentMonth);

    cy.getDataCy("calendar-title").should("be.visible");
    cy.getDataCy("calendar-prev-button").should("be.visible").click();

    cy.get("@monthlyData").then((interception) => {
      const url = new URL(interception.request.url);
      const month = url.searchParams.get("month");
      const year = url.searchParams.get("year");
      const dateString = format(new Date(year, month), "MMMM yyyy");
      console.log("month", month);

      expect(month).to.equal(currentMonth.toString());
      cy.getDataCy("calendar-title").should("contain", dateString);
    });
  });
});
