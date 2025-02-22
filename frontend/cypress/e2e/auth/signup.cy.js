// cypress/e2e/auth/signup.cy.js

describe("SignUp Page", () => {
  beforeEach(() => {
    cy.visit("/signup");
  });

  describe("Form Elements", () => {
    it("should display all form elements correctly", () => {
      cy.getDataCy("signup-title").should("be.visible").and("contain", "SIGN UP");
      cy.getDataCy("signup-firstName").should("be.visible");
      cy.getDataCy("signup-lastName").should("be.visible");
      cy.getDataCy("signup-email").should("be.visible");
      cy.getDataCy("signup-password").should("be.visible");
      cy.getDataCy("signup-confirm-password").should("be.visible");

      cy.getDataCy("signup-submit").should("be.visible");
      cy.getDataCy("signup-google").should("be.visible");
      cy.getDataCy("goto-login").should("be.visible");
    });

    it("should toggle password visibility", () => {
      cy.getDataCy("signup-password").find("input").should("have.attr", "type", "password");
      cy.getDataCy("signup-password").find("button").click();
      cy.getDataCy("signup-password").find("input").should("have.attr", "type", "text");

      // Check confirm password field
      cy.getDataCy("signup-confirm-password").find("input").should("have.attr", "type", "password");
      cy.getDataCy("signup-confirm-password").find("button").click();
      cy.getDataCy("signup-confirm-password").find("input").should("have.attr", "type", "text");
    });
  });

  describe("Form Validation", () => {
    it("should show validation errors for empty fields", () => {
      const invalidEmails = ["invalid", "invalid@", "invalid@gmail", "@gmail.com", "invalid@.com"];
      cy.getDataCy("signup-submit").click();
      invalidEmails.forEach((email) => {
        cy.getDataCy("signup-email").find("input").clear();
        cy.getDataCy("signup-email").find("input").type(email);
        cy.getDataCy("signup-submit").click();
        cy.contains("Invalid email address").should("be.visible");
        cy.contains("Password is required").should("be.visible");
      });
    });

    it("should validate name length", () => {
      cy.getDataCy("signup-firstName").find("input").type("A");
      cy.getDataCy("signup-submit").click();
      cy.contains("First name must be at least 2 characters").should("be.visible");

      cy.getDataCy("signup-lastName").find("input").type("B");
      cy.getDataCy("signup-submit").click();
      cy.contains("Last name must be at least 2 characters").should("be.visible");
    });

    it("should validate password match", () => {
      cy.getDataCy("signup-password").find("input").type("password123");
      cy.getDataCy("signup-confirm-password").find("input").type("password456");
      cy.getDataCy("signup-submit").click();
      cy.contains("Passwords do not match").should("be.visible");
    });
  });
  describe("Email Validation", () => {
    it("should validate email format", () => {
      // Test empty email
      cy.getDataCy("login-submit").click();
      cy.contains("Email is required").should("be.visible");

      // Test invalid email format
      cy.getDataCy("login-email").find("input").type("invalidemail");
      cy.getDataCy("login-submit").click();
      cy.contains("Invalid email address").should("be.visible");
    });

    it("should validate email domain", () => {
      const invalidDomains = ["user@invalid.com", "user@wrong.org", "user@fake.net"];

      invalidDomains.forEach((email) => {
        cy.getDataCy("login-email").find("input").clear();
        cy.getDataCy("login-email").find("input").type(email);
        cy.getDataCy("login-submit").click();
        cy.contains("Please use a valid email").should("be.visible");
      });

      // Test valid domains
      const validDomains = ["user@gmail.com", "user@yahoo.com", "user@hotmail.com", "user@outlook.com"];

      validDomains.forEach((email) => {
        cy.getDataCy("login-email").find("input").clear();
        cy.getDataCy("login-email").find("input").type(email);
        cy.getDataCy("login-submit").click();
        cy.contains("Please use a valid email").should("not.exist");
      });
    });

    it("should validate restricted words in email", () => {
      // Test admin restriction
      cy.getDataCy("login-email").find("input").clear();
      cy.getDataCy("login-email").find("input").type("admin@gmail.com");
      cy.getDataCy("login-submit").click();
      cy.contains('Email cannot contain word "admin"').should("be.visible");

      // Test test restriction
      cy.getDataCy("login-email").find("input").clear();
      cy.getDataCy("login-email").find("input").type("test@gmail.com");
      cy.getDataCy("login-submit").click();
      cy.contains('Email cannot contain word "test"').should("be.visible");

      // Valid email without restricted words
      cy.getDataCy("login-email").find("input").clear();
      cy.getDataCy("login-email").find("input").type("user@gmail.com");
      cy.getDataCy("login-submit").click();
      cy.contains("Email cannot contain word").should("not.exist");
    });
  });

  describe("Form Submission", () => {
    it("should handle successful signup", () => {
      // Mock successful signup response
      cy.intercept("POST", "**/api/auth/signup", {
        statusCode: 200,
        body: {
          success: {
            message: "Registration successful",
          },
        },
      }).as("signupRequest");

      // Fill form with valid data
      cy.getDataCy("signup-firstName").find("input").type("John");
      cy.getDataCy("signup-lastName").find("input").type("Doe");
      cy.getDataCy("signup-email").find("input").type("john.doe@gmail.com");
      cy.getDataCy("signup-password").find("input").type("password123");
      cy.getDataCy("signup-confirm-password").find("input").type("password123");

      // Submit form
      cy.getDataCy("signup-submit").click();

      // Verify request and response
      cy.wait("@signupRequest");
      cy.contains("Registration successful").should("be.visible");
      cy.url().should("include", "/login");
    });

    it("should handle signup failure", () => {
      // Mock failed signup response
      cy.intercept("POST", "**/api/auth/signup", {
        statusCode: 400,
        body: {
          message: "User already exists",
        },
      }).as("signupRequest");

      // Fill form
      cy.getDataCy("signup-firstName").find("input").type("John");
      cy.getDataCy("signup-lastName").find("input").type("Doe");
      cy.getDataCy("signup-email").find("input").type("existing@gmail.com");
      cy.getDataCy("signup-password").find("input").type("password123");
      cy.getDataCy("signup-confirm-password").find("input").type("password123");

      // Submit form
      cy.getDataCy("signup-submit").click();

      // Verify error message
      cy.wait("@signupRequest");
      cy.contains("User already exists").should("be.visible");
      cy.url().should("include", "/signup");
    });

    it("should handle Google signup", () => {
      cy.getDataCy("signup-google").click();
      cy.contains("Google Sign-Up not implemented yet").should("be.visible");
    });
  });

  describe("Navigation", () => {
    it("should navigate to login page", () => {
      cy.getDataCy("goto-login").click();
      cy.url().should("include", "/login");
    });
  });

  describe("Loading State", () => {
    it("should show loading state during submission", () => {
      // Mock delayed response
      cy.intercept("POST", "**/api/auth/signup", {
        delay: 1000,
        statusCode: 200,
        body: {
          success: {
            message: "Registration successful",
          },
        },
      }).as("signupRequest");

      // Fill and submit form
      cy.getDataCy("signup-firstName").find("input").type("John");
      cy.getDataCy("signup-lastName").find("input").type("Doe");
      cy.getDataCy("signup-email").find("input").type("john.doe@gmail.com");
      cy.getDataCy("signup-password").find("input").type("password123");
      cy.getDataCy("signup-confirm-password").find("input").type("password123");
      cy.getDataCy("signup-submit").click();

      // Verify loading state
      cy.getDataCy("signup-submit").should("be.disabled");
      cy.getDataCy("signup-google").should("be.disabled");
    });
  });
});
