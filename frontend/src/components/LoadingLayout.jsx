const LoadingOverlay = ({ show, children, dataCy }) => {
  return (
    <div className="position-relative">
      {show && (
        <div
          data-cy="loading-overlay"
          className="position-absolute w-100 h-100 bg-black bg-opacity-50 d-flex justify-content-center align-items-center"
          style={{ zIndex: 1 }}
        >
          <div data-cy="spinner" className="spinner-border text-light " style={{ width: "4rem", height: "4rem" }} />
        </div>
      )}
      {children}
    </div>
  );
};

export default LoadingOverlay;
// it("should handle upload error states", () => {
//   cy.intercept("PATCH", "**/api/users/imageActions", {
//     statusCode: 400,
//     body: {
//       message: "Failed to upload photo",
//     },
//     delay: 100,
//   }).as("uploadError");

//   // Upload and save
//   cy.getDataCy("upload-image-input").selectFile("cypress/fixtures/profileImage.jpg", { force: true });
//   cy.getDataCy("save-image-button").click();

//   // Verify error handling
//   cy.wait("@uploadError");
//   cy.contains("Failed to upload photo").should("be.visible");
// });

// it("should validate image selection", () => {
//   // Verify initial state
//   cy.getDataCy("upload-image-button").should("be.visible");
//   cy.get('img[alt="Preview"]').should("not.exist");

//   // Upload invalid file (can add if needed)
//   // Select valid file
//   cy.getDataCy("upload-image-input").selectFile("cypress/fixtures/profileImage.jpg", { force: true });

//   // Verify preview
//   cy.get('img[alt="Preview"]').should("be.visible");
// });

// xit("should maintain state during upload process", () => {
//   cy.intercept("PATCH", "**/api/users/imageActions", {
//     statusCode: 200,
//     body: {
//       data: {
//         message: "Profile updated successfully",
//       },
//     },
//     delay: 1000,
//   }).as("delayedUpload");

//   // Start upload
//   cy.getDataCy("upload-image-input").selectFile("cypress/fixtures/profileImage.jpg", { force: true });
//   cy.getDataCy("save-image-button").click();

//   // Verify loading state
//   cy.getDataCy("loading-overlay").should("be.visible");
//   cy.getDataCy("save-image-button").should("be.disabled");
//   cy.getDataCy("cancel-upload-button").should("be.disabled");

//   // Wait for completion
//   cy.wait("@delayedUpload");
//   cy.getDataCy("loading-overlay").should("not.exist");
// });
