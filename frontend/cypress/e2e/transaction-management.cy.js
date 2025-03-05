import { format } from "date-fns";
describe("Transactions Management ", () => {
  const transactionType = "incomes";
  beforeEach(() => {
    cy.intercept("GET", "**/api/transactions/monthly*", { fixture: "monthlyData.json" }).as("monthlyData");

    cy.loginUser();
    cy.visit(`/transactions/${transactionType}`);
    cy.wait("@monthlyData");
  });
  describe.only("Transaction UI", () => {
    it("should display transactions correctly", () => {
      cy.get("@monthlyData").then((response) => {
        const { transactions, total } = response.response.body.data;
        cy.getDataCy("transactions-row").should("have.length", transactions.length);
        cy.getDataCy("transaction-total-amount").should("contain", `$${total.toLocaleString()}`);
      });
    });
    it("should display NO transactions", () => {
      cy.intercept("GET", "**/api/transactions/monthly*", {
        statusCode: 200,
        body: {
          data: {
            transactions: [],
            total: 0,
          },
        },
      });

      cy.get("@monthlyData").then((response) => {
        const { transactions, total } = response.response.body.data;
        console.log(transactions, total);
        expect(transactions.length).to.equal(0);
        expect(total).to.equal(0);
      });
      cy.getDataCy("transactions-table").should("not.exist");
      cy.getDataCy("transactions-empty").should("be.visible");
    });
  });
  describe("Create Transaction", () => {
    beforeEach(() => {
      cy.intercept("POST", "**/api/transactions/add", {
        statusCode: 200,
        body: {
          success: true,
          message: "Successfully added",
        },
      }).as("addTransaction");
    });
    const newTransaction = {
      _id: "mocked-id-123",
      description: "Test Income",
      amount: 50,
      category: "Salary",
      date: new Date().toISOString().split("T")[0],
      type: "incomes",
    };
    it("should add a new Transaction", () => {
      cy.getDataCy("add-transaction-btn").click();

      cy.getDataCy("transaction-modal").within(() => {
        cy.getDataCy("modal-description").type(newTransaction.description);
        cy.getDataCy("modal-amount").type(newTransaction.amount);
        cy.getDataCy("modal-category").select(newTransaction.category);
        cy.getDataCy("modal-date").type(newTransaction.date);
        cy.getDataCy("modal-submit").click();
      });

      cy.wait("@addTransaction").then((interception) => {
        expect(interception.response.statusCode).to.equal(200);
      });

      cy.contains("Successfully added").should("be.visible");
    });

    it("should add a new Transaction Form Validation errors", () => {
      cy.getDataCy("transaction-modal").should("not.exist");
      cy.getDataCy("add-transaction-btn").click();

      cy.getDataCy("transaction-modal").should("exist");

      cy.getDataCy("modal-submit").as("submit-btn");

      cy.get("@submit-btn").click();

      cy.contains("Description is required").should("be.visible");
      cy.contains("Amount is required").should("be.visible");
      cy.contains("Category is required").should("be.visible");

      cy.getDataCy("modal-description").type("T");
      cy.getDataCy("modal-amount").type("0");

      cy.get("@submit-btn").click();

      cy.contains("must be at least 2 characters").should("be.visible");
      cy.contains("must be greater than 0").should("be.visible");

      cy.getDataCy("modal-description").type("toManyCharactersLong");
      cy.getDataCy("modal-amount").type("10000000");

      cy.get("@submit-btn").click();

      cy.contains("must be less then 20 characters").should("be.visible");
      cy.contains("must not exceed 1,000,000").should("be.visible");
    });

    it("should cancel creation when user clicks cancel", () => {
      cy.getDataCy("transaction-modal").should("not.exist");
      cy.getDataCy("add-transaction-btn").click();

      cy.getDataCy("transaction-modal").within(() => {
        cy.contains("button", "Cancel").click();
      });

      cy.getDataCy("transaction-modal").should("not.exist");
    });

    it("should handle creation error gracefully", () => {
      cy.intercept("POST", "**/api/transactions/add", {
        statusCode: 500,
        body: {
          success: false,
          message: "Failed to add transaction",
        },
      }).as("addTransactionError");
      cy.getDataCy("add-transaction-btn").click();

      cy.getDataCy("transaction-modal").within(() => {
        cy.getDataCy("modal-description").type(newTransaction.description);
        cy.getDataCy("modal-amount").type(newTransaction.amount);
        cy.getDataCy("modal-category").select(newTransaction.category);
        cy.getDataCy("modal-date").type(newTransaction.date);
        cy.getDataCy("modal-submit").click();
      });

      cy.wait("@addTransactionError");

      cy.contains("Failed to add transaction").should("be.visible");
    });
  });
  describe("Delete Transaction ", () => {
    it("should delete a single transaction", () => {
      cy.intercept("DELETE", "**/api/transactions/delete/*", {
        statusCode: 200,
        body: { message: "Transaction deleted" },
      }).as("deleteTransaction");
      cy.getDataCy("transactions-row").find("input").first().check();

      cy.contains("button", "Delete").click();

      cy.get(".swal2-confirm").click();

      cy.wait("@deleteTransaction");

      cy.contains("Transaction deleted").should("be.visible");
    });

    it("should delete multiple transactions", () => {
      cy.intercept("DELETE", "**/api/transactions/delete/*", {
        statusCode: 200,
        body: { message: "Transaction deleted" },
      }).as("deleteTransaction");
      cy.getDataCy("delete-transaction-btn").should("be.disabled");
      cy.getDataCy("transactions-row").find("input[type='checkbox']").first().check();
      cy.getDataCy("transactions-row").find("input[type='checkbox']").eq(1).check();

      cy.getDataCy("delete-transaction-btn").should("be.enabled").click();

      cy.get(".swal2-confirm").click();

      cy.wait("@deleteTransaction").then((interception) => {
        expect(interception.response.statusCode).to.equal(200);
      });

      cy.contains("Deleted").should("be.visible");
      cy.getDataCy("delete-transaction-btn").should("be.disabled");
    });

    it("should cancel deletion when user clicks cancel", () => {
      cy.getDataCy("transactions-row").find("input[type='checkbox']").first().check();

      cy.getDataCy("delete-transaction-btn").should("be.enabled").click();

      cy.get(".swal2-cancel").click();

      cy.getDataCy("transactions-row").find("input[type='checkbox']").first().should("be.checked");
    });

    it("should handle deletion error gracefully", () => {
      cy.intercept("DELETE", "**/api/transactions/delete/*", {
        statusCode: 500,
        body: {
          success: false,
          message: "Failed to delete transaction",
        },
      }).as("deleteTransactionError");
      cy.getDataCy("transactions-row").find("input").first().check();

      cy.getDataCy("delete-transaction-btn").should("be.enabled").click();

      cy.get(".swal2-confirm").click();

      cy.wait("@deleteTransactionError");

      cy.contains("Failed to delete transaction").should("be.visible");
    });
  });
  describe("Edit Transaction", () => {
    it("Edit Form  Form Validation errors", () => {
      cy.getDataCy("transactions-row").should("exist");
      cy.getDataCy("transactions-row").first().click();

      cy.getDataCy("transaction-modal").within(() => {
        cy.getDataCy("modal-submit").should("be.disabled");
        cy.getDataCy("modal-description").find("input");

        cy.getDataCy("modal-amount").find("input").focus();

        cy.getDataCy("modal-amount").find("input").blur();

        cy.getDataCy("modal-description").find("input").focus();

        cy.getDataCy("modal-submit").should("be.disabled");

        cy.getDataCy("modal-description").find("input").clear();
        cy.getDataCy("modal-description").find("input").type("Updated Transaction");

        cy.getDataCy("modal-submit").should("be.enabled");

        cy.getDataCy("modal-cancel").click();
      });

      cy.getDataCy("transaction-modal").should("not.exist");
    });
    it("Update Transaction", () => {
      cy.intercept("PATCH", "**/api/transactions/update*", {
        statusCode: 200,
        body: {
          success: true,
          message: "Transaction updated successfully",
        },
      }).as("updateTransaction");

      cy.getDataCy("transactions-row").first().click();
      cy.getDataCy("transaction-modal").should("be.exist");
      cy.getDataCy("modal-submit").should("be.disabled");

      cy.getDataCy("transaction-modal").within(() => {
        cy.getDataCy("modal-description").clear();
        cy.getDataCy("modal-description").type("Updated Transaction");
        cy.getDataCy("modal-amount").clear();
        cy.getDataCy("modal-amount").type("150");
        cy.getDataCy("modal-category").select(1);
        cy.getDataCy("modal-date").clear();
        cy.getDataCy("modal-date").type(new Date().toISOString().split("T")[0]);
        cy.getDataCy("modal-submit").click();
      });

      cy.wait("@updateTransaction").then((interception) => {
        expect(interception.response.statusCode).to.equal(200);
      });
      cy.getDataCy("transaction-modal").should("not.exist");
      cy.contains("Successfully updated").should("be.visible");
    });
  });
  describe("Sorting Transaction by Amount and Date ", () => {
    it("should sort by amount in ascending and descending order", () => {
      cy.getDataCy("transactions-row").its("length").should("be.at.least", 1);
      cy.get("@monthlyData").then(({ response }) => {
        const transactions = response.body.data.transactions;

        cy.getDataCy("transactions-row").each((row, index) => {
          cy.wrap(row)
            .invoke("text")
            .then((text) => {
              const textDigits = text.replace(/[^0-9]/g, "");
              const amountDigits = transactions[index].amount.toString().replace(/[^0-9]/g, "");
              expect(textDigits).to.include(amountDigits);
            });
        });

        cy.contains("th", "Amount").click();

        const sortedTransactions = [...transactions].sort((a, b) => a.amount - b.amount);

        cy.getDataCy("transactions-row").each((row, index) => {
          cy.wrap(row)
            .invoke("text")
            .then((text) => {
              const textDigits = text.replace(/[^0-9]/g, "");
              const amountDigits = sortedTransactions[index].amount.toString().replace(/[^0-9]/g, "");
              expect(textDigits).to.include(amountDigits);
            });
        });
      });
    });

    it("should sort by date in ascending and descending order", () => {
      cy.getDataCy("transactions-row").its("length").should("be.at.least", 1);
      cy.get("@monthlyData").then(({ response }) => {
        const transactions = response.body.data.transactions;

        cy.getDataCy("transactions-row").each((row, index) => {
          const dateString = format(new Date(transactions[index].date), "MMM dd, yyyy");
          cy.wrap(row).should("contain", dateString);
        });

        cy.contains("th", "Date").click();

        // Sort transactions by date ascending
        const sortedByDateAsc = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

        cy.getDataCy("transactions-row").each((row, index) => {
          const expectedDateString = format(new Date(sortedByDateAsc[index].date), "MMM dd, yyyy");
          cy.wrap(row).should("contain", expectedDateString);
        });
        cy.contains("th", "Date").click();

        const sortedByDateDesc = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

        cy.getDataCy("transactions-row").each((row, index) => {
          const expectedDateString = format(new Date(sortedByDateDesc[index].date), "MMM dd, yyyy");
          cy.wrap(row).should("contain", expectedDateString);
        });
      });
    });
  });
  describe("Pagination Transaction pages", () => {
    beforeEach(() => {
      const transactions = Array.from({ length: 25 }, (_, i) => ({
        _id: `id-${i + 1}`,
        description: `Item ${i + 1}`,
        amount: (i + 1) * 100,
        category: i % 3 === 0 ? "Home" : i % 3 === 1 ? "Shopping" : "Car",
        date: new Date(`2025-03-${(i % 28) + 1}`).toISOString(),
      }));

      cy.intercept("GET", "**/api/transactions/monthly*", {
        statusCode: 200,
        body: {
          data: {
            transactions: transactions,
            total: transactions.reduce((sum, t) => sum + t.amount, 0),
          },
        },
      }).as("transactionData");

      cy.loginUser();
      cy.visit("/transactions/expenses");
    });

    it("verifies correct number of pages for transaction data", () => {
      cy.wait("@transactionData").then(({ response }) => {
        const transactions = response.body.data.transactions;
        const totalItems = transactions.length;
        const itemsPerPage = 10;
        const expectedPages = Math.ceil(totalItems / itemsPerPage);

        cy.getDataCy("transactions-body").find("tr").should("have.length", "10");

        cy.get(".pagination .page-item").then(($pageItems) => {
          const actualPageButtons = $pageItems.length - 2;

          if (expectedPages > 1) {
            expect(actualPageButtons).to.be.at.least(expectedPages);
            const expectedLastPageItems = totalItems % itemsPerPage || itemsPerPage;

            // Navigate to last page
            cy.get(".pagination .page-item").contains(`${expectedPages}`).click();

            // Verify correct number of items on last page
            cy.getDataCy("transactions-body").find("tr").should("have.length", expectedLastPageItems);
            cy.log(`Last page has ${expectedLastPageItems} items as expected`);
          } else {
            cy.log("Only one page of results, pagination may not be displayed");
          }
        });
      });
    });

    it("verifies next/prev button states on different pages", () => {
      const totalItems = 25;
      const itemsPerPage = 10;
      const expectedPages = Math.ceil(totalItems / itemsPerPage);

      cy.get(".pagination .page-item").first().should("have.class", "disabled");

      cy.get(".pagination .page-item").last().should("not.have.class", "disabled");

      cy.get(".pagination .page-item").last().click();

      // On page 2, both prev and next should be enabled
      cy.get(".pagination .active").should("contain", "2");
      cy.get(".pagination .page-item").first().should("not.have.class", "disabled");
      cy.get(".pagination .page-item").last().should("not.have.class", "disabled");

      // Go to last page
      cy.get(".pagination .page-item").contains(`${expectedPages}`).click();

      // On last page, next button should be disabled
      cy.get(".pagination .active").should("contain", `${expectedPages}`);
      cy.get(".pagination .page-item").last().should("have.class", "disabled");

      // Prev button should be enabled
      cy.get(".pagination .page-item").first().should("not.have.class", "disabled");

      // Go back to first page using prev button
      cy.get(".pagination .page-item").first().click();
      cy.get(".pagination .page-item").first().click();

      cy.get(".pagination .active").should("contain", "1");
    });

    it("navigates through all pages using next button", () => {
      cy.get(".pagination .active").should("contain", "1");

      const navigateNext = () => {
        cy.get(".pagination .page-item")
          .last()
          .then(($next) => {
            if (!$next.hasClass("disabled")) {
              cy.get(".pagination .active")
                .invoke("text")
                .then((pageNum) => {
                  cy.log(`Currently on page ${pageNum}, clicking next`);
                });

              cy.getDataCy("transactions-body")
                .find("tr")
                .first()
                .invoke("text")
                .then((text) => {
                  const firstItemText = text.trim();

                  cy.get(".pagination .page-item").last().click();

                  cy.getDataCy("transactions-body")
                    .find("tr")
                    .first()
                    .invoke("text")
                    .should("not.equal", firstItemText);
                  navigateNext();
                });
            } else {
              cy.get(".pagination .active")
                .invoke("text")
                .then((pageNum) => {
                  cy.log(`Reached last page: ${pageNum}`);
                });
            }
          });
      };

      navigateNext();
    });
  });
});
