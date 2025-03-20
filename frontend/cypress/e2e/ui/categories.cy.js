describe("Transaction Categories", () => {
  beforeEach(() => {
    cy.task("db:clear");
    cy.task("db:seed", { type: "expenses" });

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
    cy.getDataCy("category-input").type("Entertainment");

    cy.getDataCy("submit-category").click();

    cy.wait("@addCategory");

    cy.contains("Category added successfully").should("be.visible");

    cy.wait("@categories").then((response) => {
      const { categories, maxCategories } = response.response.body.data;
      cy.getDataCy("categories-max").should("have.text", `${categories.length} / ${maxCategories}`);
      cy.getDataCy("category-item").should("have.length", categories.length);
    });
  });

  it("deletes a category with confirmation", () => {
    cy.getDataCy("category-item").last().find("button").click();

    cy.get(".swal2-confirm").click();

    cy.wait("@deleteCategory");
    cy.contains("Category deleted successfully").should("be.visible");

    cy.wait("@categories").then((response) => {
      const { categories, maxCategories } = response.response.body.data;
      cy.getDataCy("categories-max").should("have.text", `${categories.length} / ${maxCategories}`);
      cy.getDataCy("category-item").should("have.length", categories.length);
    });
  });
  it("close delete confirmation modal", () => {
    cy.get("@categories").then((response) => {
      console.log("response", response);
      const { categories, maxCategories } = response.response.body.data;
      cy.getDataCy("category-item").last().find("button").click();
      cy.get(".swal2-cancel").click();
      cy.getDataCy("categories-max").should("have.text", `${categories.length} / ${maxCategories}`);
      cy.getDataCy("category-item").should("have.length", categories.length);
    });
  });

  it("displays validation error for empty category name", () => {
    cy.getDataCy("submit-category").click();
    cy.getDataCy("error-message").should("be.visible");
    cy.getDataCy("error-message").should("contain", "Category name is required");
    // Min length error
    cy.getDataCy("category-input").type("a");
    cy.getDataCy("submit-category").click();
    cy.getDataCy("error-message").should("be.visible");
    cy.getDataCy("error-message").should("contain", "Category name must be at least 2 characters");
    // Max length error
    cy.getDataCy("category-input").find("input").clear();
    cy.getDataCy("category-input").type("This is a very long category name");
    cy.getDataCy("submit-category").click();
    cy.getDataCy("error-message").should("be.visible");
    cy.getDataCy("error-message").should("contain", "Category name must be at most 20 characters");
  });

  it("should test Max categories - hide add category form", () => {
    cy.intercept("GET", "**/api/categories/get*", {
      statusCode: 200,
      body: {
        data: {
          categories: Array.from({ length: 5 }, (_, i) => ({
            _id: `cat${i + 1}`,
            name: `Category ${i + 1}`,
            isDefault: i === 0,
          })),
          maxCategories: 5,
        },
      },
    }).as("maxCategoriesReached");

    cy.visit("/transactions/expenses");
    cy.wait("@maxCategoriesReached");

    cy.getDataCy("category-form").should("not.exist");
    cy.getDataCy("categories-max").should("have.text", "5 / 5");
  });
});
