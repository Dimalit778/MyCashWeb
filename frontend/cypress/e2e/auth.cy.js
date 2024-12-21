describe("Authentication Flow", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  describe("Login", () => {
    it("should handle successful login", () => {
      cy.login(Cypress.env("TEST_EMAIL"), Cypress.env("TEST_PASSWORD"));
      // After login, verify redirect or success state
      cy.url().should("not.include", "/login");
      cy.url().should("include", "/home");
    });

    it("should show validation errors in login form", () => {
      // Test empty form submission
      cy.get('[data-test="login-submit"]').click();
      cy.contains("Email is required").should("be.visible");
      cy.contains("Password is required").should("be.visible");

      // Test invalid email format
      cy.get('[data-test="login-email"]').type("invalid-email");
      cy.get('[data-test="login-submit"]').click();
      cy.contains("Invalid email address").should("be.visible");

      // Test password length validation
      cy.get('[data-test="login-email"]').clear().type("test@gmail.com");
      cy.get('[data-test="login-password"]').type("12345");
      cy.get('[data-test="login-submit"]').click();
      cy.contains("Password must be at least 6 characters").should("be.visible");
    });
  });

  describe("Navigation between Auth Pages", () => {
    it("should navigate from login to signup and back", () => {
      // Go to register page
      cy.get('[data-test="goto-signup"]').click();
      cy.url().should("include", "/signup");

      // Go back to login page
      cy.get('[data-test="goto-login"]').click();
      cy.url().should("include", "/login");
    });
  });
});
