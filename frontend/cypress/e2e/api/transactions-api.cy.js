const apiTransactions = `${Cypress.env("API_URL")}/api/transactions`;

describe("Transactions API", () => {
  beforeEach(() => {
    cy.task("db:clear-db");
    cy.task("db:seed-user");
    cy.task("db:seed-transactions", { count: 10, type: "expenses", monthly: true });
    cy.loginTestUser();
  });

  describe.only("GET /transactions/monthly", () => {
    it("should get monthly transactions with valid parameters", () => {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;

      cy.request({
        method: "GET",
        url: `${apiTransactions}/monthly`,
        qs: {
          type: "expenses",
          year: currentYear,
          month: currentMonth,
        },
      }).then((response) => {
        console.log("response", response);
        expect(response.status).to.eq(200);
        expect(response.body.data).to.have.property("transactions");
        expect(response.body.data).to.have.property("total");
        // Array length might vary based on seeded data
        expect(response.body.data.transactions).to.be.an("array");
      });
    });

    it("should handle missing query parameters", () => {
      cy.request({
        method: "GET",
        url: `${apiTransactions}/monthly`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.contain("required");
      });
    });

    it("should validate year and month parameters", () => {
      cy.request({
        method: "GET",
        url: `${apiTransactions}/monthly`,
        qs: { type: "expenses", year: "invalid", month: 13 },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property("message");
      });
    });
  });

  describe("GET /transactions/yearly", () => {
    it("should get yearly transactions with valid year", () => {
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

    it("should handle missing year parameter", () => {
      cy.request({
        method: "GET",
        url: `${apiTransactions}/yearly`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.contain("year");
      });
    });
  });

  describe("POST /transactions/add", () => {
    it("should add a new transaction", () => {
      const newTransaction = {
        description: "Test Transaction",
        amount: 150.75,
        category: "Food",
        date: new Date().toISOString(),
        type: "expenses",
      };

      cy.request({
        method: "POST",
        url: `${apiTransactions}/add`,
        body: newTransaction,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.data).to.have.property("transaction");
        expect(response.body.data.transaction).to.have.property("_id");
        expect(response.body.data.transaction.description).to.eq(newTransaction.description);
        expect(response.body.data.transaction.amount).to.eq(newTransaction.amount);
      });
    });

    it("should validate required fields", () => {
      const invalidTransaction = {
        // Missing required fields
        amount: 150.75,
      };

      cy.request({
        method: "POST",
        url: `${apiTransactions}/add`,
        body: invalidTransaction,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property("message");
      });
    });

    it("should validate field types", () => {
      const invalidTransaction = {
        description: "Test",
        amount: "not-a-number", // Invalid amount
        category: "Food",
        date: new Date().toISOString(),
        type: "expenses",
      };

      cy.request({
        method: "POST",
        url: `${apiTransactions}/add`,
        body: invalidTransaction,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property("message");
      });
    });
  });

  describe("PATCH /transactions/update", () => {
    it("should update an existing transaction", () => {
      // First, get an existing transaction ID
      cy.request({
        method: "GET",
        url: `${apiTransactions}/monthly`,
        qs: {
          type: "expenses",
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);

        // If there are transactions, update the first one
        if (response.body.data.transactions.length > 0) {
          const transactionId = response.body.data.transactions[0]._id;
          const updateData = {
            _id: transactionId,
            description: "Updated Transaction",
            amount: 200.5,
          };

          cy.request({
            method: "PATCH",
            url: `${apiTransactions}/update`,
            body: updateData,
          }).then((updateResponse) => {
            expect(updateResponse.status).to.eq(200);
            expect(updateResponse.body.data).to.have.property("transaction");
            expect(updateResponse.body.data.transaction._id).to.eq(transactionId);
            expect(updateResponse.body.data.transaction.description).to.eq(updateData.description);
            expect(updateResponse.body.data.transaction.amount).to.eq(updateData.amount);
          });
        }
      });
    });

    it("should handle non-existent transaction ID", () => {
      const updateData = {
        _id: "nonexistentid123456789012",
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
        expect(response.body).to.have.property("message");
      });
    });

    it("should validate update data", () => {
      const invalidUpdateData = {
        _id: "validid123456789012", // Assume this is valid format but doesn't exist
        amount: "invalid-amount",
      };

      cy.request({
        method: "PATCH",
        url: `${apiTransactions}/update`,
        body: invalidUpdateData,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 404]); // Either bad request or not found
        expect(response.body).to.have.property("message");
      });
    });
  });

  describe("DELETE /transactions/delete/:id", () => {
    it("should delete an existing transaction", () => {
      // First, get an existing transaction ID
      cy.request({
        method: "GET",
        url: `${apiTransactions}/monthly`,
        qs: {
          type: "expenses",
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);

        // If there are transactions, delete the first one
        if (response.body.data.transactions.length > 0) {
          const transactionId = response.body.data.transactions[0]._id;

          cy.request({
            method: "DELETE",
            url: `${apiTransactions}/delete/${transactionId}`,
          }).then((deleteResponse) => {
            expect(deleteResponse.status).to.eq(200);
            expect(deleteResponse.body).to.have.property("message");
            expect(deleteResponse.body.message).to.include("deleted");
          });
        }
      });
    });

    it("should handle non-existent transaction ID", () => {
      cy.request({
        method: "DELETE",
        url: `${apiTransactions}/delete/nonexistentid123456789012`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to.have.property("message");
      });
    });
  });

  describe("Authentication Requirements", () => {
    it("should require authentication for all endpoints", () => {
      cy.clearCookies();

      // Test one endpoint from each HTTP method
      const endpoints = [
        { method: "GET", url: `${apiTransactions}/monthly?type=expenses&year=2023&month=1` },
        { method: "GET", url: `${apiTransactions}/yearly?year=2023` },
        {
          method: "POST",
          url: `${apiTransactions}/add`,
          body: { description: "Test", amount: 100, type: "expenses", category: "Food", date: new Date() },
        },
        { method: "PATCH", url: `${apiTransactions}/update`, body: { _id: "testid123", description: "Updated" } },
        { method: "DELETE", url: `${apiTransactions}/delete/testid123` },
      ];

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
