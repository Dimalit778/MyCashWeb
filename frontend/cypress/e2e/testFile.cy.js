import { format } from "date-fns";
/// Sorting works
describe("Transactions Management", () => {
  before(() => {
    cy.clearDatabase();
    cy.seedDatabase({
      count: 5,
      type: "expenses",
      targetMonth: new Date().getMonth(),
    });
  });

  it("should handle sorting by amount and date", () => {
    cy.intercept("GET", "**/api/transactions/monthly*").as("monthlyData");
    cy.loginWithTestUser();
    cy.visit(`/transactions/expenses`);
    cy.wait("@monthlyData").then((interceptObj) => {
      const transactions = interceptObj.response.body.data.transactions;
      const originalTransactions = [...transactions];

      // ==================== AMOUNT SORTING TESTS ====================
      cy.getDataCy("transactions-row").each((row, index) => {
        if (index < 10) {
          cy.wrap(row)
            .invoke("text")
            .then((text) => {
              const textDigits = text.replace(/[^0-9]/g, "");
              const amountDigits = originalTransactions[index].amount.toString().replace(/[^0-9]/g, "");
              expect(textDigits).to.include(amountDigits);
            });
        }
      });
      cy.contains("th", "Amount").click();
      const sortedByAmountAsc = [...originalTransactions].sort((a, b) => a.amount - b.amount);

      cy.getDataCy("transactions-row").each((row, index) => {
        if (index < 10) {
          cy.wrap(row)
            .invoke("text")
            .then((text) => {
              const textDigits = text.replace(/[^0-9]/g, "");
              const amountDigits = sortedByAmountAsc[index].amount.toString().replace(/[^0-9]/g, "");
              expect(textDigits).to.include(amountDigits);
            });
        }
      });
      cy.contains("th", "Amount").click();
      const sortedByAmountDesc = [...originalTransactions].sort((a, b) => b.amount - a.amount);
      cy.getDataCy("transactions-row").each((row, index) => {
        if (index < 10) {
          cy.wrap(row)
            .invoke("text")
            .then((text) => {
              const textDigits = text.replace(/[^0-9]/g, "");
              const amountDigits = sortedByAmountDesc[index].amount.toString().replace(/[^0-9]/g, "");
              expect(textDigits).to.include(amountDigits);
            });
        }
      });

      // ==================== DATE SORTING TESTS ====================

      cy.visit(`/transactions/expenses`);
      cy.wait("@monthlyData");

      cy.getDataCy("transactions-row").each((row, index) => {
        if (index < 10) {
          const dateString = format(new Date(originalTransactions[index].date), "MMM dd, yyyy");
          cy.wrap(row).should("contain", dateString);
        }
      });
      cy.contains("th", "Date").click();
      const sortedByDateAsc = [...originalTransactions].sort((a, b) => new Date(a.date) - new Date(b.date));

      cy.getDataCy("transactions-row").each((row, index) => {
        if (index < 10) {
          const expectedDateString = format(new Date(sortedByDateAsc[index].date), "MMM dd, yyyy");
          cy.wrap(row).should("contain", expectedDateString);
        }
      });

      cy.contains("th", "Date").click();

      const sortedByDateDesc = [...originalTransactions].sort((a, b) => new Date(b.date) - new Date(a.date));
      cy.getDataCy("transactions-row").each((row, index) => {
        if (index < 10) {
          const expectedDateString = format(new Date(sortedByDateDesc[index].date), "MMM dd, yyyy");
          cy.wrap(row).should("contain", expectedDateString);
        }
      });
    });
  });
});
