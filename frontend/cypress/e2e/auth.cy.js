describe("login page", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("should display login page", () => {
    cy.getDataCy("login-title").should("contain", "LOGIN");
    cy.getDataCy("login-email").should("exist");
    cy.getDataCy("login-password").should("exist");
    cy.getDataCy("login-google").should("exist");
    cy.getDataCy("forgot-password").should("contain", "Forgot Password?");
    cy.getDataCy("login-submit").should("exist");

    cy.getDataCy("signup-link").click();
    cy.url().should("include", "/signup");
    cy.go("back");
  });

  it("should show validation errors in login form", () => {
    cy.getDataCy("login-submit").click();
    cy.contains("Email is required").should("be.visible");
    cy.contains("Password is required").should("be.visible");

    cy.getDataCy("login-email").type("invalid-email");
    cy.getDataCy("login-submit").click();
    cy.contains("Invalid email address").should("be.visible");

    // Test password length validation
    cy.getDataCy("login-email").clear();
    cy.getDataCy("login-password").type("12345");
    cy.getDataCy("login-submit").click();
    cy.contains("Password must be at least 6 characters").should("be.visible");
  });
  it.only("should handle successful login", () => {
    cy.loginUser();
    cy.window().its("localStorage").invoke("getItem", "persist:root").should("exist");
    cy.visit("/home");
    cy.url().should("include", "/home");
  });
});
