describe("Transactions Management", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/api/transactions/yearly*").as("yearlyData");

    cy.task("db:clear");
    cy.task("db:seed", { count: 25 });
    cy.loginTestUser();
    cy.visit("/home");
    cy.wait("@yearlyData");
  });
  it("should display yearly stats with correct data", () => {
    cy.get("@yearlyData")
      .its("response.body.data")
      .then((data) => {
        cy.getDataCy("year-stats").should("be.visible");

        cy.getDataCy("total-expenses").within(() => {
          cy.get("h3").should("be.visible").and("have.text", "Expenses");
          cy.get("h5").should("be.visible").and("have.attr", "data-amount", data.yearlyStats.totalExpenses.toString());
        });

        cy.getDataCy("total-balance").within(() => {
          cy.get("h3").should("be.visible").and("have.text", "Balance");
          cy.get("h5").should("be.visible").and("have.attr", "data-amount", data.yearlyStats.totalBalance.toString());
        });

        cy.getDataCy("total-incomes").within(() => {
          cy.get("h3").should("be.visible").and("have.text", "Incomes");
          cy.get("h5").should("be.visible").and("have.attr", "data-amount", data.yearlyStats.totalIncomes.toString());
        });

        // Check for chart/graph elements
        cy.getDataCy("year-chart").should("exist");
      });
  });
  it("should navigate next Year when clicking '>' button", () => {
    cy.getDataCy("year-display")
      .invoke("text")
      .then((text) => {
        let currentYear = parseInt(text.trim());
        cy.getDataCy("year-next-btn").click();

        cy.wait("@yearlyData").then((interception) => {
          const url = new URL(interception.request.url);
          const year = url.searchParams.get("year");
          expect(parseInt(year)).to.equal(currentYear + 1);
        });
        cy.getDataCy("year-display").should("contain", currentYear + 1);
      });
  });

  it("should navigate to previous Year when clicking '<' button", () => {
    cy.getDataCy("year-display")
      .invoke("text")
      .then((text) => {
        let currentYear = parseInt(text.trim());
        cy.getDataCy("year-prev-btn").click();

        cy.wait("@yearlyData").then((interception) => {
          const url = new URL(interception.request.url);
          const year = url.searchParams.get("year");
          expect(parseInt(year)).to.equal(currentYear - 1);
        });
        cy.getDataCy("year-display").should("contain", currentYear - 1);
      });
  });
});
