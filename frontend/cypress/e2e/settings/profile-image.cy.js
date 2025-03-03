describe("Profile Image Management", () => {
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
    cy.loginUser();
    cy.visit("/settings");
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
