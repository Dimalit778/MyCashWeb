import "cypress-file-upload";
Cypress.Commands.add("seedDatabase", (options = {}) => {
  return cy.task("db:seed", options);
});

Cypress.Commands.add("clearDatabase", () => {
  cy.task("db:clear");
});
Cypress.Commands.add("loginTestUser", () => {
  const apiUrl = Cypress.env("API_URL");
  cy.request({
    method: "POST",
    url: `${apiUrl}/api/auth/login`,
    failOnStatusCode: false, // Don't fail immediately
    body: {
      email: "cypress@gmail.com",
      password: "144695",
    },
  }).then((response) => {
    expect(response.status).to.eq(200);
    const { accessToken, user } = response.body.data;
    cy.setCookie("token", accessToken);

    // Set up Redux store
    cy.window().then((win) => {
      win.localStorage.setItem(
        "persist:root",
        JSON.stringify({
          user: JSON.stringify({ user }),
        })
      );
    });
  });
});
Cypress.Commands.add("saveFakeUser", () => {
  const user = {
    firstName: "Cypress",
    lastName: "Test",
    email: "cypress@gmail.com",
  };
  cy.setCookie("token", "fakeToken");

  // Set up Redux store
  cy.window().then((win) => {
    win.localStorage.setItem(
      "persist:root",
      JSON.stringify({
        user: JSON.stringify({ user }),
      })
    );
  });
});
// Login User with real Api Call
Cypress.Commands.add("loginUser", (email = Cypress.env("TEST_EMAIL"), password = Cypress.env("TEST_PASSWORD")) => {
  const apiUrl = Cypress.env("API_URL");
  cy.session([email, password], () => {
    cy.request({
      method: "POST",
      url: `${apiUrl}/api/auth/login`,
      body: { email, password },
    }).then((response) => {
      expect(response.status).to.eq(200);
      const { accessToken, user } = response.body.data;
      cy.setCookie("token", accessToken);

      // Set up Redux store
      cy.window().then((win) => {
        win.localStorage.setItem(
          "persist:root",
          JSON.stringify({
            user: JSON.stringify({ user }),
          })
        );
      });
    });
  });
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
Cypress.Commands.add("transactionInterceptor", (fixturePath = "smallMonthlyData.json") => {
  cy.intercept("GET", "**/api/transactions/monthly*", (req) => {
    delete req.headers["if-none-match"];
    delete req.headers["if-modified-since"];
    req.reply({
      statusCode: 200,
      fixture: fixturePath,
    });
  }).as("monthlyData");

  cy.intercept("POST", "**/api/transactions/add", (req) => {
    delete req.headers["if-none-match"];
    delete req.headers["if-modified-since"];
  }).as("addTransaction");
  cy.intercept("POST", "**/api/transactions/update", (req) => {
    delete req.headers["if-none-match"];
    delete req.headers["if-modified-since"];
  }).as("updateTransaction");
  cy.intercept("DELETE", "**/api/transactions/delete/*").as("deleteTransaction");
});

// Cypress.Commands.add("getCategoryInterceptor", () => {
//   cy.intercept({
//     method: "GET",
//     url: "**/api/categories/get",
//   }).as("categories");
// });
// Cypress.Commands.add("updateUser", () => {
//   cy.intercept({
//     method: "POST",
//     url: "**/api/users/update",
//   }).as("UpdateUser");
// });
// Test Responsive Layout
Cypress.Commands.add("testResponsiveLayout", () => {
  // Test desktop layout
  cy.viewport(1200, 800);
  cy.getDataCy("top-bar").should("not.be.visible");
  cy.getDataCy("left-sidebar").should("be.visible");
  cy.getDataCy("bottom-nav").should("not.be.visible");

  // Test mobile layout
  cy.viewport(375, 667);
  cy.getDataCy("top-bar").should("be.visible");
  cy.getDataCy("left-sidebar").should("not.be.visible");
  cy.getDataCy("bottom-nav").should("be.visible");
});
