describe("Update Transactions ", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/api/transactions/monthly*").as("monthlyData");
    cy.intercept("PATCH", "**/api/transactions/update*").as("updateTransaction");

    cy.loginTestUser();
    cy.visit(`/transactions/expenses`);
    cy.wait("@monthlyData");
  });
  it("Edit Form Validation errors", () => {
    cy.getDataCy("transactions-row").should("exist");
    cy.getDataCy("transactions-row").first().click();

    cy.getDataCy("transaction-modal").within(() => {
      cy.getDataCy("modal-submit").should("be.disabled");
      cy.getDataCy("modal-description").find("input");

      cy.getDataCy("modal-amount").find("input").focus();

      cy.getDataCy("modal-amount").find("input").blur();

      cy.getDataCy("modal-description").find("input").focus();

      cy.getDataCy("modal-submit").should("be.disabled");

      cy.getDataCy("modal-description").find("input").clear();
      cy.getDataCy("modal-description").find("input").type("Updated Transaction");

      cy.getDataCy("modal-submit").should("be.enabled");

      cy.getDataCy("modal-cancel").click();
    });

    cy.getDataCy("transaction-modal").should("not.exist");
  });
  it("Edit Update Transaction Successfully", () => {
    cy.getDataCy("transactions-row").first().click();
    cy.getDataCy("transaction-modal").should("be.exist");
    cy.getDataCy("modal-submit").should("be.disabled");

    cy.getDataCy("transaction-modal").within(() => {
      cy.getDataCy("modal-description").clear();
      cy.getDataCy("modal-description").type("Updated Transaction");
      cy.getDataCy("modal-amount").clear();
      cy.getDataCy("modal-amount").type("150");
      cy.getDataCy("modal-category").select(1);
      cy.getDataCy("modal-date").clear();
      cy.getDataCy("modal-date").type(new Date().toISOString().split("T")[0]);
      cy.getDataCy("modal-submit").click();
    });

    cy.wait("@updateTransaction").then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });
    cy.getDataCy("transaction-modal").should("not.exist");
    cy.contains("Successfully updated").should("be.visible");
  });
});
