const navLinks = [
  { name: "Expenses", route: "/transactions/expenses" },
  { name: "Incomes", route: "/transactions/incomes" },
  { name: "Contact", route: "/contact" },
  { name: "Settings", route: "/settings" },
  { name: "Home", route: "/home" },
];
describe("Main Layout", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/api/transactions/yearly*", {
      statusCode: 200,
      body: {
        data: {
          monthlyStats: [],
          yearlyStats: {
            totalExpenses: 0,
            totalIncomes: 0,
            totalBalance: 0,
          },
        },
      },
    }).as("yearlyData");

    cy.intercept("GET", "**/api/transactions/monthly*", {
      statusCode: 200,
      body: {
        data: {
          transactions: [],
          total: 0,
        },
      },
    }).as("monthlyData");

    cy.intercept("GET", "**/api/categories/get*", {
      statusCode: 200,
      body: {
        data: {
          categories: [],
          maxCategories: 10,
        },
      },
    }).as("categoriesData");

    cy.fakeUser();
    cy.visit("/home");
  });

  describe("Desktop Layout", () => {
    beforeEach(() => {
      cy.viewport(Cypress.config("viewportWidth"), Cypress.config("viewportHeight"));
    });

    it("should display correct layout and sidebar elements", () => {
      cy.getDataCy("left-sidebar-container").should("be.visible");
      cy.getDataCy("top-bar").should("not.be.visible");
      cy.getDataCy("bottom-nav").should("not.be.visible");
      cy.getDataCy("main-layout-outlet").should("be.visible");

      cy.getDataCy("left-sidebar").within(() => {
        cy.getDataCy("brand-logo").should("be.visible");
        cy.getDataCy("profile-image-container").should("be.visible");
        cy.getDataCy("user-name").should("be.visible").and("contain", "Test User");
        cy.getDataCy("user-email").should("be.visible").and("contain", "cypress@gmail.com");

        navLinks.forEach((link) => {
          cy.getDataCy(`nav-link-${link.name}`).should("be.visible");
        });

        cy.getDataCy("left-sidebar-logout-button").should("be.visible");
      });
    });

    it("should navigate through sidebar links", () => {
      cy.getDataCy("left-sidebar").within(() => {
        navLinks.forEach((link) => {
          cy.getDataCy(`nav-link-${link.name}`).click();
          cy.url().should("include", link.route);
          cy.getDataCy(`nav-link-${link.name}`).should("have.css", "background-color").and("not.equal", "transparent");
        });
      });
    });

    it("should handle logout from sidebar", () => {
      cy.getDataCy("left-sidebar-logout-button").click();
      cy.url().should("include", "/");
    });
  });

  describe("Mobile Layout", () => {
    beforeEach(() => {
      cy.viewport(375, 667);
    });

    it("should display correct mobile layout elements", () => {
      cy.getDataCy("left-sidebar-container").should("not.be.visible");
      cy.getDataCy("top-bar").should("be.visible");
      cy.getDataCy("bottom-nav").should("be.visible");
      cy.getDataCy("main-layout-outlet").should("be.visible");

      cy.getDataCy("top-bar").within(() => {
        cy.getDataCy("app-logo-link-to-home").should("be.visible");
        cy.getDataCy("top-bar-profile-image").should("be.visible");
        cy.getDataCy("top-bar-logout-button").should("be.visible");
      });

      cy.getDataCy("bottom-nav").within(() => {
        navLinks.forEach((link) => {
          cy.getDataCy(`nav-link-${link.name}`).should("be.visible");
        });
      });
    });

    it("should navigate through bottom nav links", () => {
      cy.getDataCy("bottom-nav").within(() => {
        navLinks.forEach((link) => {
          cy.getDataCy(`nav-link-${link.name}`).click();
          cy.url().should("include", link.route);
          cy.getDataCy(`nav-link-${link.name}`).should("have.css", "background-color").and("not.equal", "transparent");
        });
      });
    });

    it("should handle logout from top bar", () => {
      cy.getDataCy("top-bar-logout-button").click();
      cy.url().should("include", "/");
    });
  });

  describe("Responsive Behavior", () => {
    it("should adapt layout based on viewport size", () => {
      // Desktop view
      cy.viewport(1280, 720);
      cy.getDataCy("left-sidebar").should("be.visible");
      cy.getDataCy("bottom-nav").should("not.be.visible");

      // Mobile view
      cy.viewport(375, 667);
      cy.getDataCy("left-sidebar").should("not.be.visible");
      cy.getDataCy("bottom-nav").should("be.visible");
    });
  });
});
