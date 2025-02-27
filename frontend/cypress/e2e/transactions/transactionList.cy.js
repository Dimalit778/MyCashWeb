// describe("Transactions Page", () => {
//   beforeEach(() => {
//     cy.intercept("GET", "**/api/transactions/monthly*", (req) => {
//       delete req.headers["if-none-match"];
//       delete req.headers["if-modified-since"];
//     }).as("monthlyData");

//     cy.loginUser();
//     cy.visit("/transactions/expenses");
//   });

//   xit("should handle responsive layout correctly", () => {
//     cy.testResponsiveLayout();
//   });
//   xit("should display transactions correctly", () => {
//     cy.fixture("monthlyData.json").then((monthlyData) => {
//       cy.intercept("GET", "**/api/transactions/monthly*", {
//         statusCode: 200,
//         body: monthlyData,
//       }).as("getMonthlyData");
//     });

//     // Wait for mock API response
//     cy.wait("@getMonthlyData").then(({ response }) => {
//       const { transactions } = response.body.data;

//       // Verify table data
//       cy.getDataCy("transactions-table").should("exist");
//       cy.getDataCy("transactions-body").find("tr").should("have.length", transactions.length);

//       // Verify transaction details
//       transactions.forEach((transaction, index) => {
//         cy.getDataCy("transactions-row")
//           .eq(index)
//           .within(() => {
//             cy.contains(transaction.description);
//             cy.contains(`$${transaction.amount.toLocaleString()}`);
//             cy.contains(transaction.category);
//             cy.contains(transaction.date);
//           });
//       });
//     });
//   });
//   it("display transactions ", () => {
//     cy.wait("@monthlyData").then(({ response }) => {
//       console.log(response);
//     });
//   });
//   xit("should allow adding a new transaction", () => {
//     cy.intercept("POST", "**/api/transactions/add").as("addTransaction");

//     // Click button to open modal
//     cy.contains("button", "New Expense").click();

//     // Fill out the form
//     cy.getDataCy("description").type("Test Expense");
//     cy.getDataCy("amount").type("50");
//     cy.getDataCy("category").select("Food");
//     cy.getDataCy("date").type("2025-02-25");

//     // Submit the form
//     cy.contains("button", "Create").click();

//     // Wait for API response
//     cy.wait("@addTransaction");

//     // Verify success message and table update
//     cy.contains("expenses added").should("be.visible");
//     cy.getDataCy("transactions-row").should("contain", "Test Expense");
//   });
//   xit("should allow editing an existing transaction", () => {
//     cy.intercept("PATCH", "**/api/transactions/update/*").as("updateTransaction");

//     // Click on first transaction to edit
//     cy.getDataCy("transactions-row").first().click();

//     // Change description
//     cy.getDataCy("description").clear();
//     cy.getDataCy("description").type("Updated Expense");

//     // Submit the form
//     cy.contains("button", "Update").click();

//     // Wait for API response
//     cy.wait("@updateTransaction");

//     // Verify success message and table update
//     cy.contains("expenses updated").should("be.visible");
//     cy.getDataCy("transactions-row").should("contain", "Updated Expense");
//   });
//   xit("should allow deleting a transaction", () => {
//     cy.intercept("DELETE", "**/api/transactions/delete/*").as("deleteTransaction");

//     // Get initial count of transactions
//     cy.getDataCy("transactions-row").then(($rows) => {
//       const initialCount = $rows.length;

//       // Select first transaction checkbox
//       cy.getDataCy("transactions-row").first().find("input[type='checkbox']").click();

//       // Click delete button
//       cy.contains("button", "Delete").click();

//       // Confirm in dialog
//       cy.get(".swal2-confirm").click();

//       // Wait for API response
//       cy.wait("@deleteTransaction");

//       // Verify success message and row count decreased
//       cy.contains("Transaction deleted").should("be.visible");
//       cy.getDataCy("transactions-row").should("have.length", initialCount - 1);
//     });
//   });
//   xit("should update data when navigating through months", () => {
//     // Get current month data
//     cy.getDataCy("calendar-title").invoke("text").as("currentMonth");

//     // Click next month
//     cy.intercept("GET", "**/api/transactions/monthly*").as("nextMonthData");
//     cy.getDataCy("calendar-next-button").click();
//     cy.wait("@nextMonthData");

//     // Verify month changed and data updated
//     cy.getDataCy("calendar-title")
//       .invoke("text")
//       .then((nextMonth) => {
//         cy.get("@currentMonth").should("not.equal", nextMonth);
//       });

//     // Verify data reflects the new month
//     cy.getDataCy("transactions-table").should("exist");
//   });
//   xit("should display category progress bars correctly", () => {
//     cy.getDataCy("progress-container").should("be.visible");
//     cy.getDataCy("progress-bar-item").should("have.length.at.least", 1);

//     // Verify category totals add up
//     cy.getDataCy("progress-bar-total").then(($totals) => {
//       // Sum the totals
//       let sum = 0;
//       $totals.each((i, el) => {
//         const amount = parseFloat(el.getAttribute("data-total"));
//         sum += amount;
//       });

//       // Verify sum matches total displayed
//       cy.contains("[data-cy='expenses-amount']")
//         .invoke("attr", "data-amount")
//         .then((total) => {
//           expect(sum).to.be.closeTo(parseFloat(total), 0.1);
//         });
//     });
//   });
// });
describe("Transaction Management", () => {
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
              _id: "existing-id-1",
              description: "Existing Transaction",
              amount: 100,
              category: "Salary",
              date: new Date("2025-02-20").toISOString(),
            },
          ],
          total: 100,
        },
      },
    }).as("monthlyData");

    cy.loginUser();
    cy.visit("/transactions/incomes");
    cy.wait("@monthlyData");
    cy.wait("@getCategories");
  });

  xit("should add a new transaction without actually saving to database", () => {
    // Intercept the add transaction API call
    cy.intercept("POST", "**/api/transactions/add", {
      statusCode: 200,
      body: {
        data: {
          _id: "mocked-id-123",
          description: "Test Income",
          amount: 50,
          category: "Salary",
          date: new Date("2025-02-27").toISOString(),
          type: "incomes",
        },
      },
    }).as("addTransaction");

    // Intercept subsequent fetch to return updated data including our new transaction
    cy.intercept("GET", "**/api/transactions/monthly*", {
      statusCode: 200,
      body: {
        data: {
          transactions: [
            {
              _id: "existing-id-1",
              description: "Existing Transaction",
              amount: 100,
              category: "Salary",
              date: new Date("2025-02-20").toISOString(),
            },
            {
              _id: "mocked-id-123",
              description: "Test Income",
              amount: 50,
              category: "Salary",
              date: new Date("2025-02-27").toISOString(),
            },
          ],
          total: 150,
        },
      },
    }).as("updatedMonthlyData");

    // Click button to open modal (using your current naming)
    cy.contains("button", "New Income").click();

    // Fill the form using your data-cy attributes
    cy.getDataCy("transaction-modal").within(() => {
      cy.getDataCy("modal-description").type("Test Income");
      cy.getDataCy("modal-amount").type("50");
      cy.get('select[name="category"]').select(0); // Select first option
      cy.get('input[type="date"]').type("2025-02-27");
      cy.contains("button", "Create").click();
    });

    // Verify the request was made with correct data
    cy.wait("@addTransaction").then((interception) => {
      expect(interception.request.body).to.include({
        description: "Test Income",
        amount: 50,
        type: "incomes",
      });
    });

    // Verify success toast appears
    cy.contains("incomes added").should("be.visible");

    // Wait for updated data request and verify UI shows new data
    cy.wait("@updatedMonthlyData");
    cy.getDataCy("transactions-table").should("exist");
    cy.contains("Test Income").should("be.visible");
  });

  xit("should handle validation errors when adding a transaction", () => {
    cy.getDataCy("transaction-modal").should("not.exist");
    cy.getDataCy("add-transaction").click();

    // Try to submit without filling required fields
    cy.getDataCy("transaction-modal").within(() => {
      cy.contains("button", "Create").should("be.disabled");

      // Verify validation errors
      cy.contains("Description is required").should("be.visible");
      cy.contains("Amount is required").should("be.visible");

      // Fill with invalid data
      cy.getDataCy("modal-description").type("T"); // Too short
      cy.getDataCy("modal-amount").type("0"); // Too small

      // Try to submit again
      cy.contains("button", "Create").click();

      // Verify validation errors for invalid data
      cy.contains("Description must be at least 2 characters").should("be.visible");
      cy.contains("Amount must be greater than 0").should("be.visible");

      // Close the modal without saving
      cy.contains("button", "Cancel").click();
    });

    // Verify modal is closed
    cy.getDataCy("transaction-modal").should("not.exist");
  });
  it("should handle form validation and button states", () => {
    cy.getDataCy("transaction-modal").should("not.exist");

    cy.getDataCy("add-transaction").click();

    cy.getDataCy("transaction-modal").within(() => {
      cy.contains("button", "Create").should("be.visible").click();

      // Target the actual input elements
      cy.getDataCy("modal-description").find("input").focus();
      cy.getDataCy("modal-description").find("input").blur();

      cy.contains("Description is required").should("be.visible");
      cy.contains("Amount is required").should("be.visible");
      cy.contains("Category is required").should("be.visible");

      // With invalid data, button should remain disabled
      cy.getDataCy("modal-description").type("T");
      cy.getDataCy("modal-amount").type("0");
      cy.contains("button", "Create").click();

      // Verify validation error messages
      cy.contains("Description must be at least 2 characters").should("be.visible");
      cy.contains("Amount must be greater than 0").should("be.visible");

      // Close the modal without saving
      cy.contains("button", "Cancel").click();
    });

    cy.getDataCy("transaction-modal").should("not.exist");
  });
  xit("should handle edit form button state based on changes", () => {
    // Setup a mock transaction first
    cy.intercept("GET", "**/api/transactions/monthly*", {
      statusCode: 200,
      body: {
        data: {
          transactions: [
            {
              _id: "existing-id-1",
              description: "Existing Transaction",
              amount: 100,
              category: "Salary",
              date: new Date("2025-02-25").toISOString(),
            },
          ],
          total: 100,
        },
      },
    }).as("monthlyData");

    // Wait for data to load
    cy.wait("@monthlyData");

    // Click on transaction to edit
    cy.getDataCy("transactions-row").first().click();

    cy.getDataCy("transaction-modal").within(() => {
      // Update button should be disabled initially (no changes made)
      cy.contains("button", "Update").should("be.disabled");

      // Make no actual changes, just focus and blur fields
      cy.getDataCy("modal-amount").focus();

      cy.getDataCy("modal-amount").blur();
      cy.getDataCy("modal-description").focus();

      // Button should still be disabled
      cy.contains("button", "Update").should("be.disabled");

      // Make an actual change
      cy.getDataCy("modal-description").clear();
      cy.getDataCy("modal-description").type("Updated Transaction");

      // Button should now be enabled
      cy.contains("button", "Update").should("not.be.disabled");

      // Revert back to original value
      cy.getDataCy("modal-description").clear();
      cy.getDataCy("modal-description").type("Existing Transaction");

      // Button should be disabled again
      cy.contains("button", "Update").should("be.disabled");

      // Cancel the edit
      cy.contains("button", "Cancel").click();
    });

    // Verify modal is closed
    cy.getDataCy("transaction-modal").should("not.exist");
  });
  xit("Editing a transaction and Updating it", () => {
    cy.intercept("PATCH", "**/api/transactions/update*", {
      statusCode: 200,
      body: {
        success: true,
        message: "Transaction updated successfully",
        statusCode: 200,
        data: {
          transaction: {
            _id: "existing-id-1",
            description: "Updated Transaction",
            amount: 150,
            category: "Bonus",
            date: new Date("2025-02-25").toISOString(),
            transactionType: "incomes",
            user: "67952bc8edea680fb371e84c", // Include this from your actual response
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            __v: 0,
          },
        },
      },
    }).as("updateTransaction");

    cy.intercept("GET", "**/api/transactions/monthly*", {
      statusCode: 200,
      body: {
        data: {
          transactions: [
            {
              _id: "existing-id-1",
              description: "Updated Transaction",
              amount: 150,
              category: "Investment",
              date: new Date("2025-02-25").toISOString(),
              transactionType: "incomes",
              user: "67952bc8edea680fb371e84c",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          total: 150,
        },
      },
    }).as("updatedMonthlyData");

    // Click on the transaction row to edit
    cy.getDataCy("transactions-row").first().click();

    // Edit the transaction
    cy.getDataCy("transaction-modal").within(() => {
      cy.getDataCy("modal-description").clear();
      cy.getDataCy("modal-description").type("Updated Transaction");
      cy.getDataCy("modal-amount").clear();
      cy.getDataCy("modal-amount").type("150");
      cy.get('select[name="category"]').select(1); // Select second option
      cy.get('input[type="date"]').clear();
      cy.get('input[type="date"]').type("2025-02-25");
      cy.contains("button", "Update").click();
    });

    // Verify the request was made
    cy.wait("@updateTransaction").then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });

    // Verify success toast appears
    cy.contains("incomes updated").should("be.visible");

    // Verify UI shows updated data
    cy.wait("@updatedMonthlyData");
    cy.contains("Updated Transaction").should("be.visible");
  });

  xit("should test deleting a transaction", () => {
    // Intercept the delete transaction API call
    cy.intercept("DELETE", "**/api/transactions/delete/*", {
      statusCode: 200,
      body: {
        success: true,
        message: "Transaction deleted successfully",
      },
    }).as("deleteTransaction");

    // Intercept subsequent fetch to return empty data
    cy.intercept("GET", "**/api/transactions/monthly*", {
      statusCode: 200,
      body: {
        data: {
          transactions: [],
          total: 0,
        },
      },
    }).as("updatedMonthlyData");

    // Select a transaction for deletion
    cy.getDataCy("transactions-row")
      .first()
      .within(() => {
        cy.get('input[type="checkbox"]').click({ force: true });
      });

    // Click delete button
    cy.getDataCy("delete-transaction-button").click();

    // Confirm deletion in the dialog
    cy.get(".swal2-confirm").click();

    // Verify the request was made
    cy.wait("@deleteTransaction");

    // Verify success toast appears
    cy.contains("Transaction deleted").should("be.visible");

    // Verify UI updates to show empty table or updated list
    cy.wait("@updatedMonthlyData");
    cy.getDataCy("transactions-empty").should("exist");
  });
});
