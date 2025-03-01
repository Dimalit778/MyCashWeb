describe("Create Transaction", () => {
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

  it("should add a new Transaction", () => {
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

    cy.contains("button", "New Income").click();

    cy.getDataCy("transaction-modal").within(() => {
      cy.getDataCy("modal-description").type("Test Income");
      cy.getDataCy("modal-amount").type("50");
      cy.get('select[name="category"]').select(1);
      cy.get('input[type="date"]').type("2025-02-27");
      cy.contains("button", "Create").click();
    });

    cy.wait("@addTransaction").then((interception) => {
      expect(interception.request.body).to.include({
        description: "Test Income",
        amount: 50,
        type: "incomes",
      });
    });

    cy.contains("Successfully added").should("be.visible");

    cy.wait("@updatedMonthlyData");
    cy.getDataCy("transactions-table").should("exist");
    cy.contains("Test Income").should("be.visible");
  });

  it("should add a new Transaction Form Validation errors", () => {
    cy.getDataCy("transaction-modal").should("not.exist");
    cy.getDataCy("add-transaction").click();

    cy.getDataCy("transaction-modal").within(() => {
      cy.contains("button", "Create").should("be.visible").and("be.enabled");
      cy.contains("button", "Cancel").should("be.visible").and("be.enabled");

      cy.contains("button", "Create").click();

      cy.contains("Description is required").should("be.visible");
      cy.contains("Amount is required").should("be.visible");
      cy.contains("Category is required").should("be.visible");

      cy.getDataCy("modal-description").type("T");
      cy.getDataCy("modal-amount").type("0");

      cy.contains("button", "Create").click();

      cy.contains("must be at least 2 characters").should("be.visible");
      cy.contains("must be greater than 0").should("be.visible");

      cy.getDataCy("modal-description").type("toManyCharactersLong");
      cy.getDataCy("modal-amount").type("10000000");

      cy.contains("button", "Create").click();

      cy.contains("must be less then 20 characters").should("be.visible");
      cy.contains("must not exceed 1,000,000").should("be.visible");

      cy.contains("button", "Cancel").click();
    });

    cy.getDataCy("transaction-modal").should("not.exist");
  });

  it("should cancel creation when user clicks cancel", () => {
    cy.getDataCy("transaction-modal").should("not.exist");
    cy.getDataCy("add-transaction").click();

    cy.getDataCy("transaction-modal").within(() => {
      cy.contains("button", "Cancel").click();
    });

    cy.getDataCy("transaction-modal").should("not.exist");
  });

  it("should handle creation error gracefully", () => {
    // Intercept form validation API call
    cy.intercept("POST", "**/api/transactions/add", {
      statusCode: 500,
      body: {
        success: false,
        message: "Failed to add transaction",
      },
    }).as("addTransactionError");

    // Open the transaction modal
    cy.contains("button", "New Income").click();

    // Fill in required fields so the form can be submitted
    cy.getDataCy("transaction-modal").within(() => {
      cy.get('input[placeholder="Enter description"]').type("Test Description");

      cy.get('input[placeholder="0.00"]').type("100");

      cy.get('input[type="date"]').type("2025-03-01");

      cy.get('select[name="category"]').select(1);

      cy.contains("button", "Create").click();
    });

    cy.wait("@addTransactionError");
    cy.contains("button", "Cancel").click();

    cy.contains("Failed to add transaction").should("be.visible");
  });
});
