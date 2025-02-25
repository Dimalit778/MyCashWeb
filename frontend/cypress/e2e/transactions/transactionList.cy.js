describe("Transactions Page", () => {
  beforeEach(() => {
    cy.loginUser();
    cy.intercept("GET", "**/api/transactions/monthly*").as("monthlyData");
    cy.visit("/transactions/expenses");
    cy.wait("@monthlyData");
  });

  it("should load and display transaction data correctly", () => {
    // Test that main components are visible
    cy.getDataCy("calendar-container").should("be.visible");
    cy.getDataCy("transactions-table").should("be.visible");
    cy.getDataCy("progress-container").should("be.visible");

    // Verify transaction data appears in the table
    cy.getDataCy("transactions-row").should("exist");
  });
  it.only("should allow adding a new transaction", () => {
    // Intercept the API request for adding a transaction
    cy.intercept("POST", "**/api/transactions/add").as("addTransaction");

    // Click button to open modal
    cy.contains("button", "New Expense").click();

    // Fill out the form
    cy.getDataCy("description").type("Test Expense");
    cy.getDataCy("amount").type("50");
    cy.getDataCy("category").select("Food");
    cy.getDataCy("date").type("2025-02-25");

    // Submit the form
    cy.contains("button", "Create").click();

    // Wait for API response
    cy.wait("@addTransaction");

    // Verify success message and table update
    cy.contains("expenses added").should("be.visible");
    cy.getDataCy("transactions-row").should("contain", "Test Expense");
  });
  it("should allow editing an existing transaction", () => {
    cy.intercept("PATCH", "**/api/transactions/update/*").as("updateTransaction");

    // Click on first transaction to edit
    cy.getDataCy("transactions-row").first().click();

    // Change description
    cy.getDataCy("description").clear();
    cy.getDataCy("description").type("Updated Expense");

    // Submit the form
    cy.contains("button", "Update").click();

    // Wait for API response
    cy.wait("@updateTransaction");

    // Verify success message and table update
    cy.contains("expenses updated").should("be.visible");
    cy.getDataCy("transactions-row").should("contain", "Updated Expense");
  });
  it("should allow deleting a transaction", () => {
    cy.intercept("DELETE", "**/api/transactions/delete/*").as("deleteTransaction");

    // Get initial count of transactions
    cy.getDataCy("transactions-row").then(($rows) => {
      const initialCount = $rows.length;

      // Select first transaction checkbox
      cy.getDataCy("transactions-row").first().find("input[type='checkbox']").click();

      // Click delete button
      cy.contains("button", "Delete").click();

      // Confirm in dialog
      cy.get(".swal2-confirm").click();

      // Wait for API response
      cy.wait("@deleteTransaction");

      // Verify success message and row count decreased
      cy.contains("Transaction deleted").should("be.visible");
      cy.getDataCy("transactions-row").should("have.length", initialCount - 1);
    });
  });
  it("should update data when navigating through months", () => {
    // Get current month data
    cy.getDataCy("calendar-title").invoke("text").as("currentMonth");

    // Click next month
    cy.intercept("GET", "**/api/transactions/monthly*").as("nextMonthData");
    cy.getDataCy("calendar-next-button").click();
    cy.wait("@nextMonthData");

    // Verify month changed and data updated
    cy.getDataCy("calendar-title")
      .invoke("text")
      .then((nextMonth) => {
        cy.get("@currentMonth").should("not.equal", nextMonth);
      });

    // Verify data reflects the new month
    cy.getDataCy("transactions-table").should("exist");
  });
  it("should display category progress bars correctly", () => {
    cy.getDataCy("progress-container").should("be.visible");
    cy.getDataCy("progress-bar-item").should("have.length.at.least", 1);

    // Verify category totals add up
    cy.getDataCy("progress-bar-total").then(($totals) => {
      // Sum the totals
      let sum = 0;
      $totals.each((i, el) => {
        const amount = parseFloat(el.getAttribute("data-total"));
        sum += amount;
      });

      // Verify sum matches total displayed
      cy.contains("[data-cy='expenses-amount']")
        .invoke("attr", "data-amount")
        .then((total) => {
          expect(sum).to.be.closeTo(parseFloat(total), 0.1);
        });
    });
  });
});
