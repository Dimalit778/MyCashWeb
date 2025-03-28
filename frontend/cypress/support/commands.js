import "cypress-file-upload";

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
Cypress.Commands.add("getCategories", (type) => {
  cy.request({
    method: "GET",
    url: `${Cypress.env("API_URL")}/api/categories/get?type=${type}`,
  }).then((response) => {
    return response.body;
  });
});
Cypress.Commands.add("getTransactions", (type) => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  cy.request({
    method: "GET",
    url: `${Cypress.env("API_URL")}/api/transactions/monthly?type=${type}&year=${year}&month=${month}`,
  }).then((response) => {
    return response.body;
  });
});
