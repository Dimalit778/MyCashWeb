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
  it("should handle successful login", () => {
    cy.loginUser();
    cy.window().its("localStorage").invoke("getItem", "persist:root").should("exist");
    cy.visit("/home");
    cy.url().should("include", "/home");
  });
});
describe("signup page", () => {
  beforeEach(() => {
    cy.visit("/signup");
  });
  it("should display signup page", () => {
    cy.getDataCy("signup-title").should("contain", "SIGN UP");
    cy.getDataCy("signup-email").should("exist");
    cy.getDataCy("signup-password").should("exist");
    cy.getDataCy("signup-submit").should("exist");
    cy.getDataCy("signup-google").should("exist");

    cy.getDataCy("login-link").click();
    cy.url().should("include", "/login");
    cy.go("back");
  });

  it("should show validation errors in signup form", () => {
    cy.getDataCy("signup-submit").click();
    cy.contains("Email is required").should("be.visible");
    cy.contains("Password is required").should("be.visible");

    cy.getDataCy("signup-email").type("invalid-email");
    cy.getDataCy("signup-submit").click();
    cy.contains("Invalid email address").should("be.visible");

    // Test password length validation
    cy.getDataCy("signup-email").clear();
    cy.getDataCy("signup-password").type("12345");
    cy.getDataCy("signup-submit").click();
    cy.contains("Password must be at least 6 characters").should("be.visible");
  });

  it("should handle existing user signup attempt", () => {
    // Intercept with error response
    cy.intercept("POST", "/api/auth/signup", {
      statusCode: 400,
      body: {
        message: "User already exists",
      },
    }).as("existingUserSignup");

    // Fill in the form with existing user data
    cy.getDataCy("signup-firstName").type("Existing");
    cy.getDataCy("signup-lastName").type("User");
    cy.getDataCy("signup-email").type("existing@gmail.com");
    cy.getDataCy("signup-password").type("password123");
    cy.getDataCy("signup-confirm-password").type("password123");

    // Submit form
    cy.getDataCy("signup-submit").click();

    // Wait for request and verify error message
    cy.wait("@existingUserSignup");
    cy.contains("User already exists").should("be.visible");
    cy.url().should("include", "/signup"); // Should stay on signup page
  });
  it("should handle successful signup", () => {
    // Intercept the signup request
    cy.intercept("POST", "/api/auth/signup", {
      statusCode: 201,
      body: {
        success: {
          message: "User created successfully",
          statusCode: 201,
        },
      },
    }).as("signupRequest");

    // Fill in the form
    cy.getDataCy("signup-firstName").type("John");
    cy.getDataCy("signup-lastName").type("Doe");
    cy.getDataCy("signup-email").type("john.doe@gmail.com");
    cy.getDataCy("signup-password").type("password123");
    cy.getDataCy("signup-confirm-password").type("password123");

    // Submit form
    cy.getDataCy("signup-submit").click();

    // Wait for the request and verify
    cy.wait("@signupRequest");
    cy.contains("User created successfully").should("be.visible");
    cy.url().should("include", "/login");
  });
});
