describe("Profile Image Management", () => {
  beforeEach(() => {
    // Intercept with wider coverage to catch all potential variations
    cy.intercept({
      url: "/api/users/imageActions",
    }).as("updateUserImage");
    cy.mockUser();
    cy.visit("/settings");
  });

  it("should allow uploading a profile image", () => {
    // Ensure the file exists in your fixtures folder
    cy.get('input[type="file"]').selectFile("cypress/fixtures/profileImage.jpg", { force: true });

    // Find and click the Save button that appears after selecting file
    cy.get("button").contains("Save").click();

    // Wait for the network request with a longer timeout
    cy.wait("@updateUserImage", { timeout: 15000 });

    // Verify success message appears
    cy.contains("Profile updated successfully", { timeout: 10000 }).should("be.visible");
  });
});
// describe("Settings Page", () => {
//   beforeEach(() => {
//     cy.mockUser();
//     cy.visit("/settings");
//   });

//   it("should display main sections correctly", () => {
//     // Test responsive layout once per page
//     cy.testResponsiveLayout();

//     // Verify key sections exist
//     cy.getDataCy("uploadImage-container").should("be.visible");
//     cy.getDataCy("editProfile-container").should("be.visible");
//     cy.getDataCy("deleteUser-container").should("be.visible");
//   });

//   describe("Profile Image Management", () => {
//     it.only("should allow uploading a profile image", () => {
//       cy.intercept("PATCH", "**/api/users/imageActions").as("updateUserImage");

//       cy.get('input[type="file"]').selectFile("cypress/fixtures/profileImage.jpg", { force: true });
//       cy.getDataCy("save-image-button").should("be.visible");
//       cy.getDataCy("save-image-button").should("be.visible");

//       cy.wait("@updateUserImage").then((interception) => {
//         console.log("updateUserImage", interception);
//       });
//       cy.contains("Profile updated successfully").should("be.visible");
//     });

//     it("should allow canceling image upload", () => {
//       cy.get('input[type="file"]').selectFile("cypress/fixtures/profileImage.jpg", { force: true });

//       cy.getDataCy("cancel-upload-button").should("be.visible").click();
//     });

//     it("should allow deleting a profile image", () => {
//       cy.fixture("user.json").then((userData) => {
//         cy.intercept("GET", "**/api/user", {
//           body: { data: { user: { ...userData.data.user, imageUrl: "some-image-id" } } },
//         });
//       });
//       cy.contains("button", "Delete").click();
//       cy.wait("@deleteUserImage");
//       cy.contains("Photo was deleted").should("be.visible");
//     });
//   });
//   xdescribe("Edit Profile Section", () => {
//     it("should display profile information correctly", () => {
//       cy.getDataCy("first-name-input").find("input").should("have.value", "John");
//       cy.getDataCy("last-name-input").find("input").should("have.value", "Doe");
//       cy.getDataCy("edit-password-form").should("not.exist");
//     });

//     it("should handle edit mode", () => {
//       // Enter edit mode
//       cy.getDataCy("profile-edit-btn").click();

//       // Check fields are enabled
//       cy.getDataCy("first-name-input").find("input").should("be.enabled");
//       cy.getDataCy("last-name-input").find("input").should("be.enabled");

//       // Check password fields appear
//       cy.getDataCy("edit-password-form").should("be.visible");
//       cy.getDataCy("current-password-input").should("be.visible");
//       cy.getDataCy("new-password-input").should("be.visible");
//     });

//     it("should validate form inputs", () => {
//       cy.getDataCy("profile-edit-btn").click();

//       // Test name validation
//       cy.getDataCy("first-name-input").find("input").clear();
//       cy.getDataCy("first-name-input").find("input").type("123");
//       cy.contains("First Name can only contain letters").should("be.visible");

//       cy.getDataCy("last-name-input").find("input").clear();
//       cy.getDataCy("last-name-input").find("input").type("123");
//       cy.contains("last Name can only contain letters").should("be.visible");

//       // Test password validation
//       cy.getDataCy("new-password-input").find("input").type("123");
//       cy.contains("Password must be at least 6 characters").should("be.visible");

//       cy.getDataCy("current-password-input").find("input").type("password123");
//       cy.getDataCy("new-password-input").find("input").clear();
//       cy.getDataCy("new-password-input").find("input").type("password123");
//       cy.contains("New password must be different from current password").should("be.visible");
//     });

//     it("should handle successful profile update", () => {
//       cy.intercept("PATCH", "**/api/users/update", {
//         statusCode: 200,
//         body: {
//           data: {
//             user: {
//               firstName: "Cy",
//               lastName: "Example",
//               email: "cypress@gmail.com",
//               subscription: "free",
//             },
//             message: "Profile updated successfully!",
//           },
//         },
//       }).as("updateProfile");

//       cy.getDataCy("profile-edit-btn").click();

//       // Update name fields
//       cy.getDataCy("first-name-input").find("input").clear();
//       cy.getDataCy("first-name-input").find("input").type("Cy");
//       cy.getDataCy("last-name-input").find("input").clear();
//       cy.getDataCy("last-name-input").find("input").type("Example");

//       // Submit changes
//       cy.getDataCy("profile-save-btn").click();

//       // Wait for API call and verify
//       cy.wait("@updateProfile").then((interception) => {
//         // Verify request
//         expect(interception.request.method).to.equal("PATCH");
//         expect(interception.request.url).to.include("/api/users/update");

//         // Verify success message appears
//         cy.contains("Profile updated successfully!").should("be.visible");

//         // Verify form returns to view mode
//         cy.getDataCy("first-name-input").find("input").should("have.value", "Cy");
//         cy.getDataCy("last-name-input").find("input").should("have.value", "Example");
//         cy.getDataCy("profile-edit-btn").should("be.visible");
//       });
//     });

//     it("should handle cancel edit", () => {
//       cy.getDataCy("profile-edit-btn").click();
//       cy.getDataCy("first-name-input").find("input").clear();
//       cy.getDataCy("first-name-input").find("input").type("user test");
//       cy.getDataCy("profile-cancel-btn").click();

//       // Verify original values restored
//       cy.getDataCy("first-name-input").find("input").should("have.value", "John");
//     });
//   });

//   xdescribe("Delete Account Section", () => {
//     it("should show confirmation dialog", () => {
//       cy.getDataCy("delete-account-btn").click();
//       cy.get(".swal2-popup").should("be.visible");
//       cy.get(".swal2-title").should("contain", "Are you sure?");
//       cy.get(".swal2-cancel").should("be.visible");
//     });

//     it("should handle account deletion", () => {
//       // Mock deletion response
//       cy.intercept("DELETE", "**/api/users/delete", {
//         statusCode: 200,
//         body: { message: "Account deleted successfully" },
//       }).as("deleteAccount");

//       cy.getDataCy("delete-account-btn").click();
//       cy.get(".swal2-confirm").click();

//       // Verify redirection
//       cy.url().should("include", "/login");
//     });

//     it("should handle deletion cancellation", () => {
//       cy.getDataCy("delete-account-btn").click();
//       cy.get(".swal2-cancel").click();
//       cy.get(".swal2-popup").should("not.exist");
//       cy.url().should("include", "/settings");
//     });
//   });
// });
