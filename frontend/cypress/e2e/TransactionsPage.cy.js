// cypress/e2e/transactions.cy.js
describe("Transactions Page", () => {
  beforeEach(() => {
    cy.setupApiMonitors();
    cy.loginUser();
    cy.visit("/transactions/expenses");
  });

  it("should display transactions with mock data", () => {
    // Wait for mock API response
    cy.wait("@getMonthlyData").then(({ response }) => {
      const { transactions } = response.body.data;

      // Verify table data
      cy.getDataCy("transactions-table").should("exist");
      cy.getDataCy("transactions-body").find("tr").should("have.length", transactions.length);

      // Verify transaction details
      transactions.forEach((transaction, index) => {
        cy.getDataCy("transactions-row")
          .eq(index)
          .within(() => {
            cy.contains(transaction.description);
            cy.contains(`$${transaction.amount.toLocaleString()}`);
            cy.contains(transaction.category);
          });
      });
    });
  });

  it("should handle calendar navigation and data fetching", () => {
    const currentDate = new Date();
    let nextMonth = new Date(currentDate);
    nextMonth.setMonth(currentDate.getMonth() + 1);

    // Mock next month's data
    cy.fixture("monthlyData.json").then((monthlyData) => {
      cy.intercept(
        {
          method: "GET",
          url: "**/api/transactions/monthly*",
          query: {
            year: nextMonth.getFullYear().toString(),
            month: (nextMonth.getMonth() + 1).toString(),
          },
        },
        {
          statusCode: 200,
          body: {
            ...monthlyData,
            data: {
              ...monthlyData.data,
              transactions: [
                {
                  id: "2",
                  description: "Next Month Transaction",
                  amount: 200,
                  category: "Entertainment",
                  date: nextMonth.toISOString(),
                },
              ],
            },
          },
        }
      ).as("getNextMonthData");
    });

    // Test calendar navigation
    cy.getDataCy("calendar-next-button").click();

    // Verify new data is fetched and displayed
    cy.wait("@getNextMonthData").then(({ response }) => {
      const { transactions } = response.body.data;

      // Verify calendar title updated
      cy.getDataCy("calendar-title").should(
        "contain",
        nextMonth.toLocaleString("default", { month: "long", year: "numeric" })
      );

      // Verify new transactions displayed
      cy.getDataCy("transactions-body").find("tr").should("have.length", transactions.length);
    });
  });

  it("should handle error states", () => {
    // Mock API error
    cy.intercept("GET", "**/api/transactions/monthly*", {
      statusCode: 500,
      body: {
        error: "Server error",
      },
    }).as("getErrorResponse");

    cy.visit("/transactions/expenses");
    cy.getDataCy("error-message").should("be.visible");
    cy.contains("Something went wrong");
  });

  it("should handle loading states", () => {
    cy.intercept("GET", "**/api/transactions/monthly*", {
      delay: 1000,
      fixture: "monthlyData.json",
    }).as("getDelayedData");

    cy.visit("/transactions/expenses");
    cy.getDataCy("loading").should("be.visible");
    cy.wait("@getDelayedData");
    cy.getDataCy("loading").should("not.exist");
  });
});
