const apiTransactions = `${Cypress.env("API_URL")}/api/transactions`;

describe("Transactions API", () => {
  before(() => {
    cy.task("db:clear-db");
    cy.task("db:seed-user");
    cy.task("db:seed-transactions", { count: 5 });
  });

  beforeEach(() => {
    cy.loginTestUser();
  });

  describe("POST /transactions/add", () => {
    it("should add a valid transaction successfully", () => {
      const validTransaction = {
        description: "Test Transaction",
        amount: 150.75,
        category: "Food",
        date: new Date().toISOString(),
        type: "expenses",
      };

      cy.request({
        method: "POST",
        url: `${apiTransactions}/add`,
        body: validTransaction,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.data).to.have.property("transaction");
        expect(response.body.data.transaction.description).to.eq(validTransaction.description);
        expect(response.body.data.transaction.amount).to.eq(validTransaction.amount);
      });
    });

    it("should validate all required fields are present", () => {
      const requiredFields = ["description", "amount", "category", "date", "type"];
      requiredFields.forEach((field) => {
        const transaction = {
          description: "Test Transaction",
          amount: 150.75,
          category: "Food",
          date: new Date().toISOString(),
          type: "expenses",
        };

        delete transaction[field];

        cy.request({
          method: "POST",
          url: `${apiTransactions}/add`,
          body: transaction,
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(400);
          expect(response.body.message).to.contain("required fields");
        });
      });
    });

    it("should validate amount constraints", () => {
      const amountTests = [
        { amount: 0, expectedMessage: "Amount must be greater than 0" },
        { amount: 1000001, expectedMessage: "Amount must be less than 1000000" },
        { amount: "invalid_amount", expectedMessage: "Amount must be a number" },
      ];

      amountTests.forEach((test) => {
        const transaction = {
          description: "Test Transaction",
          amount: test.amount,
          category: "Food",
          date: new Date().toISOString(),
          type: "expenses",
        };

        cy.request({
          method: "POST",
          url: `${apiTransactions}/add`,
          body: transaction,
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(400);
          expect(response.body.message).to.contain(test.expectedMessage);
        });
      });
    });

    it("should validate transaction type must be valid", () => {
      const transaction = {
        description: "Test Transaction",
        amount: 150.75,
        category: "Food",
        date: new Date().toISOString(),
        type: "invalid_type",
      };

      cy.request({
        method: "POST",
        url: `${apiTransactions}/add`,
        body: transaction,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.contain("Invalid transaction type");
      });
    });

    it("should validate description length", () => {
      cy.request({
        method: "POST",
        url: `${apiTransactions}/add`,
        body: {
          description: "a",
          amount: 150.75,
          category: "Food",
          date: new Date().toISOString(),
          type: "expenses",
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.contain("Description must be between 1 and 20 characters");
      });

      // Test too long
      cy.request({
        method: "POST",
        url: `${apiTransactions}/add`,
        body: {
          description: "This description is way too long and should exceed the twenty character limit",
          amount: 150.75,
          category: "Food",
          date: new Date().toISOString(),
          type: "expenses",
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.contain("Description must be between 1 and 20 characters");
      });
    });
  });

  describe("PATCH /transactions/update", () => {
    let testTransactionId;

    before(() => {
      cy.loginTestUser();

      const testTransaction = {
        description: "Update Test",
        amount: 100,
        category: "Food",
        date: new Date().toISOString(),
        type: "expenses",
      };

      cy.request({
        method: "POST",
        url: `${apiTransactions}/add`,
        body: testTransaction,
      }).then((response) => {
        testTransactionId = response.body.data.transaction._id;
      });
    });

    it("should update an existing transaction successfully", () => {
      const updateData = {
        _id: testTransactionId,
        description: "Updated Transaction",
        amount: 200.5,
      };

      cy.request({
        method: "PATCH",
        url: `${apiTransactions}/update`,
        body: updateData,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data.transaction._id).to.eq(testTransactionId);
        expect(response.body.data.transaction.description).to.eq(updateData.description);
        expect(response.body.data.transaction.amount).to.eq(updateData.amount);
      });
    });

    it("should reject update with non-existent ID", () => {
      const updateData = {
        _id: "507f1f77bcf86cd799439011",
        description: "Updated Transaction",
        amount: 200.5,
      };
      cy.request({
        method: "PATCH",
        url: `${apiTransactions}/update`,
        body: updateData,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body.message).to.contain("not found");
      });
    });

    it("should validate update data format", () => {
      cy.request({
        method: "PATCH",
        url: `${apiTransactions}/update`,
        body: {
          _id: testTransactionId,
          amount: "invalid_amount",
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });

  describe("DELETE /transactions/delete/:id", () => {
    let deleteTestId;

    beforeEach(() => {
      const testTransaction = {
        description: "Delete Test",
        amount: 100,
        category: "Food",
        date: new Date().toISOString(),
        type: "expenses",
      };
      cy.request({
        method: "POST",
        url: `${apiTransactions}/add`,
        body: testTransaction,
      }).then((response) => {
        deleteTestId = response.body.data.transaction._id;
      });
    });

    it("should delete an existing transaction", () => {
      cy.request({
        method: "DELETE",
        url: `${apiTransactions}/delete/${deleteTestId}`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.contain("deleted successfully");
        expect(response.body.data.transactionId).to.eq(deleteTestId);
      });

      // Verify it's gone
      cy.request({
        method: "GET",
        url: `${apiTransactions}/monthly`,
        qs: {
          type: "expenses",
          year: new Date().getFullYear(),
          month: new Date().getMonth(),
        },
      }).then((response) => {
        const transactions = response.body.data.transactions;
        const deleted = transactions.find((t) => t._id === deleteTestId);
        expect(deleted === undefined);
      });
    });

    it("should handle non-existent transaction ID", () => {
      cy.request({
        method: "DELETE",
        url: `${apiTransactions}/delete/507f1f77bcf86cd799439011`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body.message).to.contain("not found");
      });
    });
  });

  describe("GET /transactions", () => {
    it("should get monthly transactions with valid parameters", () => {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();

      cy.request({
        method: "GET",
        url: `${apiTransactions}/monthly`,
        qs: {
          type: "expenses",
          year: currentYear,
          month: currentMonth,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data).to.have.property("transactions");
        expect(response.body.data).to.have.property("total");
        expect(response.body.data.transactions).to.be.an("array");
      });
    });

    it("should validate monthly transactions query parameters", () => {
      // Test missing parameters
      cy.request({
        method: "GET",
        url: `${apiTransactions}/monthly`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.contain("required");
      });

      // Test invalid month
      cy.request({
        method: "GET",
        url: `${apiTransactions}/monthly`,
        qs: { type: "expenses", year: 2023, month: 13 },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.contain("Invalid month");
      });
    });

    it("should get yearly data with valid year", () => {
      const currentYear = new Date().getFullYear();

      cy.request({
        method: "GET",
        url: `${apiTransactions}/yearly`,
        qs: { year: currentYear },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data).to.have.property("yearlyStats");
        expect(response.body.data).to.have.property("monthlyStats");
        expect(response.body.data.yearlyStats).to.have.property("totalIncomes");
        expect(response.body.data.yearlyStats).to.have.property("totalExpenses");
        expect(response.body.data.yearlyStats).to.have.property("totalBalance");
        expect(response.body.data.monthlyStats).to.be.an("array");
      });
    });

    it("should validate yearly data query parameters", () => {
      cy.request({
        method: "GET",
        url: `${apiTransactions}/yearly`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.contain("Year is required");
      });
    });
  });

  describe("Authentication Requirements", () => {
    it("should require authentication for all endpoints", () => {
      cy.clearCookies();

      // Define endpoints to test
      const endpoints = [
        { method: "GET", url: `${apiTransactions}/monthly?type=expenses&year=2023&month=1` },
        { method: "GET", url: `${apiTransactions}/yearly?year=2023` },
        {
          method: "POST",
          url: `${apiTransactions}/add`,
          body: { description: "Test", amount: 100, type: "expenses", category: "Food", date: new Date() },
        },
        {
          method: "PATCH",
          url: `${apiTransactions}/update`,
          body: { _id: "validFormat123456789012", description: "Updated" },
        },
        { method: "DELETE", url: `${apiTransactions}/delete/validFormat123456789012` },
      ];

      // Test each endpoint
      endpoints.forEach((endpoint) => {
        cy.request({
          method: endpoint.method,
          url: endpoint.url,
          body: endpoint.body || {},
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(401);
          expect(response.body).to.have.property("message");
        });
      });
    });
  });
});
