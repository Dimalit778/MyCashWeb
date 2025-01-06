// cypress/e2e/transactions/transactionPage.cy.js

import { format } from "date-fns";

const transactionTypes = ["expenses", "incomes"];

describe("Transaction Page", () => {
  transactionTypes.forEach((type) => {
    describe(`${type} transactions`, () => {
      beforeEach(() => {
        cy.setupApiMonitors();
        cy.loginUser();
        cy.visit(`/transactions/${type}`);
      });

      it(`should display ${type} table and data correctly`, () => {
        cy.wait("@monthlyData").then((data) => {
          const { transactions } = data.response.body.data;
          cy.getDataCy("transactions-table").should("exist");
          cy.getDataCy("transactions-body").find("tr").should("have.length", transactions.length);

          // Verify each transaction row
          cy.getDataCy("transactions-row").each(($row, index) => {
            const transaction = transactions[index];
            cy.wrap($row).within(() => {
              cy.get("td").eq(0).should("contain", transaction.name);
              cy.get("td").eq(1).should("contain", `$${transaction.amount.toLocaleString()}`);
              cy.get("td").eq(2).find(".badge").should("contain", transaction.category.name);
              cy.get("td")
                .eq(3)
                .should("contain", format(new Date(transaction.date), "MMM dd, yyyy"));
            });
          });
        });
      });

      it(`should navigate calendar for ${type}`, () => {
        cy.getDataCy("calendar-title")
          .invoke("text")
          .then((initialMonth) => {
            cy.getDataCy("calendar-next-button").click();

            cy.wait("@monthlyData").then((newData) => {
              // Verify URL and data type
              cy.url().should("include", `/transactions/${type}`);
              expect(newData.request.url).to.include(`type=${type}`);
            });
          });
      });

      it.only(`should display categories for ${type}`, () => {
        cy.getDataCy("progress-container").should("exist");
        cy.wait("@monthlyData").then((data) => {
          const res = data.response.body.data;
          console.log("categories", res);
        });
      });
    });
  });

  // Common functionality tests
  describe("Common functionality", () => {
    beforeEach(() => {
      cy.setupApiMonitors();
      cy.loginUser();
    });

    it("should handle loading states", () => {
      cy.visit("/transactions/expenses");
      cy.getDataCy("loading").should("be.visible");
      cy.wait("@monthlyData");
      cy.getDataCy("loading").should("not.exist");
    });

    it("should handle errors", () => {
      cy.intercept("GET", "**/api/transactions/monthly*", {
        statusCode: 500,
        body: { error: "Server error" },
      }).as("errorResponse");

      cy.visit("/transactions/expenses");
      cy.getDataCy("error-message").should("be.visible");
    });
  });
});

// For specific components:
// cypress/e2e/transactions/components/calendar.cy.js
// describe("Calendar Component", () => {
//   transactionTypes.forEach((type) => {
//     describe(`Calendar for ${type}`, () => {
//       beforeEach(() => {
//         cy.setupApiMonitors();
//         cy.loginUser();
//         cy.visit(`/transactions/${type}`);
//       });

//       it("should update data on month change", () => {
//         cy.wait("@monthlyData");
//         cy.getDataCy("calendar-next-button").click();
//         cy.wait("@monthlyData");
//         // Verify data updates
//       });
//     });
//   });
// });
