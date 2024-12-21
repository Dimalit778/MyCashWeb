Cypress.Commands.add("loginTest", () => {
  // Intercept login request
  cy.intercept("POST", "/api/auth/login").as("loginRequest");

  // Fill in login form
  cy.get('[data-test="login-email"]').type(Cypress.env("TEST_EMAIL"));
  cy.get('[data-test="login-password"]').type(Cypress.env("TEST_PASSWORD"));
  cy.get('[data-test="login-submit"]').click();

  // Wait for and verify response
  cy.wait("@loginRequest").then((interception) => {
    expect(interception.response.statusCode).to.eq(200);
    if (interception.response.body.token) {
      window.localStorage.setItem("token", interception.response.body.token);
    }
  });

  // Verify redirect
  cy.url().should("not.include", "/login");
});

// Login Session
Cypress.Commands.add("login", (email, password) => {
  cy.session([email, password], () => {
    // Make login request
    cy.request({
      method: "POST",
      url: "/api/auth/login",
      body: { email, password },
    }).then((response) => {
      expect(response.status).to.eq(200);

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
