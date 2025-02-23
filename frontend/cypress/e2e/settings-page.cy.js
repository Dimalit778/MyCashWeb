describe("Settings Page", () => {
  beforeEach(() => {
    cy.loginUser();
    cy.visit("/settings");
  });

  xdescribe("Page Layout", () => {
    it("should display all sections correctly", () => {
      cy.getDataCy("upload-image").should("be.visible");
      cy.getDataCy("edit-profile").should("be.visible");
      cy.getDataCy("delete-account-btn").should("be.visible");
    });
  });

  xdescribe("Edit Profile Section", () => {
    it("should display profile information correctly", () => {
      cy.getDataCy("first-name-input").find("input").should("have.value", "John");
      cy.getDataCy("last-name-input").find("input").should("have.value", "Doe");
      cy.getDataCy("edit-password-form").should("not.exist");
    });

    it("should handle edit mode", () => {
      // Enter edit mode
      cy.getDataCy("profile-edit-btn").click();

      // Check fields are enabled
      cy.getDataCy("first-name-input").find("input").should("be.enabled");
      cy.getDataCy("last-name-input").find("input").should("be.enabled");

      // Check password fields appear
      cy.getDataCy("edit-password-form").should("be.visible");
      cy.getDataCy("current-password-input").should("be.visible");
      cy.getDataCy("new-password-input").should("be.visible");
    });

    it("should validate form inputs", () => {
      cy.getDataCy("profile-edit-btn").click();

      // Test name validation
      cy.getDataCy("first-name-input").find("input").clear();
      cy.getDataCy("first-name-input").find("input").type("123");
      cy.contains("First Name can only contain letters").should("be.visible");

      cy.getDataCy("last-name-input").find("input").clear();
      cy.getDataCy("last-name-input").find("input").type("123");
      cy.contains("last Name can only contain letters").should("be.visible");

      // Test password validation
      cy.getDataCy("new-password-input").find("input").type("123");
      cy.contains("Password must be at least 6 characters").should("be.visible");

      cy.getDataCy("current-password-input").find("input").type("password123");
      cy.getDataCy("new-password-input").find("input").clear();
      cy.getDataCy("new-password-input").find("input").type("password123");
      cy.contains("New password must be different from current password").should("be.visible");
    });

    it("should handle successful profile update", () => {
      cy.intercept("PATCH", "**/api/users/update", {
        statusCode: 200,
        body: {
          data: {
            user: {
              firstName: "Cy",
              lastName: "Example",
              email: "cypress@gmail.com",
              subscription: "free",
            },
            message: "Profile updated successfully!",
          },
        },
      }).as("updateProfile");

      cy.getDataCy("profile-edit-btn").click();

      // Update name fields
      cy.getDataCy("first-name-input").find("input").clear();
      cy.getDataCy("first-name-input").find("input").type("Cy");
      cy.getDataCy("last-name-input").find("input").clear();
      cy.getDataCy("last-name-input").find("input").type("Example");

      // Submit changes
      cy.getDataCy("profile-save-btn").click();

      // Wait for API call and verify
      cy.wait("@updateProfile").then((interception) => {
        // Verify request
        expect(interception.request.method).to.equal("PATCH");
        expect(interception.request.url).to.include("/api/users/update");

        // Verify success message appears
        cy.contains("Profile updated successfully!").should("be.visible");

        // Verify form returns to view mode
        cy.getDataCy("first-name-input").find("input").should("have.value", "Cy");
        cy.getDataCy("last-name-input").find("input").should("have.value", "Example");
        cy.getDataCy("profile-edit-btn").should("be.visible");
      });
    });

    it("should handle cancel edit", () => {
      cy.getDataCy("profile-edit-btn").click();
      cy.getDataCy("first-name-input").find("input").clear();
      cy.getDataCy("first-name-input").find("input").type("user test");
      cy.getDataCy("profile-cancel-btn").click();

      // Verify original values restored
      cy.getDataCy("first-name-input").find("input").should("have.value", "John");
    });
  });

  xdescribe("Delete Account Section", () => {
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

  //   describe("Responsive Layout", () => {
  //     it("should adapt to different screen sizes", () => {
  //       // Desktop view
  //       cy.viewport(1200, 800);
  //       cy.get(".row").find(".col-lg-5").should("be.visible");
  //       cy.get(".row").find(".col-lg-7").should("be.visible");

  //       // Mobile view
  //       cy.viewport(375, 667);
  //       cy.get(".row").should("be.visible");
  //     });
  //   });
});
