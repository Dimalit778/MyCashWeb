describe("Home Page", () => {
  const currentYear = new Date().getFullYear();

  beforeEach(() => {
    // Mock initial year data
    cy.intercept("GET", `**/api/transactions/yearly?year=${currentYear}`, {
      fixture: "currentYearData",
    }).as("getCurrentYearData");

    // Mock next year data
    cy.intercept("GET", `**/api/transactions/yearly?year=${currentYear + 1}`, {
      fixture: "nextYearData",
    }).as("getNextYearData");

    // Mock previous year data
    cy.intercept("GET", `**/api/transactions/yearly?year=${currentYear - 1}`, {
      fixture: "prevYearData",
    }).as("getPrevYearData");

    cy.loginUser();
    cy.visit("/home");
  });

  describe("Year Navigation", () => {
    it("should load and display NEXT year data correctly", () => {
      // Wait for initial data load
      cy.wait("@getCurrentYearData");

      // Initial year should be current year
      cy.getDataCy("year-display").should("be.visible").and("have.text", currentYear.toString());

      // Click next year button
      cy.getDataCy("year-next-btn").click();

      // Verify loading state
      // cy.getDataCy("loading").should("be.visible");
      cy.getDataCy("loading-overlay").should("not.exist");

      cy.wait("@getNextYearData").then((interception) => {
        expect(interception.request.url).to.include(`year=${currentYear + 1}`);

        const { yearlyStats, monthlyStats } = interception.response.body.data;

        cy.getDataCy("year-display").should("have.text", (currentYear + 1).toString());

        cy.getDataCy("expenses-amount").should("have.attr", "data-amount", yearlyStats.totalExpenses.toString());
        cy.getDataCy("incomes-amount").should("have.attr", "data-amount", yearlyStats.totalIncomes.toString());
        cy.getDataCy("balance-amount").should("have.attr", "data-amount", yearlyStats.totalBalance.toString());

        // Verify chart data
        // cy.getDataCy("year-chart").within(() => {
        //   // Verify monthly data points
        //   monthlyStats.forEach((month) => {
        //     cy.get(".recharts-bar-rectangle").should("have.length.at.least", monthlyStats.length);
        //   });
        // });

        // Verify loading state removed
        cy.getDataCy("loading").should("not.exist");
      });
    });
    it("should load and display PREV year data correctly", () => {
      cy.wait("@getCurrentYearData");
      cy.getDataCy("year-display").should("be.visible").and("have.text", currentYear.toString());
      cy.getDataCy("year-prev-btn").click();
      cy.getDataCy("loading-overlay").should("not.exist");

      // Wait for next year data
      cy.wait("@getPrevYearData").then((interception) => {
        expect(interception.request.url).to.include(`year=${currentYear - 1}`);
        const { yearlyStats, monthlyStats } = interception.response.body.data;

        cy.getDataCy("year-display").should("have.text", (currentYear - 1).toString());

        // Verify stats display
        cy.getDataCy("expenses-amount").should("have.attr", "data-amount", yearlyStats.totalExpenses.toString());
        cy.getDataCy("incomes-amount").should("have.attr", "data-amount", yearlyStats.totalIncomes.toString());
        cy.getDataCy("balance-amount").should("have.attr", "data-amount", yearlyStats.totalBalance.toString());

        // // Verify chart data
        // cy.getDataCy("year-chart").within(() => {
        //   // Verify monthly data points
        //   monthlyStats.forEach((month) => {
        //     cy.get(".recharts-bar-rectangle").should("have.length.at.least", monthlyStats.length);
        //   });
        // });

        // Verify loading state removed
        cy.getDataCy("loading").should("not.exist");
      });
    });

    it("should handle no data for next year", () => {
      // Mock empty data response
      cy.intercept("GET", `**/api/transactions/yearly?year=${currentYear + 1}`, {
        body: {
          data: {
            yearlyStats: {
              totalExpenses: 0,
              totalIncomes: 0,
              totalBalance: 0,
            },
            monthlyStats: [],
          },
        },
      }).as("getEmptyYearData");

      // Click next year
      cy.getDataCy("year-next-btn").click();
      cy.wait("@getEmptyYearData");

      // Verify empty state handling
      cy.getDataCy("expenses-amount").should("have.attr", "data-amount", "0");
      cy.getDataCy("incomes-amount").should("have.attr", "data-amount", "0");
      cy.getDataCy("balance-amount").should("have.attr", "data-amount", "0");
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
});
