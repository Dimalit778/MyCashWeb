// Login Session
Cypress.Commands.add("loginUser", () => {
  const email = Cypress.env("TEST_EMAIL");
  const password = Cypress.env("TEST_PASSWORD");
  cy.session([email, password], () => {
    // Make login request
    cy.request({
      method: "POST",
      url: "/api/auth/login",
      body: { email, password },
    }).then((response) => {
      expect(response.status).to.eq(200);
      cy.log("Login response:", response.body);

      const { accessToken, user } = response.body.data;
      cy.setCookie("token", accessToken);

      // Set up Redux store with user data
      cy.window().then((win) => {
        win.localStorage.setItem(
          "persist:root",
          JSON.stringify({
            user: JSON.stringify({
              user: user,
            }),
          })
        );
      });
    });
  });
});
Cypress.Commands.add("setUserData", (userData) => {
  const defaultUser = {
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    imageUrl: null,
  };

  const user = { ...defaultUser, ...userData };

  cy.window().then((win) => {
    win.localStorage.setItem(
      "persist:root",
      JSON.stringify({
        user: JSON.stringify({
          user: user,
        }),
      })
    );
  });

  cy.reload();
});
// In cypress/support/commands.js
Cypress.Commands.add("fakeUser", (userData = {}) => {
  // Default user data
  const defaultUser = {
    id: "test-user-id",
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    imageUrl: null,
    subscription: "free",
  };

  // Merge default user with provided user data
  const user = { ...defaultUser, ...userData };

  // Set the access token in cookies
  cy.setCookie("token", "fake-access-token-for-testing");

  // Set up user in Redux store via localStorage
  cy.window().then((win) => {
    win.localStorage.setItem(
      "persist:root",
      JSON.stringify({
        user: JSON.stringify({
          user: user,
        }),
      })
    );
  });

  // Reload the page
  cy.reload();
});

Cypress.Commands.add("getDataCy", (dataTestSelector) => {
  return cy.get(`[data-cy="${dataTestSelector}"]`);
});
// Helper command for viewport testing
Cypress.Commands.add("testViewport", (testCallback) => {
  // Desktop viewport
  cy.viewport(Cypress.config("viewportWidth"), Cypress.config("viewportHeight"));
  testCallback("desktop");

  // Mobile viewport
  cy.viewport(Cypress.env("mobileViewportWidthBreakpoint"), 667);
  testCallback("mobile");
});
// Api Requests
Cypress.Commands.add("fetchYearlyData", (year) => {
  cy.request({
    method: "GET",
    url: "localhost:5000/api/transactions/yearly",
    qs: { year },
  })
    .its("body")
    .as("yearlyData");
});
Cypress.Commands.add("fetchMonthData", ({ type, year, month }) => {
  cy.request({
    method: "GET",
    url: "localhost:5000/api/transactions/monthly",
    qs: {
      type,
      year,
      month,
    },
    credentials: "include",
  })
    .its("body")
    .as("monthlyData");
});
// API intercept setup
Cypress.Commands.add("setupApiMonitors", () => {
  cy.intercept({
    method: "GET",
    url: "**/api/transactions/monthly*",
  }).as("monthlyData");

  cy.intercept({
    method: "GET",
    url: "**/api/transactions/yearly*",
  }).as("yearlyData");
});
Cypress.Commands.add("getCategoryInterceptor", () => {
  cy.intercept({
    method: "GET",
    url: "**/api/categories/get",
  }).as("categories");
});
Cypress.Commands.add("updateUser", () => {
  cy.intercept({
    method: "POST",
    url: "**/api/users/update",
  }).as("UpdateUser");
});
// Test Responsive Layout
Cypress.Commands.add("testResponsiveLayout", () => {
  // Test desktop layout
  cy.viewport(1200, 800);
  cy.getDataCy("topBar").should("not.be.visible");
  cy.getDataCy("left-sidebar").should("be.visible");
  cy.getDataCy("bottom-nav").should("not.be.visible");

  // Test mobile layout
  cy.viewport(375, 667);
  cy.getDataCy("topBar").should("be.visible");
  cy.getDataCy("left-sidebar").should("not.be.visible");
  cy.getDataCy("bottom-nav").should("be.visible");
});
