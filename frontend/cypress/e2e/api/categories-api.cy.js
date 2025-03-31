const apiCategories = `${Cypress.env("API_URL")}/api/categories`;

describe("Categories API", () => {
  beforeEach(() => {
    cy.task("db:clear-db");
    cy.task("db:seed-user");
    cy.loginTestUser();
  });
  describe("GET /categories", () => {
    it("should GET Expense categories successfully", () => {
      cy.request({
        method: "GET",
        url: `${apiCategories}/get`,
        qs: { type: "expenses" },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data).to.have.property("categories");
        expect(response.body.data).to.have.property("maxCategories");
        const { categories, maxCategories } = response.body.data;
        expect(categories).to.be.an("array");
        expect(maxCategories).to.be.a("number");
        expect(categories.length).to.be.at.least(1);

        expect(categories.map((cat) => cat.name)).to.include.members(["Home", "Other"]);
        expect(categories.every((cat) => cat.type === "expenses")).to.equal(true);
      });
    });

    it("should GET Income categories successfully", () => {
      cy.request({
        method: "GET",
        url: `${apiCategories}/get`,
        qs: { type: "incomes" },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data).to.have.property("categories");
        expect(response.body.data).to.have.property("maxCategories");

        const { categories, maxCategories } = response.body.data;

        expect(categories).to.be.an("array");
        expect(maxCategories).to.be.a("number");
        expect(categories.length).to.be.at.least(1);

        expect(categories.map((cat) => cat.name)).to.include.members(["Job", "Other"]);
        expect(categories.every((cat) => cat.type === "incomes")).to.equal(true);
      });
    });

    it("handle invalid category type", () => {
      cy.request({
        method: "GET",
        url: `${apiCategories}/get`,
        qs: { type: "invalid" },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.contain("Invalid category type");
      });
    });

    it("handle missing type parameter", () => {
      cy.request({
        method: "GET",
        url: `${apiCategories}/get`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.contain("Invalid category type");
      });
    });
  });
  describe("POST /categories/add", () => {
    it("Create a new category", () => {
      cy.request({
        method: "POST",
        url: `${apiCategories}/add`,
        body: {
          categoryName: "Test Category",
          type: "expenses",
        },
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.data).to.have.property("category");
        expect(response.body.data.category.name).to.eq("Test Category");
        expect(response.body.data.category.type).to.eq("expenses");
        expect(response.body.message).to.contain("added successfully");
      });
    });

    it("handle Error category name length validation", () => {
      cy.request({
        method: "POST",
        url: `${apiCategories}/add`,
        body: {
          categoryName: "a",
          type: "expenses",
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.contain("Name must be between 2 and 20 characters");
      });
      cy.request({
        method: "POST",
        url: `${apiCategories}/add`,
        body: {
          categoryName: "This category name is way too long for the validation rules",
          type: "expenses",
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.contain("Name must be between 2 and 20 characters");
      });
    });

    it("handle Error duplicate category", () => {
      const categoryName = "Duplicate Test";
      cy.request({
        method: "POST",
        url: `${apiCategories}/add`,
        body: {
          categoryName,
          type: "expenses",
        },
      });
      cy.request({
        method: "POST",
        url: `${apiCategories}/add`,
        body: {
          categoryName,
          type: "expenses",
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.contain("already exists");
      });
    });

    it("should enforce category limit", () => {
      cy.request({
        method: "GET",
        url: `${apiCategories}/get`,
        qs: { type: "expenses" },
      }).then((response) => {
        const maxCategories = response.body.data.maxCategories;
        const currentCount = response.body.data.categories.length;
        console.log("currentCount", currentCount);
        console.log("maxCategories", maxCategories);
        if (currentCount >= maxCategories) {
          cy.request({
            method: "POST",
            url: `${apiCategories}/add`,
            body: {
              categoryName: `New Category}`,
              type: "expenses",
            },
            failOnStatusCode: false,
          }).then((limitResponse) => {
            expect(limitResponse.status).to.eq(400);
            expect(limitResponse.body.message).to.contain(`Cannot add more than ${maxCategories} categories`);
          });
        } else {
          // Add categories until we hit the limit
          const categoriesToAdd = maxCategories - currentCount;

          for (let i = 0; i < categoriesToAdd; i++) {
            cy.request({
              method: "POST",
              url: `${apiCategories}/add`,
              body: {
                categoryName: `Fill Category ${i}`,
                type: "expenses",
              },
            });
          }

          // Try one more to test the limit
          cy.request({
            method: "POST",
            url: `${apiCategories}/add`,
            body: {
              categoryName: "Over Limit",
              type: "expenses",
            },
            failOnStatusCode: false,
          }).then((limitResponse) => {
            expect(limitResponse.status).to.eq(400);
            expect(limitResponse.body.message).to.contain(`Cannot add more than ${maxCategories} categories`);
          });
        }
      });
    });
  });

  describe("DELETE /categories/delete/:id", () => {
    let categoryId;

    beforeEach(() => {
      cy.request({
        method: "POST",
        url: `${apiCategories}/add`,
        body: {
          categoryName: "Delete Test",
          type: "expenses",
        },
      }).then((response) => {
        categoryId = response.body.data.category._id;
      });
    });

    it("handle delete an existing category", () => {
      cy.request({
        method: "DELETE",
        url: `${apiCategories}/delete/${categoryId}`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.contain("deleted successfully");

        // Verify category was deleted
        cy.request({
          method: "GET",
          url: `${apiCategories}/get`,
          qs: { type: "expenses" },
        }).then((getResponse) => {
          const categories = getResponse.body.data.categories;
          const deletedCategory = categories.find((c) => c._id === categoryId);
          expect(deletedCategory).to.equal(undefined);
        });
      });
    });

    it("handle error category id not found", () => {
      cy.request({
        method: "DELETE",
        url: `${apiCategories}/delete/507f1f77bcf86cd799439011`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body.message).to.contain("not found");
      });
    });
  });

  describe("Authentication Requirements for Categories Routes", () => {
    it("should require authentication for all endpoints", () => {
      cy.clearCookies();

      // Test one endpoint from each HTTP method
      const endpoints = [
        { method: "GET", url: `${apiCategories}/get?type=expenses` },
        {
          method: "POST",
          url: `${apiCategories}/add`,
          body: { categoryName: "Test", type: "expenses" },
        },

        { method: "DELETE", url: `${apiCategories}/delete/someValid123456789012` },
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
