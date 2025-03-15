describe("Calendar Component Year Navigation", () => {
  const currentYear = new Date().getFullYear();

  beforeEach(() => {
    // Create a single intercept that will catch all yearly data requests
    cy.intercept("GET", "**/api/transactions/yearly*", {
      statusCode: 200,
      body: {
        data: {
          monthlyStats: [],
          yearlyStats: {
            totalIncomes: 1000,
            totalExpenses: 500,
            totalBalance: 500,
          },
        },
      },
    }).as("yearlyData");

    cy.loginUser();
    cy.visit("/home");
    cy.wait("@yearlyData");
  });

  it("updates URL with next year when clicking next", () => {
    // Verify current year is displayed
    cy.getDataCy("year-display").should("contain", currentYear.toString());

    // Click next year button
    cy.getDataCy("year-next-btn").click();

    // Wait for the request and verify year parameter in the URL
    cy.wait("@yearlyData").then((interception) => {
      // Extract year parameter from request URL
      const url = new URL(interception.request.url);
      const yearParam = url.searchParams.get("year");

      // Verify it matches the expected next year
      expect(yearParam).to.equal((currentYear + 1).toString());

      // Verify UI also updated
      cy.getDataCy("year-display").should("contain", (currentYear + 1).toString());
    });
  });

  it("updates URL with previous year when clicking previous", () => {
    // Click previous year button
    cy.getDataCy("year-prev-btn").click();

    // Wait for the request and verify year parameter in the URL
    cy.wait("@yearlyData").then((interception) => {
      const url = new URL(interception.request.url);
      const yearParam = url.searchParams.get("year");

      // Verify it matches the expected previous year
      expect(yearParam).to.equal((currentYear - 1).toString());

      // Verify UI also updated
      cy.getDataCy("year-display").should("contain", (currentYear - 1).toString());
    });
  });
  it("should handle API error for next year", () => {
    // Mock error response
    cy.intercept("GET", `**/api/transactions/yearly?year=${currentYear + 1}`, {
      statusCode: 500,
      body: {
        message: "Server error",
      },
    }).as("getYearError");

    // Click next year
    cy.getDataCy("year-next-btn").click();
    cy.wait("@getYearError");

    // Verify error state
    cy.getDataCy("year-error").should("be.visible").and("contain", "Something went wrong");
  });
});
