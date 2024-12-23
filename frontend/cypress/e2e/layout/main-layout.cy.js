// cypress/e2e/layout/navigation.cy.js
describe("Navigation Layout", () => {
  beforeEach(() => {
    cy.loginUser(Cypress.env("TEST_EMAIL"), Cypress.env("TEST_PASSWORD"));
  });

  const protectedRoutes = [
    { path: "/home", name: "Home" },
    { path: "/expenses", name: "Expenses" },
    { path: "/incomes", name: "Incomes" },
    { path: "/contact", name: "Contact" },
    { path: "/settings", name: "Settings" },
  ];

  it("should display correct navigation based on viewport size", () => {
    protectedRoutes.forEach((route) => {
      cy.testViewport((viewport) => {
        cy.visit(route.path);

        if (viewport === "desktop") {
          cy.getDataCy("left-sidebar").should("be.visible");
          cy.getDataCy("bottom-nav").should("not.be.visible");
        } else {
          cy.getDataCy("left-sidebar").should("not.be.visible");
          cy.getDataCy("bottom-nav").should("be.visible");
        }
      });
    });
  });
});
