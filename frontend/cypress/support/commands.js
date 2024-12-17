// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("login", () => {
  cy.window().then((win) => {
    win.localStorage.setItem("user", JSON.stringify({ id: 1, name: "Test User" }));
  });
});

Cypress.Commands.add("logout", () => {
  cy.clearLocalStorage();
});
// Command to fill login form
Cypress.Commands.add("fillLoginForm", (email, password) => {
  cy.get('[data-test="login-email"]').type(email);
  cy.get('[data-test="login-password"]').type(password);
});

// Command to fill signup form
Cypress.Commands.add("fillSignupForm", (userData) => {
  cy.get('input[name="firstName"]').type(userData.firstName);
  cy.get('input[name="lastName"]').type(userData.lastName);
  cy.get('input[name="email"]').type(userData.email);
  cy.get('input[name="password"]').type(userData.password);
  cy.get('input[name="confirmPassword"]').type(userData.confirmPassword);
});

// Command to simulate successful login state
Cypress.Commands.add("loginByApi", () => {
  cy.window().then((win) => {
    win.localStorage.setItem(
      "user",
      JSON.stringify({
        id: 1,
        email: "test@gmail.com",
        token: "fake-jwt-token",
      })
    );
  });
});
