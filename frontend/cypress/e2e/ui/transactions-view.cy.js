import { isMobile } from "../../support/utils";

describe("app layout and responsiveness", () => {
  beforeEach(() => {
    cy.setupApiMonitors();
    cy.loginUser();
    cy.visit("/transactions/expenses");
  });
  describe("should display responsive navbar", () => {
    it("should display responsive navbar", () => {
      if (isMobile()) {
        cy.getDataCy("bottom-nav").should("be.visible");
        cy.getDataCy("topBar").should("be.visible");
        cy.getDataCy("left-sidebar").should("not.be.visible");
      } else {
        cy.getDataCy("bottom-nav").should("not.be.visible");
        cy.getDataCy("topBar").should("not.be.visible");
        cy.getDataCy("left-sidebar").should("be.visible");
      }
    });
  });
});
