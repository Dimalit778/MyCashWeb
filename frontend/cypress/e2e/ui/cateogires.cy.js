// cypress/e2e/transactions/components/categories.cy.js
describe("Categories Component", () => {
  const transactionTypes = ["expenses", "incomes"];

  transactionTypes.forEach((type) => {
    describe(`${type} Categories`, () => {
      beforeEach(() => {
        cy.setupApiMonitors();
        cy.loginUser();
        cy.visit(`/transactions/${type}`);
        cy.wait("@monthlyData");
      });

      it("should display categories in one column when 5 or fewer items", () => {
        // Wait for categories to load
        cy.wait("@getCategories").then((response) => {
          const categories = response.response.body.data.categories;
          if (categories.length <= 5) {
            // Check for single column layout
            cy.get(".my-card-body > div").first().should("have.css", "grid-template-columns", "1fr");
          }
        });
      });

      it("should display categories in two columns when more than 5 items", () => {
        // Wait for categories to load
        cy.wait("@getCategories").then((response) => {
          const categories = response.response.body.data.categories;
          if (categories.length > 5) {
            // Check for two column layout
            cy.get(".my-card-body > div").first().should("have.css", "grid-template-columns", "repeat(2, 1fr)");
          }
        });
      });

      it("should show add category form when under max limit", () => {
        cy.wait("@getCategories").then((response) => {
          const { categories, maxCategories } = response.response.body.data;
          if (categories.length < maxCategories) {
            cy.get('input[placeholder="Add new category ..."]').should("exist");
            cy.get('button[type="submit"]').should("exist");
          }
        });
      });

      it("should hide add category form when at max limit", () => {
        cy.wait("@getCategories").then((response) => {
          const { categories, maxCategories } = response.response.body.data;
          if (categories.length >= maxCategories) {
            cy.get('input[placeholder="Add new category ..."]').should("not.exist");
          }
        });
      });

      it("should add new category", () => {
        cy.wait("@getCategories").then((response) => {
          const { categories, maxCategories } = response.response.body.data;
          if (categories.length < maxCategories) {
            const newCategoryName = "Test Category";

            cy.get('input[placeholder="Add new category ..."]').type(newCategoryName);
            cy.get('button[type="submit"]').click();

            // Verify success toast
            cy.contains("Category added successfully").should("be.visible");

            // Verify new category appears in list
            cy.get(".my-card-item").contains(newCategoryName).should("exist");
          }
        });
      });

      it("should delete category after confirmation", () => {
        cy.wait("@getCategories").then(() => {
          // Click delete on first category
          cy.get(".my-card-item").first().find("button").click();

          // Confirm in sweet alert
          cy.get(".swal2-confirm").click();

          // Verify success toast
          cy.contains("Category deleted successfully").should("be.visible");
        });
      });

      it("should cancel category deletion", () => {
        cy.wait("@getCategories").then(() => {
          const firstCategory = cy.get(".my-card-item").first();

          // Store category name
          firstCategory.invoke("text").then((text) => {
            // Click delete
            firstCategory.find("button").click();

            // Cancel in sweet alert
            cy.get(".swal2-cancel").click();

            // Verify category still exists
            cy.get(".my-card-item").first().should("have.text", text);
          });
        });
      });
    });
  });
});
