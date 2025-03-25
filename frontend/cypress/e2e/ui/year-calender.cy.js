describe("Home Page and Yearly Calendar", () => {
  before(() => {
    cy.task("db:clear-db");
    cy.task("db:seed-user");
    cy.task("db:seed-transactions", {
      count: 150,
    });
  });

  const currentYear = new Date().getFullYear();

  beforeEach(() => {
    cy.intercept("GET", "**/api/transactions/yearly*").as("yearlyData");

    cy.loginTestUser();
    cy.visit("/home");
    cy.wait("@yearlyData");
  });

  xdescribe("Yearly Calendar Navigation", () => {
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

  describe("Yearly Statistics", () => {
    it("should display correct yearly statistics", () => {
      // Wait for data to load
      cy.get("@yearlyData").then(({ response }) => {
        const { yearlyStats } = response.body.data;

        // Verify expenses amount
        cy.getDataCy("expenses-amount")
          .should("be.visible")
          .and("have.attr", "data-amount", yearlyStats.totalExpenses.toString());

        // Verify incomes amount
        cy.getDataCy("incomes-amount")
          .should("be.visible")
          .and("have.attr", "data-amount", yearlyStats.totalIncomes.toString());

        // Verify balance amount
        cy.getDataCy("balance-amount")
          .should("be.visible")
          .and("have.attr", "data-amount", yearlyStats.totalBalance.toString());

        // Verify balance color is correct (green for positive, red for negative)
        if (yearlyStats.totalBalance >= 0) {
          cy.getDataCy("balance-amount").should("have.css", "color", "rgb(40, 167, 69)");
        } else {
          cy.getDataCy("balance-amount").should("have.css", "color", "rgb(220, 53, 69)");
        }
      });
    });
  });

  xdescribe("Year Chart", () => {
    it("should display year chart with monthly data", () => {
      cy.getDataCy("year-chart").should("be.visible");

      // Check chart elements
      cy.get(".recharts-layer .recharts-bar-rectangle").should("have.length.at.least", 1);

      // Check chart legend
      cy.contains("Monthly Incomes").should("be.visible");
      cy.contains("Monthly Expenses").should("be.visible");
    });

    it("should update chart when changing year", () => {
      // Store initial chart state (we can use the existence of chart bars)
      cy.get(".recharts-layer .recharts-bar-rectangle").should("exist");

      // Change year
      cy.getDataCy("year-next-btn").click();
      cy.wait("@yearlyData");

      // Verify chart still exists after update
      cy.get(".recharts-layer .recharts-bar-rectangle").should("exist");
    });
  });

  xdescribe("Loading and Error States", () => {
    it("should show loading state while fetching data", () => {
      // Slow response
      cy.intercept("GET", "**/api/transactions/yearly*", (req) => {
        req.on("response", (res) => {
          res.setDelay(1000);
        });
      }).as("slowYearlyData");

      cy.visit("/home");

      // Verify loading state
      cy.getDataCy("loading-overlay").should("be.visible");
      cy.wait("@slowYearlyData");
      cy.getDataCy("loading-overlay").should("not.be.visible");
    });

    it("should handle empty data gracefully", () => {
      // Mock empty response
      cy.intercept("GET", "**/api/transactions/yearly*", {
        statusCode: 200,
        body: {
          data: {
            yearlyStats: {
              totalIncomes: 0,
              totalExpenses: 0,
              totalBalance: 0,
            },
            monthlyStats: [],
          },
        },
      }).as("emptyYearlyData");

      cy.visit("/home");
      cy.wait("@emptyYearlyData");

      // Verify UI handles empty data gracefully
      cy.getDataCy("year-chart").should("be.visible");
      cy.getDataCy("expenses-amount").should("contain", "$0");
      cy.getDataCy("incomes-amount").should("contain", "$0");
      cy.getDataCy("balance-amount").should("contain", "$0");
    });
  });

  xdescribe("Year Navigation Interaction", () => {
    it("should support keyboard navigation for year selection", () => {
      // Tab to year navigation
      cy.getDataCy("year-prev-btn").focus();
      cy.realPress("Enter");

      cy.wait("@yearlyData");
      cy.getDataCy("year-display").should("contain", (currentYear - 1).toString());

      // Next with keyboard
      cy.getDataCy("year-next-btn").focus();
      cy.realPress("Enter");

      cy.wait("@yearlyData");
      cy.getDataCy("year-display").should("contain", currentYear.toString());
    });

    it("should maintain selected year state after page reload", () => {
      // Navigate to next year
      cy.getDataCy("year-next-btn").click();
      cy.wait("@yearlyData");
      cy.getDataCy("year-display").should("contain", (currentYear + 1).toString());

      // Reload page
      cy.reload();
      cy.wait("@yearlyData");

      // Verify year selection persisted
      cy.getDataCy("year-display").should("contain", (currentYear + 1).toString());
    });
  });

  xdescribe("Navigation Integration", () => {
    it("should maintain context when navigating between pages", () => {
      // Navigate to next year
      cy.getDataCy("year-next-btn").click();
      cy.wait("@yearlyData");
      cy.getDataCy("year-display").should("contain", (currentYear + 1).toString());

      // Navigate to expenses page
      cy.getDataCy("nav-link-expenses").click();
      cy.url().should("include", "/transactions/expenses");

      // Navigate back to home
      cy.getDataCy("nav-link-home").click();
      cy.url().should("include", "/home");
      cy.wait("@yearlyData");

      // Verify year selection persisted
      cy.getDataCy("year-display").should("contain", (currentYear + 1).toString());
    });
  });
});
