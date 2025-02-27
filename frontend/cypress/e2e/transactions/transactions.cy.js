describe("Transactions", () => {
  beforeEach(() => {
    cy.transactionInterceptor();
    cy.loginUser();
    cy.visit("/transactions/incomes");
    cy.url().should("include", "/transactions/incomes");
  });
  xit("add new transaction", () => {
    cy.get("button").contains("New Income").click();

    cy.getDataCy("modal-description").type("Test Income");
    cy.getDataCy("modal-amount").type("50");
    cy.get('select[name="category"]').select(1);
    cy.get('input[name="date"]').type("2025-02-27");

    cy.get("button").contains("Create").click();

    // Wait for the transaction to be added
    cy.wait("@addTransaction").then((interception) => {
      expect(interception.response.statusCode).to.eq(201);
    });

    // Optional: Verify the transaction was added
    cy.contains("Test Income").should("be.visible");
  });
  xit("show all transactions", () => {
    cy.wait("@monthlyData").then((data) => {
      const { transactions } = data.response.body.data;
      cy.getDataCy("transactions-table").should("exist");
      cy.getDataCy("transactions-body").find("tr").should("have.length", transactions.length);
    });
  });

  it("should handle complete transaction deletion flow", () => {
    cy.getDataCy("transactions-row").should("be.visible");

    cy.getDataCy("transactions-row").eq(0).find('input[type="checkbox"]').check();

    cy.getDataCy("delete-transaction-button").should("be.visible").should("be.enabled").click();
    cy.get(".swal2-popup").should("be.visible").and("contain", "Delete incomes?");

    cy.get(".swal2-confirm").should("contain", "Delete").and("be.visible").and("be.enabled");
    cy.get(".swal2-cancel").should("contain", "Cancel").and("be.visible").and("be.enabled");

    cy.get(".swal2-cancel").click();
    cy.get(".swal2-popup").should("not.exist");
    cy.getDataCy("transactions-row").should("have.length.gte", 1);

    cy.getDataCy("delete-transaction-button").should("be.visible").should("be.enabled").click();
    cy.get(".swal2-confirm").click();

    cy.wait("@deleteTransaction").then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });
  });
  xit("should handle multiple transaction deletion", () => {
    cy.getDataCy("transactions-row").should("have.length.gte", 2);

    cy.get("table tbody tr").first().find('input[type="checkbox"]').check();
    cy.get("table tbody tr").eq(1).find('input[type="checkbox"]').check();
    cy.getDataCy("delete-transaction-button").should("be.visible").and("be.enabled").should("have.text", "Delete(2)");

    cy.getDataCy("delete-transaction-button").click();

    cy.get(".swal2-confirm").click();

    cy.wait("@deleteTransactions").then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });
  });
});

// import { format } from "date-fns";

// const transactionTypes = ["expenses", "incomes"];

// describe("Transaction Page", () => {
//   transactionTypes.forEach((type) => {
//     describe(`${type} transactions`, () => {
//       beforeEach(() => {
//         cy.setupApiMonitors();
//         cy.loginUser();
//         cy.visit(`/transactions/${type}`);
//       });

//       it(`should display ${type} table and data correctly`, () => {
//         cy.wait("@monthlyData").then((data) => {
//           const { transactions } = data.response.body.data;
//           cy.getDataCy("transactions-table").should("exist");
//           cy.getDataCy("transactions-body").find("tr").should("have.length", transactions.length);

//           // Verify each transaction row
//           cy.getDataCy("transactions-row").each(($row, index) => {
//             const transaction = transactions[index];
//             cy.wrap($row).within(() => {
//               cy.get("td").eq(0).should("contain", transaction.name);
//               cy.get("td").eq(1).should("contain", `$${transaction.amount.toLocaleString()}`);
//               cy.get("td").eq(2).find(".badge").should("contain", transaction.category.name);
//               cy.get("td")
//                 .eq(3)
//                 .should("contain", format(new Date(transaction.date), "MMM dd, yyyy"));
//             });
//           });
//         });
//       });

//       it(`should navigate calendar for ${type}`, () => {
//         cy.getDataCy("calendar-title")
//           .invoke("text")
//           .then((initialMonth) => {
//             cy.getDataCy("calendar-next-button").click();

//             cy.wait("@monthlyData").then((newData) => {
//               // Verify URL and data type
//               cy.url().should("include", `/transactions/${type}`);
//               expect(newData.request.url).to.include(`type=${type}`);
//             });
//           });
//       });

//       it.only(`should display categories for ${type}`, () => {
//         cy.getDataCy("progress-container").should("exist");
//         cy.wait("@monthlyData").then((data) => {
//           const res = data.response.body.data;
//           console.log("categories", res);
//         });
//       });
//     });
//   });

//   // Common functionality tests
//   describe("Common functionality", () => {
//     beforeEach(() => {
//       cy.setupApiMonitors();
//       cy.loginUser();
//     });

//     it("should handle loading states", () => {
//       cy.visit("/transactions/expenses");
//       cy.getDataCy("loading").should("be.visible");
//       cy.wait("@monthlyData");
//       cy.getDataCy("loading").should("not.exist");
//     });

//     it("should handle errors", () => {
//       cy.intercept("GET", "**/api/transactions/monthly*", {
//         statusCode: 500,
//         body: { error: "Server error" },
//       }).as("errorResponse");

//       cy.visit("/transactions/expenses");
//       cy.getDataCy("error-message").should("be.visible");
//     });
//   });
// });
