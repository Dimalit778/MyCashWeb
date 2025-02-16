describe("Signup", () => {
  beforeEach(() => {
    cy.visit("/signup");
  });

  it("should handle successful signup", () => {
    cy.getDataCy("signup-firstName").type("Test");
    cy.getDataCy("signup-lastName").type("User");
    cy.getDataCy("signup-email").type("test@example.com");
    cy.getDataCy("signup-password").type("password123");
    cy.getDataCy("signup-confirm-password").type("password123");
    cy.getDataCy("signup-submit").click();

    cy.url().should("include", "/login");
  });
});
