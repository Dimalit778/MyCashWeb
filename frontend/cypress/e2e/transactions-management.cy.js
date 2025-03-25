describe("Transactions Management", () => {
  before(() => {
    cy.task("db:clear-db");
    cy.task("db:seed-user");
  });

  beforeEach(() => {
    cy.task("db:seed-transactions", { count: 3, type: "expenses", monthly: true });

    cy.intercept("GET", "**/api/transactions/monthly*").as("monthlyData");
    cy.intercept("POST", "**/api/transactions/add*").as("addTransaction");
    cy.intercept("PATCH", "**/api/transactions/update*").as("updateTransaction");
    cy.intercept("DELETE", "**/api/transactions/delete/*").as("deleteTransaction");

    cy.loginTestUser();
    cy.visit(`/transactions/expenses`);
    cy.wait("@monthlyData");
  });
  describe("Create Transactions ", () => {
    beforeEach(() => {
      cy.getDataCy("transaction-modal").should("not.exist");
      cy.getDataCy("add-transaction-btn").click();
      cy.getDataCy("transaction-modal").should("be.exist");
    });
    it("handle close modal", () => {
      cy.getDataCy("transaction-modal").within(() => {
        cy.getDataCy("modal-cancel").click();
      });
      cy.getDataCy("transaction-modal").should("not.exist");
    });

    it("Create new Transaction Successfully", () => {
      cy.getDataCy("transactions-row").then(($rows) => {
        const initialCount = $rows.length;
        cy.getDataCy("modal-description").type("Test Transaction");
        cy.getDataCy("modal-amount").type("100");
        cy.getDataCy("modal-category").select(1);
        cy.getDataCy("modal-date").type(new Date().toISOString().split("T")[0]);
        cy.getDataCy("modal-submit").click();

        cy.wait("@addTransaction").then((interception) => {
          expect(interception.request.body).to.include({
            description: "Test Transaction",
            amount: 100,
          });
          expect(interception.response.statusCode).to.equal(201);

          cy.getDataCy("transactions-row").should("have.length", initialCount + 1);
          cy.contains("Test Transaction").should("be.visible");
        });

        cy.getDataCy("transaction-modal").should("not.exist");
      });
    });

    it("Create Form Validation errors", () => {
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

    it("Create Server Error", () => {
      cy.intercept("POST", "**/api/transactions/add", {
        statusCode: 500,
        body: {
          success: false,
          message: "Failed to add transaction",
        },
      }).as("addTransactionError");

      cy.getDataCy("modal-description").type("Test Error");
      cy.getDataCy("modal-amount").type(100);
      cy.getDataCy("modal-category").select(1);
      cy.getDataCy("modal-date").type(new Date().toISOString().split("T")[0]);
      cy.getDataCy("modal-submit").click();

      cy.wait("@addTransactionError");

      cy.contains("Failed to add transaction").should("be.visible");

      cy.reload();
    });
  });
  describe("Update Transactions ", () => {
    it("Edit Form Validation errors", () => {
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
    it("Edit Update Transaction Successfully", () => {
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
  describe("Delete Transactions ", () => {
    it("Delete single transaction", () => {
      cy.getDataCy("transactions-row").then(($rows) => {
        const initialCount = $rows.length;
        cy.getDataCy("transactions-row").find("input").first().check();
        cy.contains("button", "Delete").click();
        cy.get(".swal2-confirm").click();
        cy.wait("@deleteTransaction");

        cy.contains("Transaction deleted").should("be.visible");
        cy.getDataCy("delete-transaction-btn").should("be.disabled");

        cy.getDataCy("transactions-row").should("have.length", initialCount - 1);
      });
    });
    it("Delete multiple transactions", () => {
      cy.getDataCy("transactions-row").then(($rows) => {
        const initialCount = $rows.length;
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
        cy.getDataCy("transactions-row").should("have.length", initialCount - 2);
      });
    });
    it("Delete cancel deletion when user clicks cancel", () => {
      cy.getDataCy("transactions-row").find("input[type='checkbox']").first().check();

      cy.getDataCy("delete-transaction-btn").should("be.enabled").click();

      cy.get(".swal2-cancel").click();

      cy.getDataCy("transactions-row").find("input[type='checkbox']").first().should("be.checked");
    });

    it("Delete  Server Error", () => {
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

      cy.reload();
    });
  });
});
