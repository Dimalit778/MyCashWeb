describe("Login Page", () => {
  beforeEach(() => {
    cy.task("db:seed");
    cy.visit("/login");
  });

  describe("Form Elements", () => {
    it("should display all login form elements correctly", () => {
      cy.getDataCy("login-title").should("contain", "LOGIN");
      cy.getDataCy("login-email").should("exist");
      cy.getDataCy("login-password").should("exist");
      cy.getDataCy("login-submit").should("exist");
      cy.getDataCy("login-google").should("exist");
      cy.getDataCy("forgot-password").should("contain", "Forgot Password?");

      cy.getDataCy("signup-link").should("exist");
      cy.getDataCy("goto-signup").should("exist");
    });

    it("should toggle password visibility", () => {
      cy.getDataCy("login-password").find("input").should("have.attr", "type", "password");

      cy.getDataCy("login-password").find("button").click();
      cy.getDataCy("login-password").find("input").should("have.attr", "type", "text");

      cy.getDataCy("login-password").find("button").click();
      cy.getDataCy("login-password").find("input").should("have.attr", "type", "password");
    });
  });

  describe("Form Validation", () => {
    it("should show validation errors for empty fields", () => {
      cy.getDataCy("login-submit").click();

      cy.contains("Email is required").should("be.visible");
      cy.contains("Password is required").should("be.visible");
    });

    it("should validate email format", () => {
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

    it("should validate password length", () => {
      // Test password length validation
      cy.getDataCy("login-email").find("input").type("test@example.com");
      cy.getDataCy("login-password").find("input").type("12345");
      cy.getDataCy("login-submit").click();
      cy.getDataCy("error-message").should("contain", "Password must be at least 6 characters");
    });
  });

  describe("Login Attempts", () => {
    it("should handle invalid credentials", () => {
      cy.intercept("POST", "**/api/auth/login*", {
        statusCode: 401,
        body: {
          message: "User not found",
        },
      }).as("loginAttempt");

      cy.getDataCy("login-email").find("input").type("sda@gmail.com");
      cy.getDataCy("login-password").find("input").type("wrongPassword");
      cy.getDataCy("login-submit").click();

      cy.wait("@loginAttempt");
      cy.contains("User not found").should("be.visible");
    });

    it("should handle server errors", () => {
      cy.intercept("POST", "**/api/auth/login", {
        statusCode: 500,
        body: {
          message: "Internal server error",
        },
      }).as("loginError");

      // Try to login
      cy.getDataCy("login-email").find("input").type("login@gmail.com");
      cy.getDataCy("login-password").find("input").type("password123");
      cy.getDataCy("login-submit").click();

      // Verify error handling
      cy.wait("@loginError");
      cy.contains("Internal server error").should("be.visible");
    });

    it("should handle successful login", () => {
      cy.fixture("user.json").then((userData) => {
        cy.intercept("POST", "**/api/auth/login", {
          statusCode: 200,
          body: {
            data: userData.data,
          },
        }).as("successfulLogin");

        cy.getDataCy("login-email").find("input").type(Cypress.env("TEST_EMAIL"));
        cy.getDataCy("login-password").find("input").type(Cypress.env("TEST_PASSWORD"));
        cy.getDataCy("login-submit").click();

        // Verify successful login
        cy.wait("@successfulLogin");

        // After successful login, the app should redirect to home
        cy.url().should("include", "/home");

        // You can also verify that elements on the home page are visible
        cy.getDataCy("year-calender").should("exist");
      });
    });
  });

  describe("Navigation", () => {
    it("should navigate to signup page", () => {
      cy.getDataCy("goto-signup").click();
      cy.url().should("include", "/signup");
    });

    xit("should navigate to forgot password page", () => {
      cy.getDataCy("forgot-password").click();
      cy.url().should("include", "/forgot-password");
    });
  });
});
