Cypress.Commands.add("setupApiMonitors", () => {
  cy.intercept("GET", "**/api/transactions/monthly*").as("monthlyData");
  cy.intercept("GET", "**/api/transactions/yearly*").as("yearlyData");
  cy.intercept("GET", "**/api/categories/get*").as("categories");
});
