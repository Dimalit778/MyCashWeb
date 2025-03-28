describe("API Authentication", () => {
  beforeEach(() => {
    cy.task("db:clear-db");
    cy.task("db:seed-user");
  });

  context("No authentication", () => {
    beforeEach(() => {
      cy.clearCookies();
    });

    const protectedRequests = [
      { method: "GET", url: "/api/users/get", description: "users API" },
      { method: "GET", url: "/api/transactions/yearly?year=2025", description: "transactions API" },
      { method: "GET", url: "/api/categories/get?type=expenses", description: "categories API" },
    ];

    protectedRequests.forEach((request) => {
      it(`should require authentication for ${request.description}`, () => {
        cy.request({
          method: request.method,
          url: `${Cypress.env("API_URL")}${request.url}`,
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(401);
          expect(response.body).to.have.property("message");
        });
      });
    });
  });
});
