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
describe("Yearly Calendar", () => {
  before(() => {
    cy.task("db:clear-db");
    cy.task("db:seed-user");
    cy.task("db:seed-transactions", {
      count: 150,
    });
  });
  const currentYear = new Date().getFullYear();
  beforeEach(() => {
    cy.intercept("GET", "**/api/transactions/yearly*").as("yearlyData");

    cy.loginTestUser();
    cy.visit("/home");
    cy.getDataCy("loading-overlay").should("be.visible");
    cy.wait("@yearlyData");
    cy.getDataCy("loading-overlay").should("not.exist");
  });

  it("should display correct yearly statistics", () => {
    cy.get("@yearlyData").then(({ response }) => {
      const { yearlyStats } = response.body.data;

      cy.getDataCy("total-expenses").find("h5").and("have.attr", "data-amount", yearlyStats.totalExpenses.toString());

      cy.getDataCy("total-incomes").find("h5").and("have.attr", "data-amount", yearlyStats.totalIncomes.toString());

      cy.getDataCy("total-balance").find("h5").should("have.attr", "data-amount", yearlyStats.totalBalance.toString());

      if (yearlyStats.totalBalance >= 0) {
        cy.getDataCy("total-balance").find("h5").should("have.css", "color", "rgb(40, 167, 69)");
      } else {
        cy.getDataCy("total-balance").find("h5").should("have.css", "color", "rgb(220, 53, 69)");
      }
    });
  });
  it("should handle empty data gracefully", () => {
    cy.intercept("GET", "**/api/transactions/yearly*", {
      statusCode: 200,
      body: {
        data: {
          yearlyStats: {
            totalIncomes: 0,
            totalExpenses: 0,
            totalBalance: 0,
          },
          monthlyStats: [],
        },
      },
    }).as("emptyYearlyData");

    cy.visit("/home");
    cy.wait("@emptyYearlyData");

    // Verify UI handles empty data gracefully
    cy.getDataCy("year-chart").should("be.visible");
    cy.getDataCy("total-expenses").find("h5").should("contain", "$0");
    cy.getDataCy("total-incomes").find("h5").should("contain", "$0");
    cy.getDataCy("total-balance").find("h5").should("contain", "$0");
  });
  it("updates URL with next year when clicking next", () => {
    cy.getDataCy("year-display").should("contain", currentYear.toString());
    cy.getDataCy("year-next-btn").click();

    cy.wait("@yearlyData").then((interception) => {
      const url = new URL(interception.request.url);
      const yearParam = url.searchParams.get("year");

      expect(yearParam).to.equal((currentYear + 1).toString());
      cy.getDataCy("year-display").should("contain", (currentYear + 1).toString());
    });
  });

  it("updates URL with previous year when clicking previous", () => {
    cy.getDataCy("year-prev-btn").click();
    cy.wait("@yearlyData").then((interception) => {
      const url = new URL(interception.request.url);
      const yearParam = url.searchParams.get("year");

      expect(yearParam).to.equal((currentYear - 1).toString());
      cy.getDataCy("year-display").should("contain", (currentYear - 1).toString());
    });
  });

  it("should handle API error for next year", () => {
    cy.intercept("GET", `**/api/transactions/yearly?year=${currentYear + 1}`, {
      statusCode: 500,
      body: {
        message: "Server error",
      },
    }).as("getYearError");

    // Click next year
    cy.getDataCy("year-next-btn").click();
    cy.wait("@getYearError");

    // Verify error state
    cy.getDataCy("year-error").should("be.visible").and("contain", "Something went wrong");
    cy.reload();
  });
});
