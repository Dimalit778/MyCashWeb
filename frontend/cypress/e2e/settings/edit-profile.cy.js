describe("Edit Profile", () => {
  beforeEach(() => {
    cy.intercept("PATCH", "**/api/users/update", {
      statusCode: 200,
      body: {
        data: {
          user: {
            firstName: "CyUser",
            lastName: "TestUser",
          },
        },
      },
    }).as("UpdateUser");
    cy.loginUser();
    cy.visit("/settings");
  });
  it("Show edit profile form", () => {
    cy.getDataCy("edit-profile-container").should("be.visible");

    cy.getDataCy("first-name-input").find("input").should("be.visible").and("be.disabled");
    cy.getDataCy("last-name-input").find("input").should("be.visible").and("be.disabled");

    cy.getDataCy("edit-account-form").should("not.exist");

    cy.getDataCy("profile-edit-btn").should("be.visible");
  });
  it("Show Error name and last name", () => {
    cy.getDataCy("profile-edit-btn").click();
    // first name and last name ERRORS
    cy.getDataCy("first-name-input").clear();
    cy.getDataCy("error-message").should("be.visible").and("contain", "First Name is required");

    cy.getDataCy("last-name-input").clear();
    cy.getDataCy("error-message").should("be.visible").and("contain", "Last Name is required");
  });
  it("Show Error Missing new password error", () => {
    cy.getDataCy("profile-edit-btn").click();
    cy.getDataCy("current-password-input").type("123456");
    cy.contains("button", "Save Changes").click();
    cy.getDataCy("error-message").should("be.visible").and("contain", "Please enter New password");
  });
  it("Show Error Same current and new password error", () => {
    cy.getDataCy("profile-edit-btn").click();
    cy.getDataCy("current-password-input").type("123456");
    cy.getDataCy("new-password-input").type("123456");
    cy.getDataCy("error-message")
      .should("be.visible")
      .and("contain", "New password must be different from current password");
  });
  it("Show Error Missing new password error", () => {
    cy.getDataCy("profile-edit-btn").click();
    cy.getDataCy("current-password-input").type("123456");
    cy.contains("button", "Save Changes").click();

    cy.getDataCy("error-message").should("be.visible").and("contain", "Please enter New password");
  });
  it("Show Error Password must be at least 6 characters error  ", () => {
    cy.getDataCy("profile-edit-btn").click();
    cy.getDataCy("new-password-input").type("12345");
    cy.getDataCy("error-message").should("be.visible").and("contain", "Password must be at least 6 characters");
  });
  it("Show Error Missing current password", () => {
    cy.getDataCy("profile-edit-btn").click();
    cy.getDataCy("new-password-input").type("123456");
    cy.contains("button", "Save Changes").click();

    cy.getDataCy("error-message").should("be.visible").and("contain", "Please enter current password");
  });
  it("Should successfully Save Changes", () => {
    cy.getDataCy("profile-edit-btn").click();
    cy.getDataCy("first-name-input").clear();
    cy.getDataCy("last-name-input").clear();
    cy.getDataCy("first-name-input").type("CyUser");
    cy.getDataCy("last-name-input").type("TestUser");

    cy.contains("button", "Save Changes").click();

    cy.wait("@UpdateUser").then(({ response }) => {
      console.log(response);
      expect(response.statusCode).to.eq(200);
      cy.getDataCy("first-name-input").find("input").should("have.value", response.body.data.user.firstName);
      cy.getDataCy("last-name-input").find("input").should("have.value", response.body.data.user.lastName);
    });
  });
});
