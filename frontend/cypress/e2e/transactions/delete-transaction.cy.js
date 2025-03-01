describe("Delete Transaction ", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/api/categories/get*", {
      statusCode: 200,
      body: {
        data: {
          categories: [
            { _id: "cat1", name: "Salary", isDefault: true },
            { _id: "cat2", name: "Bonus", isDefault: false },
          ],
          maxCategories: 10,
        },
      },
    }).as("getCategories");

    cy.intercept("GET", "**/api/transactions/monthly*", {
      statusCode: 200,
      body: {
        data: {
          transactions: [
            {
              _id: "1",
              description: "Transaction 1",
              amount: 100,
              category: "Salary",
              date: new Date("2025-02-20").toISOString(),
            },
            {
              _id: "2",
              description: "Transaction 2",
              amount: 500,
              category: "Investments",
              date: new Date("2025-02-27").toISOString(),
            },
            {
              _id: "3",
              description: "Transaction 3",
              amount: 250,
              category: "Salary",
              date: new Date("2025-02-26").toISOString(),
            },
          ],
          total: 850,
        },
      },
    }).as("multipleTransactions");

    cy.loginUser();
    cy.visit("/transactions/incomes");
    cy.wait("@getCategories");
  });

  it("should delete a single transaction", () => {
    cy.intercept("GET", "**/api/transactions/monthly*", {
      statusCode: 200,
      body: {
        data: {
          transactions: [
            {
              _id: "2",
              description: "Transaction 2",
              amount: 500,
              category: "Salary",
              date: new Date("2025-02-27").toISOString(),
            },
            {
              _id: "1",
              description: "Transaction 3",
              amount: 250,
              category: "Salary",
              date: new Date("2025-02-26").toISOString(),
            },
          ],
          total: 750,
        },
      },
    }).as("updatedMonthlyData");

    cy.intercept("DELETE", "**/api/transactions/delete/*", {
      statusCode: 200,
      body: {
        success: true,
        message: "Transaction deleted successfully",
      },
    }).as("deleteTransaction");
    cy.get('.table-responsive input[type="checkbox"]').first().check();

    cy.contains("button", "Delete").click();

    cy.get(".swal2-confirm").click();

    cy.wait("@deleteTransaction");

    cy.contains("Transaction deleted").should("be.visible");

    cy.wait("@updatedMonthlyData");
    cy.getDataCy("transactions-row").should("have.length", 2);
  });

  it("should delete multiple transactions", () => {
    cy.intercept("GET", "**/api/transactions/monthly*", {
      statusCode: 200,
      body: {
        data: {
          transactions: [
            {
              _id: "3",
              description: "Transaction 3",
              amount: 250,
              category: "Salary",
              date: new Date("2025-02-26").toISOString(),
            },
          ],
          total: 250,
        },
      },
    }).as("updatedMonthlyData");
    cy.intercept("DELETE", "**/api/transactions/delete/*", {
      statusCode: 200,
      body: {
        success: true,
        message: "Transaction deleted successfully",
      },
    }).as("deleteTransaction");
    cy.get('.table-responsive input[type="checkbox"]').first().check();
    cy.get('.table-responsive input[type="checkbox"]').eq(1).check();

    cy.contains("Delete").should("contain", "(2)");

    cy.contains("button", "Delete").click();

    cy.get(".swal2-confirm").click();

    cy.wait("@deleteTransaction");

    cy.contains("Deleted 2 items").should("be.visible");

    cy.wait("@updatedMonthlyData");

    cy.getDataCy("transactions-row").should("have.length", 1);
  });

  it("should cancel deletion when user clicks cancel", () => {
    cy.get('.table-responsive input[type="checkbox"]').first().check();

    cy.contains("button", "Delete").click();

    cy.get(".swal2-cancel").click();

    cy.contains("Transaction 1").should("be.visible");

    cy.get('.table-responsive input[type="checkbox"]').first().should("be.checked");
  });

  it("should handle deletion error gracefully", () => {
    cy.intercept("DELETE", "**/api/transactions/delete/*", {
      statusCode: 500,
      body: {
        success: false,
        message: "Failed to delete transaction",
      },
    }).as("deleteTransactionError");
    cy.get('.table-responsive input[type="checkbox"]').first().check();

    cy.contains("button", "Delete").click();

    cy.get(".swal2-confirm").click();

    cy.wait("@deleteTransactionError");

    cy.contains("Failed to delete transaction").should("be.visible");

    cy.contains("Transaction 1").should("be.visible");
  });
});
