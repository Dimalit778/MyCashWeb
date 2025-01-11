describe("Custom ", () => {
  beforeEach(() => {
    cy.loginUser();
    cy.visit("/transactions/expenses");
  });

  it("should handle loading states", () => {
    // cy.getDataCy("loading").should("be.visible");
    cy.intercept({
      method: "GET",
      url: "**/api/transactions/monthly*",
    }).as("monthlyData");
    cy.wait("@monthlyData").then(({ response }) => {
      console.log("interception", response);
    });
    // cy.getDataCy("loading").should("not.exist");
  });
});
