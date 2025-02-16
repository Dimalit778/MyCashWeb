describe("Login Page", () => {
  beforeEach(() => {
    // Reset any previous state and visit login page
    cy.visit("/login");
  });

  describe("UI Elements", () => {
    it("should display all login form elements correctly", () => {
      // Check all elements exist and are visible
      cy.getDataCy("login-title").should("contain", "LOGIN");
      cy.getDataCy("login-email").should("exist");
      cy.getDataCy("login-password").should("exist");
      cy.getDataCy("login-submit").should("exist");
      cy.getDataCy("login-google").should("exist");
      cy.getDataCy("forgot-password").should("contain", "Forgot Password?");

      // Check navigation links
      cy.getDataCy("signup-link").should("exist");
      cy.getDataCy("goto-signup").should("exist");
    });

    it("should toggle password visibility", () => {
      // Initial state - password should be hidden
      cy.getDataCy("login-password").find("input").should("have.attr", "type", "password");

      // Click eye icon to show password
      cy.get('[data-cy="login-password"] button').click();
      cy.getDataCy("login-password").find("input").should("have.attr", "type", "text");

      // Click again to hide password
      cy.get('[data-cy="login-password"] button').click();
      cy.getDataCy("login-password").find("input").should("have.attr", "type", "password");
    });
  });

  describe("Form Validation", () => {
    it("should show validation errors for empty fields", () => {
      // Click submit without entering any data
      cy.getDataCy("login-submit").click();

      // Check error messages
      cy.contains("Email is required").should("be.visible");
      cy.contains("Password is required").should("be.visible");
    });

    it("should validate email format", () => {
      // Test invalid email formats
      const invalidEmails = ["invalid", "invalid@", "invalid@gmail", "@gmail.com", "invalid@.com"];

      invalidEmails.forEach((email) => {
        cy.getDataCy("login-email").find("input").clear();
        cy.get('[data-cy="login-email"] input').type(email);
        cy.getDataCy("login-submit").click();
        cy.getDataCy("error-message").should("contain", "Invalid email address");
      });
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
      // Intercept login request with error response
      cy.intercept("POST", "/api/auth/login", {
        statusCode: 401,
        body: {
          message: "Invalid email or password",
        },
      }).as("loginAttempt");

      // Try to login with invalid credentials
      cy.getDataCy("login-email").find("input").type("wrong@email.com");
      cy.getDataCy("login-password").find("input").type("wrongpassword");
      cy.getDataCy("login-submit").click();

      // Verify error handling
      cy.wait("@loginAttempt");
      cy.contains("Invalid email or password").should("be.visible");
    });

    it("should handle server errors", () => {
      // Intercept login request with server error
      cy.intercept("POST", "/api/auth/login", {
        statusCode: 500,
        body: {
          message: "Internal server error",
        },
      }).as("loginError");

      // Try to login
      cy.getDataCy("login-email").find("input").type("test@example.com");
      cy.getDataCy("login-password").find("input").type("password123");
      cy.getDataCy("login-submit").click();

      // Verify error handling
      cy.wait("@loginError");
      cy.contains("Internal server error").should("be.visible");
    });

    it("should handle successful login", () => {
      // Intercept successful login request
      cy.intercept("POST", "/api/auth/login", {
        statusCode: 200,
        body: {
          data: {
            accessToken: "fake-token",
            user: {
              id: "1",
              email: "test@example.com",
              firstName: "Test",
              lastName: "User",
            },
          },
        },
      }).as("successfulLogin");

      // Perform login
      cy.getDataCy("login-email").find("input").type("test@example.com");
      cy.getDataCy("login-password").find("input").type("password123");
      cy.getDataCy("login-submit").click();

      // Verify successful login
      cy.wait("@successfulLogin");
      cy.url().should("include", "/home");
    });

    xit("should handle Google login", () => {
      // Intercept Google auth request
      cy.intercept("POST", "/api/auth/google", {
        statusCode: 200,
        body: {
          data: {
            accessToken: "fake-google-token",
            user: {
              id: "1",
              email: "test@gmail.com",
              firstName: "Google",
              lastName: "User",
            },
          },
        },
      }).as("googleLogin");

      // Click Google login button
      cy.getDataCy("login-google").click();

      // Verify redirect after successful Google login
      cy.wait("@googleLogin");
      cy.url().should("include", "/home");
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

  describe("Loading States", () => {
    it("should show loading state during login attempt", () => {
      // Intercept login with delay
      cy.intercept("POST", "/api/auth/login", (req) => {
        req.reply({
          delay: 1000,
          statusCode: 200,
          body: {
            data: {
              accessToken: "fake-token",
              user: {
                id: "1",
                email: "test@example.com",
              },
            },
          },
        });
      }).as("delayedLogin");

      // Start login
      cy.getDataCy("login-email").find("input").type("test@example.com");
      cy.getDataCy("login-password").find("input").type("password123");
      cy.getDataCy("login-submit").click();

      // Verify loading state
      cy.getDataCy("login-submit").should("be.disabled");
      cy.get(".spinner-border").should("be.visible");

      // Verify completion
      cy.wait("@delayedLogin");
      cy.get(".spinner-border").should("not.exist");
    });
  });
});
