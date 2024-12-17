describe("Landing Page", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("should display the main title", () => {
    cy.get('[data-test="landing-title"]').should("contain", "MANAGE YOUR");
  });
  it("should display the stroke title", () => {
    cy.get('[data-testid="stroke-title"]').should("contain", "MONEY");
  });
  // it("should display the welcome animation", () => {
  //   cy.get('[data-testid="welcome-animation"]').should("exist");
  // });
  it("should display the team image", () => {
    cy.get('[data-testid="team-image"]').should("have.attr", "alt", "Team").and("be.visible");
  });

  it("should display the about section title", () => {
    cy.get('[data-testid="about-title"]').should("contain", "About Us");
  });

  it("should display the about section texts", () => {
    cy.get('[data-testid="about-text-1"]').should("exist");
    cy.get('[data-testid="about-text-2"]').should("exist");
  });
});
