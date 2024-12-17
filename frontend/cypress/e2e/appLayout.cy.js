// cypress/e2e/layout.cy.js
describe("Layout Navigation and Authentication Tests", () => {
  beforeEach(() => {
    // Reset any previous state
    cy.clearLocalStorage();
    cy.visit("/");
  });

  describe("Public Layout", () => {
    it("should navigate between public routes", () => {
      // Test navigation to signup
      cy.get('[data-testid="signup-link"]').click();
      cy.url().should("include", "/signup");

      // Test navigation to login
      cy.get('[data-testid="login-link"]').click();
      cy.url().should("include", "/login");
    });
  });
  // describe("Main Layout", () => {
  //   beforeEach(() => {
  //     // Mock authenticated user before each test
  //     cy.window().then((win) => {
  //       win.localStorage.setItem("user", JSON.stringify({ id: 1, name: "Test User" }));
  //     });
  //   });

  //   it("should show main layout components when authenticated", () => {
  //     cy.visit("/home");
  //     cy.get('[data-testid="nav-profile-icon"]').should("be.visible");

  //     // Test desktop view
  //     cy.viewport(1200, 800);
  //     cy.get(".d-none.d-md-block").should("be.visible"); // Left sidebar
  //     cy.get(".d-md-none").should("not.be.visible"); // Bottom bar

  //     // Test mobile view
  //     cy.viewport(375, 812);
  //     cy.get(".d-none.d-md-block").should("not.be.visible"); // Left sidebar
  //     cy.get(".d-md-none").should("be.visible"); // Bottom bar
  //   });

  //   it("should redirect to landing when unauthenticated user tries to access protected routes", () => {
  //     cy.clearLocalStorage();
  //     cy.visit("/home");
  //     cy.url().should("equal", Cypress.config().baseUrl + "/");
  //   });

  //   it("should navigate between protected routes", () => {
  //     cy.visit("/home");

  //     // Test navigation to transactions
  //     cy.visit("/transactions/all");
  //     cy.url().should("include", "/transactions/all");

  //     // Test navigation to settings
  //     cy.visit("/settings");
  //     cy.url().should("include", "/settings");
  //   });

  //   it("should handle logout correctly", () => {
  //     cy.visit("/home");
  //     cy.get('[data-testid="nav-profile-icon"]').click();

  //     // After logout, should redirect to landing and show public layout
  //     cy.url().should("equal", Cypress.config().baseUrl + "/");
  //     cy.get('a[href="/signup"]').should("be.visible");
  //     cy.get('a[href="/login"]').should("be.visible");
  //   });
  // });

  // describe("Responsive Layout", () => {
  //   beforeEach(() => {
  //     cy.window().then((win) => {
  //       win.localStorage.setItem("user", JSON.stringify({ id: 1, name: "Test User" }));
  //     });
  //     cy.visit("/home");
  //   });

  //   it("should show/hide components based on viewport size", () => {
  //     // Desktop view
  //     cy.viewport(1200, 800);
  //     cy.get(".d-none.d-md-block").should("be.visible"); // Left sidebar
  //     cy.get(".d-md-none").should("not.be.visible"); // Mobile components

  //     // Tablet view
  //     cy.viewport(768, 1024);
  //     cy.get(".d-none.d-md-block").should("be.visible");
  //     cy.get(".d-md-none").should("not.be.visible");

  //     // Mobile view
  //     cy.viewport(375, 812);
  //     cy.get(".d-none.d-md-block").should("not.be.visible");
  //     cy.get(".d-md-none").should("be.visible");
  //   });
  // });
});
