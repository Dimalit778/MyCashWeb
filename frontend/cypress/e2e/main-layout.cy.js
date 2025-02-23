import { navLinks } from "../support/utils/navLinks";

describe("Main Layout", () => {
  beforeEach(() => {
    cy.loginUser();
    cy.visit("/home");
  });

  describe("Desktop Layout", () => {
    beforeEach(() => {
      cy.viewport(Cypress.config("viewportWidth"), Cypress.config("viewportHeight"));
    });

    it("should display correct layout and sidebar elements", () => {
      cy.getDataCy("left-sidebar-container").should("be.visible");
      cy.getDataCy("topBar").should("not.be.visible");
      cy.getDataCy("bottom-nav").should("not.be.visible");
      cy.getDataCy("main-layout-outlet").should("be.visible");

      cy.getDataCy("left-sidebar").within(() => {
        cy.getDataCy("brand-logo").should("be.visible");
        cy.getDataCy("profile-image-container").should("be.visible");
        cy.getDataCy("user-name").should("be.visible").and("contain", "user test");
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
      cy.getDataCy("topBar").should("be.visible");
      cy.getDataCy("bottom-nav").should("be.visible");
      cy.getDataCy("main-layout-outlet").should("be.visible");

      cy.getDataCy("topBar").within(() => {
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
