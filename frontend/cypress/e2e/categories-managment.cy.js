describe("Transaction Categories", () => {
  beforeEach(() => {
    cy.task("db:clear");
    cy.task("db:seedUser");

    cy.intercept("GET", "**/api/categories/get*").as("categories");
    cy.intercept("POST", "**/api/categories/add*").as("addCategory");
    cy.intercept("DELETE", "**/api/categories/delete/*").as("deleteCategory");

    cy.loginTestUser();
    cy.visit("/transactions/expenses");
    cy.wait("@categories");
  });

  it("displays all categories correctly", () => {
    cy.get("@categories").then((response) => {
      const { categories, maxCategories } = response.response.body.data;
      cy.getDataCy("categories-max").should("have.text", `${categories.length} / ${maxCategories}`);
      cy.getDataCy("category-item").should("have.length", categories.length);

      categories.forEach((category) => {
        cy.contains(category.name).should("be.visible");
      });
    });
  });
  it("adds a new category successfully", () => {
    cy.getDataCy("categories-max")
      .invoke("text")
      .then((text) => {
        const [current, max] = text.split(" / ").map((num) => parseInt(num.trim(), 10));
        cy.getDataCy("category-item").should("have.length", current);

        cy.getDataCy("category-input").type("Entertainment");
        cy.getDataCy("submit-category").click();

        cy.wait("@addCategory").then((intercept) => {
          expect(intercept.response.statusCode).to.equal(201);
        });
        cy.contains("Category added successfully").should("be.visible");
        cy.getDataCy("category-item").should("have.length", current + 1);
        cy.getDataCy("categories-max").should("have.text", `${current + 1} / ${max}`);
        cy.contains("Entertainment").should("be.visible");
      });
  });

  it("deletes a category with confirmation", () => {
    cy.getDataCy("categories-max")
      .invoke("text")
      .then((text) => {
        const [current, max] = text.split(" / ").map((num) => parseInt(num.trim(), 10));
        cy.getDataCy("category-item")
          .last()
          .find("[data-cy='category-name']")
          .invoke("text")
          .then((categoryName) => {
            cy.getDataCy("delete-category-btn").last().click();

            cy.get(".swal2-confirm").click();
            cy.wait("@deleteCategory").then((intercept) => {
              expect(intercept.response.statusCode).to.equal(200);
            });
            cy.contains("Category deleted successfully").should("be.visible");

            cy.getDataCy("category-item").should("have.length", current - 1);
            cy.getDataCy("categories-max").should("have.text", `${current - 1} / ${max}`);
            cy.contains(categoryName).should("not.exist");
          });
      });
  });
  it("should close delete confirmation modal without deleting category", () => {
    cy.getDataCy("categories-max")
      .invoke("text")
      .then((text) => {
        const [initialCount, max] = text.split(" / ").map((num) => parseInt(num.trim(), 10));
        cy.getDataCy("category-item")
          .last()
          .find("[data-cy='category-name']")
          .invoke("text")
          .then((categoryName) => {
            cy.getDataCy("delete-category-btn").last().click();
            cy.get(".swal2-cancel").click();
            cy.getDataCy("categories-max").should("have.text", `${initialCount} / ${max}`);
            cy.getDataCy("category-item").should("have.length", initialCount);
            cy.contains(categoryName).should("exist");
          });
      });
  });

  it("displays validation error for empty category name", () => {
    // Test empty name validation
    cy.getDataCy("submit-category").click();
    cy.getDataCy("error-message").should("be.visible").and("contain", "Category name is required");

    // Test minimum length validation
    cy.getDataCy("category-input").type("a");
    cy.getDataCy("submit-category").click();
    cy.getDataCy("error-message").should("be.visible").and("contain", "Category name must be at least 2 characters");

    // Test maximum length validation
    cy.getDataCy("category-input").find("input").clear();
    cy.getDataCy("category-input").type("This is a very long category name");
    cy.getDataCy("submit-category").click();
    cy.getDataCy("error-message").should("be.visible").and("contain", "Category name must be at most 20 characters");

    // Verify you can add a valid category after fixing errors
    cy.getDataCy("category-input").find("input").clear();
    cy.getDataCy("category-input").type("Valid Name");
    cy.getDataCy("submit-category").click();
    cy.contains("Category added successfully").should("be.visible");
  });

  it("should test Max categories - hide add category form", () => {
    cy.intercept("GET", "**/api/categories/get*", {
      statusCode: 200,
      body: {
        data: {
          categories: Array.from({ length: 5 }, (_, i) => ({
            _id: `cat${i + 1}`,
            name: `Category ${i + 1}`,
          })),
          maxCategories: 5,
        },
      },
    }).as("maxCategoriesReached");

    cy.visit("/transactions/expenses");
    cy.wait("@maxCategoriesReached");

    cy.getDataCy("category-form").should("not.exist");
    cy.getDataCy("categories-max").should("have.text", "5 / 5");
    cy.getDataCy("category-item").should("have.length", 5);
  });
});
