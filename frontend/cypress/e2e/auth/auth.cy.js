import AuthFunc from "./authFunc";
const auth = new AuthFunc();
describe("Auth Page", () => {
  it("should display auth page", () => {
    cy.visit("/login");
    cy.getDataCy("login-title").should("contain", "LOGIN");
    cy.getDataCy("login-email").should("exist");
    cy.getDataCy("login-password").should("exist");
    cy.getDataCy("login-google").should("exist");
    cy.getDataCy("forgot-password").should("contain", "Forgot Password?");
    cy.getDataCy("login-submit").should("exist");

    cy.getDataCy("signup-link").click();
    cy.url().should("include", "/signup");
    cy.go("back");

    cy.getDataCy("login-link").click();
    cy.url().should("include", "/login");
    cy.go("back");
  });
});
