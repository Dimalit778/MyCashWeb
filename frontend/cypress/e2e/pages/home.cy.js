describe("Home Page", () => {
  it("displays yearly statistics", () => {
    // cy.intercept("GET", `${Cypress.env("API_URL")}api/transactions/yearly/*`).as("yearlyData");
    cy.intercept("GET", "https://jsonplaceholder.typicode.com/users").as("yearlyData");

    cy.wait("@yearlyData").should(($obj) => {
      const requestBody = $obj.request.body;
      cy.log(requestBody);
    });
  });

  //   it("shows loading state while fetching data", () => {
  //     cy.visit("/home");
  //     cy.getDataCy("skeleton-loading").should("be.visible");
  //     cy.wait("@yearlyData");
  //     cy.getDataCy("skeleton-loading").should("not.exist");
  //     cy.getDataCy("year-stats").should("be.visible");
  //   });

  //   it("updates statistics when year changes", () => {
  //     cy.wait("@yearlyData");
  //     cy.getDataCy("year-selector").click();
  //     cy.getDataCy("year-2023").click();

  //     cy.wait("@yearlyData").then((interception) => {
  //       expect(interception.response.statusCode).to.equal(200);
  //       const newData = interception.response.body.data;

  //       cy.getDataCy("stats-expenses").should("contain", newData.yearlyStats.totalExpenses);
  //       cy.getDataCy("stats-incomes").should("contain", newData.yearlyStats.totalIncomes);
  //       cy.getDataCy("stats-balance").should("contain", newData.yearlyStats.balance);
  //     });
  //   });
});
