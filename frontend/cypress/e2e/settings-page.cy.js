describe("Settings Page ", () => {
  beforeEach(() => {
    cy.loginUser();
    cy.visit("/settings");
  });

  context("Layout", () => {
    it("should have correct layout", () => {
      cy.testResponsiveLayout();
    });
  });
  context("Profile Image Management", () => {
    beforeEach(() => {
      cy.intercept("PATCH", "**/api/users/imageActions*", (req) => {
        if (req.body.image) {
          req.reply({
            statusCode: 200,
            body: {
              success: {
                message: "Profile updated successfully",
                statusCode: 200,
              },
              data: {
                user: {
                  imageUrl: "new-image-id",
                },
              },
            },
          });
        } else {
          req.reply({
            statusCode: 200,
            body: {
              success: {
                message: "Photo was deleted",
                statusCode: 200,
              },
              data: {
                user: {
                  imageUrl: null,
                },
              },
            },
          });
        }
      }).as("imageActions");
    });
    it("should upload and then delete a profile image", () => {
      cy.getDataCy("upload-image-button").should("be.visible");
      cy.get('input[type="file"]').selectFile("cypress/fixtures/profileImage.jpg", { force: true });
      cy.contains("button", "Save").click();

      cy.wait("@imageActions");
      cy.contains("Profile updated successfully").should("be.visible");

      cy.getDataCy("delete-image-button").should("be.visible");
      cy.getDataCy("delete-image-button").click();

      cy.wait("@imageActions");
      cy.contains("Photo was deleted").should("be.visible");
      cy.getDataCy("upload-image-button").should("be.visible");
      cy.getDataCy("delete-image-button").should("not.exist");
    });
    it("Cancel image upload", () => {
      cy.getDataCy("upload-image-button").should("be.visible");
      cy.get('input[type="file"]').selectFile("cypress/fixtures/profileImage.jpg", { force: true });

      cy.get("button").contains("Cancel").click();

      cy.getDataCy("upload-image-button").should("be.visible");
      cy.getDataCy("save-upload-button").should("not.exist");
      cy.getDataCy("cancel-upload-button").should("not.exist");

      cy.get('img[alt="Preview"]').should("not.exist");
    });
  });
  context("Edit Profile Management", () => {
    beforeEach(() => {
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
  });
  context("Delete Account", () => {
    beforeEach(() => {
      cy.intercept("DELETE", "**/api/users/delete", {
        statusCode: 200,
        body: { message: "User deleted successfully" },
      }).as("deleteUser");
      cy.intercept("POST", "**/api/auth/logout", {
        statusCode: 200,
        body: { message: "Logged out successfully" },
      }).as("logout");
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
});
