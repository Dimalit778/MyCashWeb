describe("Contact Form", () => {
  beforeEach(() => {
    cy.loginUser();

    cy.visit("/settings");
  });
  xit("should handle responsive layout correctly", () => {
    cy.testResponsiveLayout();
  });
  it("should display Edit Profile", () => {
    cy.getDataCy("edit-profile").should("be.visible");

    cy.getDataCy("edit-profile-form").should("be.visible");

    cy.getDataCy("first-name-input").within(() => {
      cy.get("label").should("contain", "First Name");
      cy.get("input").should("have.attr", "placeholder", "Enter your first name").and("have.class", "form-control");
    });

    cy.getDataCy("last-name-input").within(() => {
      cy.get("label").should("contain", "Last Name");
      cy.get("input").should("have.attr", "placeholder", "Enter your last name").and("have.class", "form-control");
    });
  });
});
