describe("Transactions Management", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/api/transactions/yearly*").as("yearlyData");

    cy.task("db:clear");
    cy.task("db:seed", { count: 25 });
    cy.loginTestUser();
    cy.visit("/home");
  });
  it("should display yearly stats with correct data", () => {
    cy.wait("@yearlyData")
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
        // cy.get(".recharts-responsive-container").should("exist");
      });
  });
});
