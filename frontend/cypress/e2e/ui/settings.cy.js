describe("Settings Page", () => {
  beforeEach(() => {
    cy.loginUser();
    cy.visit("/settings");
  });
  describe("Upload image", () => {
    beforeEach(() => {
      cy.intercept("PATCH", "**/api/users/update", {
        statusCode: 200,
        body: { data: { user: { profileImage: "test-image-id" } } },
      }).as("updateUser");
    });

    it("should display upload image section correctly", () => {
      cy.getDataCy("upload-image").within(() => {
        cy.get('img[alt="Upload"]').should("be.visible");
        cy.contains("button", "Upload").should("be.visible");
        cy.contains("button", "Delete").should("not.exist");
      });
    });

    it.only("should handle image upload flow", () => {
      // Test file upload
      cy.get('input[type="file"]').selectFile("cypress/fixtures/test-image.jpg", { force: true });

      // Check preview state
      cy.get('img[alt="Preview"]').should("be.visible");
      cy.contains("button", "Save").should("be.visible");
      cy.contains("button", "Cancel").should("be.visible");

      // Test save
      cy.contains("button", "Save").click();
      cy.wait("@updateUser");
      cy.contains("Profile updated successfully").should("be.visible");
    });

    it("should handle cancel upload", () => {
      cy.get('input[type="file"]').selectFile("cypress/fixtures/test-image.jpg", { force: true });
      cy.contains("button", "Cancel").click();
      cy.get('img[alt="Upload"]').should("be.visible");
    });

    it("should handle image deletion", () => {
      // Mock existing profile image
      cy.intercept("GET", "**/api/user", {
        body: { profileImage: "existing-image" },
      });

      cy.contains("button", "Delete").click();
      cy.wait("@updateUser");
      cy.contains("Photo was deleted").should("be.visible");
    });

    it("should show error for invalid upload", () => {
      cy.contains("button", "Save").click();
      cy.contains("Please add an image").should("be.visible");
    });
  });
  // describe("Edit Profile", () => {
  //   beforeEach(() => {
  //     cy.intercept("PATCH", "**/api/users/update", {
  //       statusCode: 200,
  //       body: {
  //         data: {
  //           user: {
  //             firstName: "CyUser",
  //             lastName: "TestUser",
  //           },
  //         },
  //       },
  //     }).as("UpdateUser");
  //   });
  //   it("Show edit profile form", () => {
  //     cy.getDataCy("edit-profile").should("be.visible");

  //     cy.getDataCy("first-name-input").find("input").should("be.visible").and("be.disabled");
  //     cy.getDataCy("last-name-input").find("input").should("be.visible").and("be.disabled");

  //     cy.getDataCy("edit-password-form").should("not.exist");

  //     cy.getDataCy("profile-edit-btn").should("be.visible");
  //   });
  //   it("Show Error name and last name", () => {
  //     cy.getDataCy("profile-edit-btn").click();
  //     // first name and last name ERRORS
  //     cy.getDataCy("first-name-input").clear();
  //     cy.getDataCy("error-message").should("be.visible").and("contain", "First Name is required");

  //     cy.getDataCy("last-name-input").clear();
  //     cy.getDataCy("error-message").should("be.visible").and("contain", "Last Name is required");
  //   });
  //   it("Show Error Missing new password error", () => {
  //     cy.getDataCy("profile-edit-btn").click();
  //     cy.getDataCy("current-password-input").type("123456");
  //     cy.contains("button", "Save Changes").click();
  //     cy.getDataCy("error-message").should("be.visible").and("contain", "Please enter New password");
  //   });
  //   it("Show Error Same current and new password error", () => {
  //     cy.getDataCy("profile-edit-btn").click();
  //     cy.getDataCy("current-password-input").type("123456");
  //     cy.getDataCy("new-password-input").type("123456");
  //     cy.getDataCy("error-message")
  //       .should("be.visible")
  //       .and("contain", "New password must be different from current password");
  //   });
  //   it("Show Error Missing new password error", () => {
  //     cy.getDataCy("profile-edit-btn").click();
  //     cy.getDataCy("current-password-input").type("123456");
  //     cy.contains("button", "Save Changes").click();

  //     cy.getDataCy("error-message").should("be.visible").and("contain", "Please enter New password");
  //   });
  //   it("Show Error Password must be at least 6 characters error  ", () => {
  //     cy.getDataCy("profile-edit-btn").click();
  //     cy.getDataCy("new-password-input").type("12345");
  //     cy.getDataCy("error-message").should("be.visible").and("contain", "Password must be at least 6 characters");
  //   });
  //   it("Show Error Missing current password", () => {
  //     cy.getDataCy("profile-edit-btn").click();
  //     cy.getDataCy("new-password-input").type("123456");
  //     cy.contains("button", "Save Changes").click();

  //     cy.getDataCy("error-message").should("be.visible").and("contain", "Please enter current password");
  //   });
  //   it("Should successfully Save Changes", () => {
  //     cy.getDataCy("profile-edit-btn").click();
  //     cy.getDataCy("first-name-input").clear();
  //     cy.getDataCy("last-name-input").clear();
  //     cy.getDataCy("first-name-input").type("CyUser");
  //     cy.getDataCy("last-name-input").type("TestUser");

  //     cy.contains("button", "Save Changes").click();

  //     cy.wait("@UpdateUser").then(({ response }) => {
  //       console.log(response);
  //       expect(response.statusCode).to.eq(200);
  //       cy.getDataCy("first-name-input").find("input").should("have.value", response.body.data.user.firstName);
  //       cy.getDataCy("last-name-input").find("input").should("have.value", response.body.data.user.lastName);
  //     });
  //   });
  // });

  // describe("Delete User", () => {
  //   beforeEach(() => {
  //     cy.visit("/settings");
  //     cy.intercept("DELETE", "**/api/users/delete", {
  //       statusCode: 200,
  //       body: { message: "User deleted successfully" },
  //     }).as("deleteUser");
  //     cy.intercept("POST", "**/api/auth/logout", {
  //       statusCode: 200,
  //       body: { message: "Logged out successfully" },
  //     }).as("logout");
  //   });
  //   it("should show confirmation dialog when clicking delete", () => {
  //     cy.getDataCy("delete-account-btn").click();
  //     cy.get(".swal2-popup").should("be.visible");
  //     cy.get(".swal2-title").should("contain", "Are you sure?");
  //     cy.get(".swal2-confirm").should("be.visible");
  //     cy.get(".swal2-cancel").should("be.visible");
  //   });

  //   it("should handle cancel deletion", () => {
  //     cy.getDataCy("delete-account-btn").click();
  //     cy.get(".swal2-cancel").click();
  //     cy.get(".swal2-popup").should("not.exist");
  //     cy.url().should("include", "/settings");
  //   });

  //   it("should handle account deletion", () => {
  //     cy.getDataCy("delete-account-btn").click();
  //     // cy.get(".swal2-confirm").click();

  //     // cy.wait("@deleteUser").its("response.statusCode").should("eq", 200);
  //     // cy.wait("@logout").its("response.statusCode").should("eq", 200);

  //     // cy.get(".swal2-popup").should("be.visible");
  //     // cy.get(".swal2-title").should("contain", "Deleted!");

  //     // // Wait for redirect
  //     // cy.url().should("include", "/login");
  //   });
  // });
});
