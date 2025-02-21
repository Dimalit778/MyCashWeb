describe("User Profile Image Tests", () => {
  beforeEach(() => {
    // Mock user data
    cy.intercept("POST", "/api/auth/login", {
      statusCode: 200,
      body: {
        data: {
          accessToken: "fake-token",
          user: {
            firstName: "Test",
            lastName: "User",
            email: "test@example.com",
            imageUrl: "test-image-id", // Custom image
          },
        },
      },
    }).as("loginUser");
  });
  it.only("should display user information in sidebar", () => {
    cy.loginUser();
    cy.window().then((win) => {
      console.log("win", win);
      const state = JSON.parse(win.localStorage.getItem("persist:root"));
      //   const user = JSON.parse(JSON.parse(state.user).user);
      //   cy.log("user", user);
      console.log("state", state);
    });
  });

  it("should display default avatar when user has no custom image", () => {
    // Mock user without image
    cy.intercept("POST", "/api/auth/login", {
      statusCode: 200,
      body: {
        data: {
          accessToken: "fake-token",
          user: {
            firstName: "Test",
            lastName: "User",
            email: "test@example.com",
            imageUrl: null, // No custom image
          },
        },
      },
    }).as("loginNoImage");

    cy.loginUser();
    cy.visit("/home");

    // Check default avatar is visible
    cy.getDataCy("user-avatar").should("be.visible");
    // Custom image should not exist
    cy.getDataCy("user-profile-image").should("not.exist");
  });

  it("should display custom profile image when user has uploaded one", () => {
    // Mock user with custom image
    cy.intercept("POST", "/api/auth/login", {
      statusCode: 200,
      body: {
        data: {
          accessToken: "fake-token",
          user: {
            firstName: "Test",
            lastName: "User",
            email: "test@example.com",
            imageUrl: "custom-image-id", // User has custom image
          },
        },
      },
    }).as("loginWithImage");

    cy.loginUser();
    cy.visit("/home");

    // Check custom image is visible
    cy.getDataCy("user-profile-image").should("be.visible");
    // Default avatar should not exist
    cy.getDataCy("user-avatar").should("not.exist");
  });
});
