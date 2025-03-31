describe("Profile Image ", () => {
  beforeEach(() => {
    cy.task("db:clear-db");
    cy.task("db:seed-user");
    cy.loginTestUser();

    cy.intercept("PATCH", "**/api/users/imageActions").as("imageActions");

    cy.visit("/settings");
    cy.getDataCy("uploadImage-container").should("be.visible");
  });

  it("should bypass upload and test deletion", () => {
    // Click the upload button first
    cy.getDataCy("upload-image-button").should("be.visible").click();

    // Then select file on the now-active input
    cy.getDataCy("upload-image-input").selectFile("cypress/fixtures/profileImage.jpg", { force: true });

    // Wait for the preview to appear
    cy.get('img[alt="Preview"]').should("be.visible");

    // Wait for the FileReader to complete by listening for the custom event
    cy.window().then((win) => {
      return new Cypress.Promise((resolve) => {
        const timeoutId = setTimeout(() => {
          win.removeEventListener("fileReaderComplete", eventHandler);
          resolve(); // Resolve anyway after timeout to prevent test hanging
        }, 5000);

        const eventHandler = () => {
          clearTimeout(timeoutId);
          resolve();
        };

        win.addEventListener("fileReaderComplete", eventHandler, { once: true });
      });
    });
    cy.getDataCy("save-image-button").should("be.visible");
    // Then get the element again before clicking
    cy.get("button").contains("Save").click();
    // Now the request should happen
    cy.wait("@imageActions").then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });

    // And the image should be deleted
    cy.contains("Profile updated successfully").should("be.visible");

    // Delete image
    cy.getDataCy("delete-image-button").should("be.visible").click();

    // Now the request should happen
    cy.wait("@imageActions").then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });

    // And the image should be deleted
    cy.contains("Photo was deleted").should("be.visible");
  });
  it("Cancel image upload", () => {
    cy.getDataCy("upload-image-button").should("be.visible").click();
    cy.getDataCy("upload-image-input").selectFile("cypress/fixtures/profileImage.jpg", { force: true });

    cy.getDataCy("save-image-button").should("be.visible");
    cy.getDataCy("cancel-image-button").should("be.visible");

    cy.getDataCy("cancel-image-button").click();
    cy.getDataCy("cancel-image-button").should("not.exist");

    cy.get('img[alt="Preview"]').should("not.exist");
  });
});
