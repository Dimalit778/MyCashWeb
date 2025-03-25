import { format, addMonths, subMonths } from "date-fns";

describe("Month Calendar Navigation", () => {
  before(() => {
    cy.task("db:clear-db");
    cy.task("db:seed-user");
    cy.task("db:seed-transactions", {
      count: 15,
      type: "expenses",
    });
  });

  beforeEach(() => {
    cy.intercept("GET", "**/api/transactions/monthly*").as("monthlyData");
    cy.intercept("GET", "**/api/categories/get*").as("categories");

    cy.loginTestUser();
    cy.visit(`/transactions/expenses`);
    cy.url().should("include", "/transactions/expenses");
    cy.wait(["@monthlyData", "@categories"]);
  });

  it("should open and close months overlay when clicking the calendar title", () => {
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

  it("should navigate to monthly view when clicking a month", () => {
    const testMonth = "Aug";
    const monthIndex = 7; // 0-based month index for August
    cy.getDataCy("calendar-title")
      .invoke("text")
      .then((currentDateText) => {
        const currentYear = parseInt(currentDateText.split(" ")[1]);

        cy.getDataCy("calendar-title").click();
        cy.contains(testMonth).click();

        cy.wait("@monthlyData").then((interception) => {
          const url = new URL(interception.request.url);
          expect(url.searchParams.get("month")).to.equal(monthIndex.toString());
          expect(url.searchParams.get("year")).to.equal(currentYear.toString());

          // Verify UI updates correctly
          cy.getDataCy("calendar-title").should("contain", `August ${currentYear}`);
        });
        cy.getDataCy("months-overlay").should("not.exist");
      });
  });

  it("should navigate to next month when clicking next button", () => {
    cy.getDataCy("calendar-title")
      .invoke("text")
      .then((currentDate) => {
        const dateParts = currentDate.trim().split(" ");
        const monthName = dateParts[0];
        const currentYear = parseInt(dateParts[1]);
        const currentMonth = new Date(`${monthName} 1, ${currentYear}`).getMonth();

        const nextDate = addMonths(new Date(currentYear, currentMonth), 1);
        const expectedMonthIndex = nextDate.getMonth();
        const expectedMonthName = format(nextDate, "MMMM");
        const expectedYear = nextDate.getFullYear();

        cy.getDataCy("calendar-next-button").click();

        cy.wait("@monthlyData").then((interception) => {
          const url = new URL(interception.request.url);
          const actualMonth = url.searchParams.get("month");

          expect(parseInt(actualMonth)).to.equal(expectedMonthIndex);
          expect(url.searchParams.get("year")).to.equal(expectedYear.toString());
          cy.getDataCy("calendar-title").should("contain", `${expectedMonthName} ${expectedYear}`);
        });
      });
  });

  it("should navigate to previous month when clicking previous button", () => {
    cy.getDataCy("calendar-title")
      .invoke("text")
      .then((currentDate) => {
        const dateParts = currentDate.trim().split(" ");
        const monthName = dateParts[0];
        const currentYear = parseInt(dateParts[1]);
        const currentMonth = new Date(`${monthName} 1, ${currentYear}`).getMonth();

        const prevDate = subMonths(new Date(currentYear, currentMonth), 1);
        const expectedMonthIndex = prevDate.getMonth();
        const expectedMonthName = format(prevDate, "MMMM");
        const expectedYear = prevDate.getFullYear();

        cy.getDataCy("calendar-prev-button").click();

        cy.wait("@monthlyData").then((interception) => {
          const url = new URL(interception.request.url);
          expect(url.searchParams.get("month")).to.equal(expectedMonthIndex.toString());
          expect(url.searchParams.get("year")).to.equal(expectedYear.toString());

          cy.getDataCy("calendar-title").should("contain", `${expectedMonthName} ${expectedYear}`);
        });
      });
  });
});
