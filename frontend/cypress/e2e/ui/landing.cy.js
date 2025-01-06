describe("Landing Page", () => {
  it("should display landing page", () => {
    cy.visit("/");
    cy.getDataCy("landing-title").should("contain", "MANAGE YOUR");
    cy.getDataCy("stroke-title").should("contain", "MONEY");
    cy.getDataCy("team-image").should("have.attr", "alt", "Team").and("be.visible");
    cy.getDataCy("about-title").should("contain", "About Us");
    cy.getDataCy("about-text-1").should("exist");
    cy.getDataCy("about-text-2").should("exist");
    cy.getDataCy("login-link").click();
    cy.url().should("include", "/login");
    cy.getDataCy("signup-link").click();
    cy.url().should("include", "/signup");
    cy.getDataCy("landing-link").click();
    cy.url().should("include", "/");
  });
});
