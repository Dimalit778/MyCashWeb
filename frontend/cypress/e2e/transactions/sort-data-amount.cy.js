describe("Transaction Sorting", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/api/transactions/monthly*", {
      statusCode: 200,
      body: {
        data: {
          transactions: [
            {
              _id: "1",
              description: "Low Amount",
              amount: 100,
              category: "Home",
              date: new Date("2025-03-01").toISOString(),
            },
            {
              _id: "2",
              description: "Medium Amount",
              amount: 1000,
              category: "Shopping",
              date: new Date("2025-03-15").toISOString(),
            },
            {
              _id: "3",
              description: "High Amount",
              amount: 10000,
              category: "Car",
              date: new Date("2025-03-09").toISOString(),
            },
          ],
          total: 11100,
        },
      },
    }).as("transactionData");

    cy.loginUser();
    cy.visit("/transactions/expenses");
    cy.wait("@transactionData");
  });

  it("should sort by amount in ascending and descending order", () => {
    cy.contains("th", "Amount").click();

    cy.get("tbody tr").eq(0).should("contain", "$100");
    cy.get("tbody tr").eq(1).should("contain", "$1,000");
    cy.get("tbody tr").eq(2).should("contain", "$10,000");

    cy.contains("th", "Amount").click();

    cy.get("tbody tr").eq(0).should("contain", "$10,000");
    cy.get("tbody tr").eq(1).should("contain", "$1,000");
    cy.get("tbody tr").eq(2).should("contain", "$100");
  });

  it("should sort by date in ascending and descending order", () => {
    cy.contains("th", "Date").click();

    // Verify sorting (ascending order - oldest first)
    cy.get("tbody tr").eq(0).should("contain", "Mar 01, 2025");
    cy.get("tbody tr").eq(1).should("contain", "Mar 09, 2025");
    cy.get("tbody tr").eq(2).should("contain", "Mar 15, 2025");
    // Click on date header again to sort descending
    cy.contains("th", "Date").click();

    cy.get("tbody tr").eq(0).should("contain", "Mar 15, 2025");
    cy.get("tbody tr").eq(1).should("contain", "Mar 09, 2025");
    cy.get("tbody tr").eq(2).should("contain", "Mar 01, 2025");
  });
});
