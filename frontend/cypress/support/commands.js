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
Cypress.Commands.add("fetchMonthData", (year) => {
  cy.request({
    method: "GET",
    url: "localhost:5000/api/transactions/monthly",
    qs: { year, type, month },
  })
    .its("body")
    .as("yearlyData");
});
// API intercept setup
Cypress.Commands.add("setupApiMonitors", () => {
  // Monitor yearly transactions requests
  cy.intercept("GET", `${Cypress.env("API_URL")}/transactions/yearly/*`).as("yearlyData");

  // Monitor monthly transactions requests
  cy.intercept("GET", `${Cypress.env("API_URL")}/transactions/monthly/*`).as("monthlyData");
});
