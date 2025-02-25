describe("Upload Image Section", () => {
  beforeEach(() => {
    cy.intercept("PATCH", "**/api/users/imageActions", {
      statusCode: 200,
    }).as("upload");

    cy.mockUser();
    cy.visit("/settings");
  });

  it.only("test upload", () => {
    cy.wait("@upload").then((interception) => {
      console.log("upload", interception);
    });
  });
  it("test delete", () => {
    cy.wait("@deleteImage").then((interception) => {
      console.log("deleteImage", interception);
    });
  });
  xit("should handle image upload", () => {
    cy.getDataCy("upload-image-input").selectFile("cypress/fixtures/profileImage.jpg", { force: true });

    cy.get('img[alt="Preview"]').should("be.visible");
    cy.getDataCy("save-image-button").should("be.visible");
    cy.getDataCy("cancel-upload-button").should("be.visible");

    cy.getDataCy("cancel-upload-button").click();
    cy.getDataCy("upload-image-button").should("be.visible");
    cy.get('img[alt="Preview"]').should("not.exist");

    cy.getDataCy("upload-image-input").selectFile("cypress/fixtures/profileImage.jpg", { force: true });

    cy.getDataCy("save-image-button").click();

    cy.wait("@imageHandler");
  });

  xit("should handle image deletion", () => {
    cy.getDataCy("upload-image-input").selectFile("cypress/fixtures/profileImage.jpg", { force: true });

    cy.getDataCy("save-image-button").click();

    cy.wait("@imageHandler").then((interception) => {
      expect(interception.response.body.success.statusCode).to.equal(200);
      // Click delete and verify
      cy.getDataCy("delete-image-button").click();
      cy.wait("@imageHandler").then((interception) => {
        console.log("interception", interception);
      });
    });

    // cy.contains("Photo was deleted").should("be.visible");
  });

  xit("should handle upload errors", () => {
    // Mock error response
    cy.intercept("PATCH", "**/api/users/update", {
      statusCode: 400,
      body: {
        message: "Failed to upload photo",
      },
    }).as("uploadError");

    cy.get('input[type="file"]').selectFile("cypress/fixtures/profileImage.jpg", { force: true });
    cy.contains("Save").click();

    cy.wait("@uploadError");
    cy.contains("Failed to upload photo").should("be.visible");
  });

  xit("should show loading state during upload", () => {
    // Mock delayed response
    cy.intercept("PATCH", "**/api/users/update", {
      statusCode: 200,
      body: { message: "Profile updated successfully" },
      delay: 1000,
    }).as("delayedUpload");

    cy.get('input[type="file"]').selectFile("cypress/fixtures/profileImage.jpg", { force: true });
    cy.contains("Save").click();

    // Verify loading state
    cy.getDataCy("loading-overlay").should("be.visible");
    cy.wait("@delayedUpload");
    cy.getDataCy("loading-overlay").should("not.exist");
  });
});
