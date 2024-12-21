describe("Home Page", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/transactions/yearly*", {
      fixture: "yearData.json",
    }).as("initialData");

    cy.login(Cypress.env("TEST_EMAIL"), Cypress.env("TEST_PASSWORD"));
    cy.visit("/home");
    cy.url().should("include", "/home");
    cy.getDataCy("year-skeleton").should("exist");
    cy.wait("@initialData");
  });

  // describe("Initial Load", () => {
  //   it("should show loading skeleton initially", () => {
  //     cy.intercept("GET", "/api/transactions/yearly*", {
  //       fixture: "yearData.json",
  //     }).as("delayedData");

  //     cy.getDataCy("year-skeleton").should("exist");
  //     cy.wait("@delayedData");
  //   });

  //   it("should show error state when API fails", () => {
  //     cy.intercept("GET", "/api/transactions/yearly*", {
  //       statusCode: 500,
  //       body: { message: "Server error" },
  //     }).as("errorData");

  //     cy.wait("@errorData");

  //     cy.getDataCy("year-error").should("be.visible");
  //   });
  // });
  describe("Year Calendar Navigation", () => {
    it("should handle year navigation and show loading states", () => {
      const currentYear = new Date().getFullYear();

      cy.getDataCy("year-display").should("be.visible").and("have.text", currentYear.toString());

      // Test previous year navigation
      cy.intercept("GET", `/api/transactions/yearly?year=${currentYear - 1}`, {
        delay: 1000,
        fixture: "yearData.json",
      }).as("prevYearData");

      cy.getDataCy("year-prev-btn").click();
      cy.getDataCy("loading-container").should("be.visible");

      cy.wait("@prevYearData");
      cy.getDataCy("year-display").should("have.text", (currentYear - 1).toString());

      // Test next year navigation
      cy.intercept("GET", `/api/transactions/yearly?year=${currentYear}`, {
        delay: 1000,
        fixture: "yearData.json",
      }).as("nextYearData");

      cy.getDataCy("year-next-btn").click();

      // Verify loading spinner appears
      cy.getDataCy("loading-container").should("be.visible");

      // Wait for data and verify year updated
      cy.wait("@nextYearData");
      cy.getDataCy("year-display").should("have.text", currentYear.toString());
    });
  });
  // describe("Year Stats", () => {
  //   beforeEach(() => {
  //     cy.intercept("GET", "/api/transactions/yearly*", {
  //       fixture: "yearData.json",
  //     }).as("getYearData");
  //     cy.wait("@getYearData");
  //   });

  //   it("should display correct balance colors", () => {
  //     cy.wait("@getYearData").then((interception) => {
  //       const { balance } = interception.response.body.data.yearlyStats;
  //       console.log(balance);
  //       const expectedColor =
  //         balance >= 0
  //           ? "rgb(40, 167, 69)" // Green for positive
  //           : "rgb(220, 53, 69)"; // Red for negative

  //       cy.getDataCy("stats-balance").find("h5").should("have.css", "color", expectedColor);
  //     });
  //   });
  // });
});

// describe("Year Chart", () => {
//   it("should display monthly data chart", () => {
//     cy.get('[data-testid="year-chart"]').should("be.visible");
//     // Add more specific chart tests based on your chart library
//   });

//   it("should update when year changes", () => {
//     // Click previous year
//     cy.get('[data-test="year-prev-btn"]').click();
//     cy.wait("@getYearData");
//     cy.get('[data-testid="year-chart"]').should("be.visible");

//     // Verify chart data updated
//     cy.get('[data-testid="loading-overlay"]').should("have.attr", "show", "true").should("have.attr", "show", "false");
//   });
// });

// describe("Loading States", () => {
//   it("should show loading overlay during data fetching", () => {
//     cy.get('[data-test="year-prev-btn"]').click();
//     cy.get('[data-testid="loading-overlay"]').should("have.attr", "show", "true");
//     cy.wait("@getYearData");
//     cy.get('[data-testid="loading-overlay"]').should("have.attr", "show", "false");
//   });
// });
