describe("Authentication Flow", () => {
  beforeEach(() => {
    cy.visit(Cypress.env("BASE_URL"));
  });

  describe("Login", () => {
    beforeEach(() => {
      cy.get('[data-testid="login-link"]').click();
    });

    it("should show validation errors for invalid email and password", () => {
      // Click submit without filling fields
      cy.get('[data-test="login-submit"]').click();
      cy.contains("Email is required").should("be.visible");
      cy.contains("Password is required").should("be.visible");

      // Test invalid email format
      cy.get('[data-test="login-email"]').type("invalid-email");
      cy.get('[data-test="login-password"]').type("123456");
      cy.get('[data-test="login-submit"]').click();
      cy.contains("Invalid email address").should("be.visible");

      // Test password length validation
      cy.get('[data-test="login-email"]').clear().type("test@gmail.com");
      cy.get('[data-test="login-password"]').clear().type("123");
      cy.get('[data-test="login-submit"]').click();
      cy.contains("Password must be at least 6 characters").should("be.visible");
    });

    it("should handle successful login", () => {
      cy.intercept("POST", Cypress.env("API_URL") + "/api/auth/login", {
        statusCode: 200,
        body: {
          success: true,
          user: { id: 1, email: "dimitryd.l@gmail.com" },
        },
      }).as("loginRequest");

      cy.fillLoginForm("dimitryd.l@gmail.com", "144695");
      cy.get('[data-test="login-submit"]').click();

      cy.wait("@loginRequest");
      // cy.url().should("include", "/home");

      // Verify user is stored in localStorage
      cy.window().its("localStorage.user").should("exist").and("include", "dimitryd.l@gmail.com");
    });

    it("should handle failed login", () => {
      // Intercept failed login attempt
      cy.intercept("POST", Cypress.env("API_URL") + "/api/auth/login", {
        statusCode: 401,
        body: { message: "Invalid credentials" },
      }).as("failedLogin");

      cy.get('[data-test="login-email"]').type("test@gmail.com");
      cy.get('[data-test="login-password"]').type("wrongpassword");
      cy.get('[data-test="login-submit"]').click();

      cy.wait("@failedLogin");
      cy.contains("Invalid credentials").should("be.visible");
    });
  });

  // describe("Sign Up", () => {
  //   beforeEach(() => {
  //     cy.get('[data-testid="signup-link"]').click();
  //   });

  //   it("should validate signup form fields", () => {
  //     // Test required fields
  //     cy.get('button[type="submit"]').click();
  //     cy.contains("First name is required").should("be.visible");
  //     cy.contains("Last name is required").should("be.visible");
  //     cy.contains("Email is required").should("be.visible");
  //     cy.contains("Password is required").should("be.visible");

  //     // Test email validation
  //     cy.get('input[name="email"]').type("admin@gmail.com");
  //     cy.contains('Email cannot contain word "admin"').should("be.visible");

  //     cy.get('input[name="email"]').clear().type("test@invalid.com");
  //     cy.contains("Please use a valid email").should("be.visible");

  //     // Test password matching
  //     cy.get('input[name="password"]').type("123456");
  //     cy.get('input[name="confirmPassword"]').type("123457");
  //     cy.contains("Passwords do not match").should("be.visible");
  //   });

  //   it("should handle successful registration", () => {
  //     cy.intercept("POST", "/api/auth/signup", {
  //       statusCode: 200,
  //       body: { success: true },
  //     }).as("signupRequest");

  //     // Fill in valid registration data
  //     cy.get('input[name="firstName"]').type("John");
  //     cy.get('input[name="lastName"]').type("Doe");
  //     cy.get('input[name="email"]').type("john.doe@gmail.com");
  //     cy.get('input[name="password"]').type("123456");
  //     cy.get('input[name="confirmPassword"]').type("123456");
  //     cy.get('button[type="submit"]').click();

  //     cy.wait("@signupRequest");
  //     cy.contains("Registration successful!").should("be.visible");
  //   });

  //   it("should toggle password visibility", () => {
  //     // Test password field
  //     cy.get('input[name="password"]').type("123456");
  //     cy.get('input[name="password"]').should("have.attr", "type", "password");
  //     cy.get('input[name="password"]').parent().find("button").click();
  //     cy.get('input[name="password"]').should("have.attr", "type", "text");

  //     // Test confirm password field
  //     cy.get('input[name="confirmPassword"]').type("123456");
  //     cy.get('input[name="confirmPassword"]').should("have.attr", "type", "password");
  //     cy.get('input[name="confirmPassword"]').parent().find("button").click();
  //     cy.get('input[name="confirmPassword"]').should("have.attr", "type", "text");
  //   });
  // });

  describe("Navigation", () => {
    it("should navigate between login and signup pages", () => {
      // Login to Signup
      cy.get('[data-testid="login-link"]').click();
      cy.get("button").contains("Register").click();
      cy.url().should("include", "/register");

      // Signup to Login
      cy.get("a").contains("Login").click();
      cy.url().should("include", "/login");
    });

    it("should handle forgot password navigation", () => {
      cy.get('[data-testid="login-link"]').click();
      cy.get("a").contains("Forgot password?").click();
      cy.url().should("include", "/forgot-password");
    });
  });
});
