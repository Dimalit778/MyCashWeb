describe("Layout Components", () => {
  beforeEach(() => {
    cy.loginUser();
    cy.visit("/home");
  });
  describe("User Profile Display", () => {
    before(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
    });
    it("should display profile image when user has an image", () => {
      cy.fakeUser({ imageUrl: "images/test-image.jpg" });
      cy.getDataCy("profile-image-container").should("be.visible");
      cy.getDataCy("user-profile-image").should("be.visible");
      cy.getDataCy("avatar-icon").should("not.exist");
    });

    it("should display default avatar when user has no image", () => {
      cy.fakeUser({ imageUrl: null });
      cy.getDataCy("profile-image-container").should("be.visible");
      cy.getDataCy("user-profile-image").should("not.exist");
      cy.getDataCy("avatar-icon").should("be.visible");
    });
  });

  describe.only("Layout View", () => {
    it("should display  desktop view", () => {
      cy.viewport(Cypress.config("viewportWidth"), Cypress.config("viewportHeight"));
      cy.getDataCy("left-sidebar-container").should("be.visible");

      // Check mobile components are hidden
      cy.getDataCy("topBar").should("not.be.visible");
      cy.getDataCy("bottom-nav").should("not.be.visible");

      // Check sidebar content
      cy.getDataCy("left-sidebar").within(() => {
        cy.getDataCy("brand-logo").should("be.visible");
        cy.getDataCy("profile-image-container").should("be.visible");
        cy.getDataCy("user-name").should("be.visible").and("contain", "user test");
        cy.getDataCy("user-email").should("be.visible").and("contain", "cypress@gmail.com");

        // Navigation
        cy.contains("Home").should("be.visible");
        cy.contains("Expense").should("be.visible");
        cy.contains("Income").should("be.visible");
        cy.contains("Settings").should("be.visible");
        cy.contains("Contact").should("be.visible");

        // Logout button
        cy.contains("Logout").should("be.visible");
      });

      // Verify main content
      cy.get(".main-content").should("be.visible");
    });
    it.only("should display and function correctly in Mobile view", () => {
      // Set mobile viewport size
      cy.viewport(Cypress.env("mobileViewportWidthBreakpoint"), 667);

      // Check layout components
      cy.getDataCy("left-sidebar-container").should("not.be.visible");
      cy.getDataCy("topBar").should("be.visible");
      cy.getDataCy("bottom-nav").should("be.visible");
      cy.get(".main-content").should("be.visible");

      // Check that bottom nav has all navigation items
      cy.getDataCy("bottom-nav-item-home").should("be.visible");
      cy.getDataCy("bottom-nav-item-expenses").should("be.visible");
      cy.getDataCy("bottom-nav-item-incomes").should("be.visible");
      cy.getDataCy("bottom-nav-item-contact").should("be.visible");
      cy.getDataCy("bottom-nav-item-settings").should("be.visible");

      // Check active status of current page
      cy.getDataCy("bottom-nav-link-home").should("have.css", "background-color").and("not.equal", "transparent");

      // Test navigation by clicking a nav item
      cy.getDataCy("bottom-nav-link-expenses").click();
      cy.url().should("include", "/transactions/expenses");

      // Verify the active status changed
      cy.getDataCy("bottom-nav-link-expenses").should("have.css", "background-color").and("not.equal", "transparent");
      cy.getDataCy("bottom-nav-link-home").should("have.css", "background-color", "transparent");

      // Test another navigation
      cy.getDataCy("bottom-nav-link-settings").click();
      cy.url().should("include", "/settings");
    });

    it("should navigate to different pages from sidebar", () => {
      cy.getDataCy("left-sidebar").contains("Expenses").click();
      cy.url().should("include", "/transactions/expenses");

      cy.getDataCy("left-sidebar").contains("Settings").click();
      cy.url().should("include", "/settings");
    });
  });

  xdescribe("Mobile Layout", () => {
    beforeEach(() => {
      // Ensure mobile viewport
      cy.viewport(375, 667);
    });

    it("should display correct elements in mobile view", () => {
      // Check sidebar is hidden
      cy.getDataCy("left-sidebar-container").should("not.be.visible");

      // Check mobile components are visible
      cy.getDataCy("topBar").should("be.visible");
      cy.getDataCy("bottom-nav").should("be.visible");

      // Verify main content is full width
      cy.get(".main-content").should("be.visible");
    });

    it("should navigate to different pages from bottom nav", () => {
      cy.getDataCy("bottom-nav").find(".nav-item").first().click();
      cy.url().should("include", "/home");

      // Click second item (assuming it's expenses)
      cy.getDataCy("bottom-nav").find(".nav-item").eq(1).click();
      cy.url().should("include", "/transactions");
    });
  });

  xdescribe("Responsive Behavior", () => {
    it("should adapt layout when viewport changes", () => {
      // Start with desktop
      cy.viewport(1200, 800);
      cy.getDataCy("left-sidebar-container").should("be.visible");
      cy.getDataCy("bottom-nav").should("not.be.visible");

      // Switch to mobile
      cy.viewport(375, 667);
      cy.getDataCy("left-sidebar-container").should("not.be.visible");
      cy.getDataCy("bottom-nav").should("be.visible");

      // Back to desktop
      cy.viewport(1200, 800);
      cy.getDataCy("left-sidebar-container").should("be.visible");
      cy.getDataCy("bottom-nav").should("not.be.visible");
    });
  });
});
// describe("MainLayout", () => {
//   // Authentication tests
//   describe("Authentication", () => {
//     beforeEach(() => {
//       cy.loginUser();
//     });
//     it("should redirect unauthenticated users to Landing page", () => {
//       cy.clearCookies();
//       cy.clearLocalStorage();
//       cy.visit("/home");
//       cy.url().should("eq", Cypress.config().baseUrl + "/");
//     });
//     it("should redirect authenticated users to home page", () => {
//       cy.visit("/home");
//       cy.url().should("eq", Cypress.config().baseUrl + "/home");
//     });
//     it("should not let authenticated users access Landing/Signup/Login page", () => {
//       cy.visit("/");
//       cy.url().should("eq", Cypress.config().baseUrl + "/home");
//       cy.visit("/signup");
//       cy.url().should("eq", Cypress.config().baseUrl + "/home");
//       cy.visit("/login");
//       cy.url().should("eq", Cypress.config().baseUrl + "/home");
//     });
//   });

//
//     xit("should display correct layout elements for mobile", () => {
//       cy.viewport(Cypress.env("mobileViewportWidthBreakpoint"), 667);

//       // Left sidebar should be hidden on mobile
//       cy.getDataCy("left-sidebar").should("not.be.visible");

//       // Top bar should be visible on mobile
//       cy.getDataCy("topBar").should("be.visible");

//       // Bottom nav should be visible on mobile
//       cy.getDataCy("bottom-nav").should("be.visible");

//       // Check bottom nav content
//       cy.getDataCy("bottom-nav").within(() => {
//         // Should have navigation icons
//         cy.get("img").should("have.length.at.least", 3);
//       });

//       // Main content should be visible without offset
//       cy.get(".main-content").should("be.visible");
//     });
//   });

//   // Navigation tests
//   describe("Navigation", () => {
//     beforeEach(() => {
//       cy.loginUser();
//       cy.visit("/home");
//     });

//     it("should navigate to different routes from desktop sidebar", () => {
//       // Test on desktop viewport
//       cy.viewport(1200, 800);

//       // Test each navigation link
//       const routes = [
//         { name: "Home", path: "/home" },
//         { name: "Expenses", path: "/transactions/expenses" },
//         { name: "Incomes", path: "/transactions/incomes" },
//         { name: "Settings", path: "/settings" },
//         { name: "Contact", path: "/contact" },
//       ];

//       routes.forEach((route) => {
//         cy.getDataCy("left-sidebar").contains(route.name).click();
//         cy.url().should("include", route.path);
//         cy.get(".main-content").should("be.visible");
//       });
//     });

//     it("should navigate to different routes from mobile bottom nav", () => {
//       // Test on mobile viewport
//       cy.viewport(375, 667);

//       // Click each bottom nav item
//       cy.getDataCy("bottom-nav")
//         .find(".nav-item")
//         .each(($item, index) => {
//           cy.wrap($item).click();
//           // Verify page changes
//           cy.get(".main-content").should("be.visible");
//         });
//     });

//     it("should logout from desktop sidebar", () => {
//       // Test on desktop viewport
//       cy.viewport(1200, 800);

//       // Click logout button
//       cy.getDataCy("left-sidebar").contains("Logout").click();

//       // Should redirect to landing page
//       cy.url().should("eq", Cypress.config().baseUrl + "/");
//     });
//   });

//   // User profile tests
//   describe("User Profile Display", () => {
//     beforeEach(() => {
//       // Mock user data
//       cy.intercept("POST", "/api/auth/login", {
//         statusCode: 200,
//         body: {
//           data: {
//             accessToken: "fake-token",
//             user: {
//               firstName: "Test",
//               lastName: "User",
//               email: "test@example.com",
//               imageUrl: null,
//             },
//           },
//         },
//       }).as("loginUser");

//       cy.loginUser();
//       cy.visit("/home");
//     });

//     it("should display user information in sidebar", () => {
//       // Test on desktop viewport
//       cy.viewport(1200, 800);

//       // Check user name and email in sidebar
//       cy.getDataCy("left-sidebar").within(() => {
//         cy.contains("Test User").should("be.visible");
//         cy.contains("test@example.com").should("be.visible");
//       });
//     });
//   });

//   // Responsive behavior tests
//   describe("Responsive Behavior", () => {
//     beforeEach(() => {
//       cy.loginUser();
//       cy.visit("/home");
//     });

//     it("should toggle between layouts when viewport changes", () => {
//       // Start with desktop viewport
//       cy.viewport(1200, 800);
//       cy.getDataCy("left-sidebar").should("be.visible");
//       cy.getDataCy("bottom-nav").should("not.be.visible");

//       // Switch to mobile viewport
//       cy.viewport(375, 667);
//       cy.getDataCy("left-sidebar").should("not.be.visible");
//       cy.getDataCy("bottom-nav").should("be.visible");

//       // Switch back to desktop
//       cy.viewport(1200, 800);
//       cy.getDataCy("left-sidebar").should("be.visible");
//       cy.getDataCy("bottom-nav").should("not.be.visible");
//     });
//   });
// });
