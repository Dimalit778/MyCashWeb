describe("Delete User", () => {
  beforeEach(() => {
    cy.visit("/settings");
    cy.intercept("DELETE", "**/api/users/delete", {
      statusCode: 200,
      body: { message: "User deleted successfully" },
    }).as("deleteUser");
    cy.intercept("POST", "**/api/auth/logout", {
      statusCode: 200,
      body: { message: "Logged out successfully" },
    }).as("logout");
    cy.loginUser();
    cy.visit("/settings");
  });
  it("should show confirmation dialog", () => {
    cy.getDataCy("delete-account-btn").click();
    cy.get(".swal2-popup").should("be.visible");
    cy.get(".swal2-title").should("contain", "Are you sure?");
    cy.get(".swal2-cancel").should("be.visible");
  });

  it("should handle account deletion", () => {
    // Mock deletion response
    cy.intercept("DELETE", "**/api/users/delete", {
      statusCode: 200,
      body: { message: "Account deleted successfully" },
    }).as("deleteAccount");

    cy.getDataCy("delete-account-btn").click();
    cy.get(".swal2-confirm").click();

    // Verify redirection
    cy.url().should("include", "/login");
  });

  it("should handle deletion cancellation", () => {
    cy.getDataCy("delete-account-btn").click();
    cy.get(".swal2-cancel").click();
    cy.get(".swal2-popup").should("not.exist");
    cy.url().should("include", "/settings");
  });
});
