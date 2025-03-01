describe("Transaction Categories", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/api/categories/get*", {
      statusCode: 200,
      body: {
        data: {
          categories: [
            { _id: "cat1", name: "Home", isDefault: true },
            { _id: "cat2", name: "Shopping", isDefault: false },
            { _id: "cat3", name: "Car", isDefault: false },
            { _id: "cat4", name: "Food", isDefault: false },
          ],
          maxCategories: 10,
        },
      },
    }).as("getCategories");
    cy.loginUser();
    cy.visit("/transactions/expenses");
    cy.wait("@getCategories");
  });

  it("displays all categories correctly", () => {
    cy.wait("@getCategories").then((response) => {
      const { categories, maxCategories } = response.response.body.data;
      cy.getDataCy("categories-max").should("have.text", `${categories.length} / ${maxCategories}`);
      cy.getDataCy("category-item").should("have.length", categories.length);

      categories.forEach((category) => {
        cy.contains(category.name).should("be.visible");
      });
    });
  });

  it("adds a new category successfully", () => {
    cy.intercept("POST", "**/api/categories/add", {
      statusCode: 200,
      body: {
        data: {
          _id: "cat5",
          name: "Entertainment",
          isDefault: false,
        },
      },
    }).as("addCategory");
    cy.intercept("GET", "**/api/categories/get*", {
      statusCode: 200,
      body: {
        data: {
          categories: [
            { _id: "cat1", name: "Home", isDefault: true },
            { _id: "cat2", name: "Shopping", isDefault: false },
            { _id: "cat3", name: "Car", isDefault: false },
            { _id: "cat4", name: "Food", isDefault: false },
            { _id: "cat5", name: "Entertainment", isDefault: false },
          ],
          maxCategories: 10,
        },
      },
    }).as("getUpdatedCategories");

    cy.getDataCy("category-form").find("input").type("Entertainment");

    cy.getDataCy("submit-category").click();

    cy.wait("@addCategory");

    cy.contains("Category added successfully").should("be.visible");

    cy.wait("@getUpdatedCategories").then((response) => {
      const { categories, maxCategories } = response.response.body.data;
      cy.getDataCy("categories-max").should("have.text", `${categories.length} / ${maxCategories}`);
      cy.getDataCy("category-item").should("have.length", categories.length);
    });
  });

  it("deletes a category after confirmation", () => {
    cy.intercept("DELETE", "**/api/categories/delete/*", {
      statusCode: 200,
      body: {
        success: true,
        message: "Category deleted successfully",
      },
    }).as("deleteCategory");
    cy.intercept("GET", "**/api/categories/get*", {
      statusCode: 200,
      body: {
        data: {
          categories: [
            { _id: "cat1", name: "Home", isDefault: true },
            { _id: "cat3", name: "Car", isDefault: false },
            { _id: "cat4", name: "Food", isDefault: false },
          ],
          maxCategories: 10,
        },
      },
    }).as("getUpdatedCategories");

    cy.getDataCy("category-item").contains("Shopping").parent().find("[data-cy='delete-category-btn']").click();

    cy.get(".swal2-confirm").click();

    cy.wait("@deleteCategory");
    cy.contains("Category deleted successfully").should("be.visible");

    cy.wait("@getUpdatedCategories").then((response) => {
      const { categories, maxCategories } = response.response.body.data;
      cy.getDataCy("categories-max").should("have.text", `${categories.length} / ${maxCategories}`);
      cy.getDataCy("category-item").should("have.length", categories.length);
    });
  });
  // All above WORKSSSS
  xit("cannot delete default category", () => {
    // Verify default category (Home) does not have a delete button
    cy.getDataCy("category-item").contains("Home").parent().find("[data-cy='delete-category-btn']").should("not.exist");
  });

  xit("displays validation error for empty category name", () => {
    // Click add button without entering a name
    cy.getDataCy("submit-category").click();

    // Verify error message
    cy.getDataCy("category-error").should("be.visible");
    cy.getDataCy("category-error").should("contain", "Category name is required");
  });

  xit("displays error when maximum categories reached", () => {
    // Mock categories with maximum count reached
    cy.intercept("GET", "**/api/categories/get*", {
      statusCode: 200,
      body: {
        data: {
          categories: Array.from({ length: 10 }, (_, i) => ({
            _id: `cat${i + 1}`,
            name: `Category ${i + 1}`,
            isDefault: i === 0,
          })),
          maxCategories: 10,
        },
      },
    }).as("maxCategoriesReached");

    // Reload the page
    cy.visit("/transactions/expenses");
    cy.wait("@maxCategoriesReached");

    // Verify add category form is not displayed
    cy.getDataCy("add-category-form").should("not.exist");

    // Verify max count indicator
    cy.getDataCy("categories-max").should("have.text", "10 / 10");
  });

  xit("shows categories in transaction list", () => {
    // Verify transactions show the correct categories
    cy.getDataCy("transactions-row").eq(0).find(".badge").should("contain", "Food");
    cy.getDataCy("transactions-row").eq(1).find(".badge").should("contain", "Car");
  });

  xit("handles API error when adding category", () => {
    // Mock API error
    cy.intercept("POST", "**/api/categories/add", {
      statusCode: 400,
      body: {
        success: false,
        message: "Category already exists",
      },
    }).as("categoryError");

    // Try to add a category
    cy.getDataCy("add-category-input").type("Duplicate");
    cy.getDataCy("submit-category").click();

    // Wait for the API call
    cy.wait("@categoryError");

    // Verify error message
    cy.contains("Category already exists").should("be.visible");
  });
});
