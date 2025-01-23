describe("Edit Profile", () => {
  beforeEach(() => {
    cy.loginUser();
    cy.visit("/settings");
  });

  it.only("should initially show disabled form fields with user info", () => {
    cy.getDataCy("edit-profile-form")
      .should("be.visible")
      .find("input", /test/, /cypres/)
      .should("be.disabled");
    cy.contains("button", /Edit Profile/).should("be.visible");
    cy.getDataCy("edit-password-form").should("not.exist");
  });

  it("should enable form fields after clicking Edit Profile", () => {
    // Click edit profile button
    cy.getDataCy("profile-edit-btn").click();

    // Check if fields are enabled
    cy.getDataCy("firstName-input").within(() => {
      cy.get("input").should("be.enabled");
    });

    cy.getDataCy("lastName-input").within(() => {
      cy.get("input").should("be.enabled");
    });

    cy.getDataCy("edit-password-form").should("be.visible");
    cy.getDataCy("current-password-input").within(() => {
      cy.get("input").should("be.enabled");
    });
    cy.getDataCy("new-password-input").within(() => {
      cy.get("input").should("be.enabled");
    });
  });

  it("should disable Save Changes button when no changes made", () => {
    cy.getDataCy("profile-edit-btn").click();

    cy.getDataCy("profile-edit-btn").should("be.disabled");
  });

  it("should reset form and close edit mode when clicking Cancel", () => {
    cy.getDataCy("profile-edit-btn").click();

    // Make some changes
    cy.getDataCy("firstName-input").within(() => {
      cy.get("input").clear();
      cy.get("input").type("new name");
    });

    cy.getDataCy("lastName-input").within(() => {
      cy.get("input").clear();
      cy.get("input").type("new last name");
    });

    cy.getDataCy("profile-cancel-btn").click();

    cy.getDataCy("firstName-input").within(() => {
      cy.get("input").should("have.value", "test");
    });

    cy.getDataCy("lastName-input").within(() => {
      cy.get("input").should("have.value", "cypres");
    });

    // Password fields should be hidden
    cy.get("current-password-input").should("not.exist");
    cy.get("new-password-input").should("not.exist");
  });

  it("should show error when only CURRENT password is entered", () => {
    cy.contains("button", "Edit Profile").click();

    cy.getDataCy("edit-password-form").should("be.visible");

    cy.getDataCy("current-password-input").find("input").type("currentpass123");

    cy.contains("button", "Save Changes").click();

    cy.contains(/Please enter New password/).should("be.visible");
  });

  it("should show error when only NEW password is entered", () => {
    cy.contains("button", "Edit Profile").click();
    cy.getDataCy("edit-password-form").should("be.visible");

    cy.getDataCy("new-password-input").find("input").type("currentpass123");

    cy.contains(/Please enter current password/).should("be.visible");
  });

  it("should enable Save Changes button when form is modified", () => {
    // Click edit profile
    cy.contains("button", "Edit Profile").click();

    // Make a change
    cy.getDataCy("firstName-input").within(() => {
      cy.get("input").clear();
      cy.get("input").type("new name");
    });
    cy.contains("button", "Save Changes").should("be.enabled").click();

    // Form should be back in view mode
    cy.getDataCy("edit-profile-form").find("input").should("be.disabled");
  });
});
