describe("Categories Management", () => {
  const categories = {
    length: 2,
    maxCategories: 5,
  };
  beforeEach(() => {
    cy.task("db:clear-db");
    cy.task("db:seed-user");

    cy.intercept("GET", "**/api/categories/get*").as("categories");
    cy.intercept("POST", "**/api/categories/add*").as("addCategory");
    cy.intercept("DELETE", "**/api/categories/delete/*").as("deleteCategory");

    cy.loginTestUser();

    cy.visit("/transactions/expenses");
    cy.wait("@categories");
  });

  it("displays all categories correctly", () => {
    cy.getDataCy("categories-max").should("have.text", `${categories.length} / ${categories.maxCategories}`);
    cy.getDataCy("category-item").should("have.length", categories.length);
  });
  it("adds a new category successfully", () => {
    cy.getDataCy("category-input").type("Entertainment");
    cy.getDataCy("submit-category").click();

    cy.wait("@addCategory").then((intercept) => {
      expect(intercept.response.statusCode).to.equal(201);
    });

    cy.contains("Category added successfully").should("be.visible");
    cy.getDataCy("category-item")
      .should("be.visible")
      .and("have.length", categories.length + 1);
    cy.getDataCy("categories-max")
      .should("be.visible")
      .and("have.text", `${categories.length + 1} / ${categories.maxCategories}`);
    cy.contains("Entertainment").should("be.visible");
  });

  it("deletes a category with confirmation", () => {
    cy.getDataCy("category-item")
      .last()
      .find("[data-cy='category-name']")
      .invoke("text")
      .then((categoryName) => {
        cy.getDataCy("delete-category-btn").last().click();
        cy.get(".swal2-confirm").click();
        cy.getDataCy("categories-max").should("have.text", `${categories.length - 1} / ${categories.maxCategories}`);
        cy.getDataCy("category-item").should("have.length", categories.length - 1);
        cy.contains(categoryName).should("not.exist");
      });
  });
  it("should close delete confirmation modal without deleting category", () => {
    cy.getDataCy("delete-category-btn").last().click();
    cy.get(".swal2-cancel").click();
    cy.getDataCy("category-item").should("have.length", categories.length);
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
