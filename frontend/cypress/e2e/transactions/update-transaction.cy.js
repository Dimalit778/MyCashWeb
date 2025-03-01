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
  it("Edit Form  Form Validation errors", () => {
    cy.getDataCy("transactions-row").should("exist");
    cy.getDataCy("transactions-row").first().click();

    cy.getDataCy("transaction-modal").within(() => {
      cy.contains("button", "Update").should("be.disabled");

      cy.getDataCy("modal-amount").find("input").focus();

      cy.getDataCy("modal-amount").find("input").blur();
      cy.getDataCy("modal-description").find("input").focus();

      cy.contains("button", "Update").should("be.disabled");

      cy.getDataCy("modal-description").find("input").clear();
      cy.getDataCy("modal-description").find("input").type("Updated Transaction");

      // Button should now be enabled
      cy.contains("button", "Update").should("not.be.disabled");

      // Revert back to original value
      cy.getDataCy("modal-description").find("input").clear();
      cy.getDataCy("modal-description").find("input").type("Existing Transaction");

      cy.contains("button", "Update").should("be.disabled");

      cy.contains("button", "Cancel").click();
    });

    cy.getDataCy("transaction-modal").should("not.exist");
  });
  it("Update Transaction", () => {
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
            user: "67952bc8edea680fb371e84c",
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

    cy.getDataCy("transactions-row").first().click();

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

    cy.wait("@updateTransaction").then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });

    cy.contains("Successfully updated").should("be.visible");

    cy.wait("@updatedMonthlyData");
    cy.contains("Updated Transaction").should("be.visible");
  });
});
