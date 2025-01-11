describe("Categories", () => {
  const transactionTypes = ["expenses"];
  // before(() => {
  // cy.intercept(
  //   {
  //     method: "GET",
  //     url: "**/api/categories/get",
  //   },
  //   (req) => {
  //     // Remove caching headers
  //     req.headers["if-none-match"] = "";
  //     req.headers["if-modified-since"] = "";
  //   }
  // ).as("getCategories");
  //   cy.intercept("GET", "**/api/categories/get", { fixture: "cate.json" }).as("getCategories");
  //   cy.loginUser();
  // });

  transactionTypes.forEach((tranType) => {
    describe(`${tranType} Categories`, () => {
      beforeEach(() => {
        cy.intercept(
          {
            method: "GET",
            url: "**/api/categories/get",
          },
          (req) => {
            // Remove caching headers
            req.headers["if-none-match"] = "";
            req.headers["if-modified-since"] = "";
          }
        ).as("getCategories");
        cy.intercept("POST", "**/api/categories/add").as("addCategory");

        cy.intercept("DELETE", "**/api/categories/delete/*").as("deleteCategory");
        cy.loginUser();
        cy.visit(`/transactions/${tranType}`);
      });
      it("create category", () => {
        cy.wait("@getCategories").then((response) => {
          const { categories, maxCategories } = response.response.body.data;
          if (categories.length < maxCategories) {
            cy.getDataCy("add-category-input").type("test category");
            cy.getDataCy("submit-category").click();

            cy.wait("@addCategory").then((response) => {
              expect(response.response.statusCode).to.equal(200);
              expect(response.response.body.data).to.have.property("name", "test category");
            });

            cy.getDataCy("category-item")
              .should("have.length", categories.length + 1)
              .should("contain", "test category");
          }
        });
      });
      it("should display form errors", () => {
        cy.getDataCy("add-category-input").type("test category");
        cy.getDataCy("submit-category").click();
        cy.getDataCy("category-error").should("be.visible");
      });
      // xit(`should display categories for ${tranType}`, () => {
      //   cy.wait("@getCategories").then((response) => {
      //     const { categories, maxCategories } = response.response.body.data;

      //     const expenseCategories = categories.filter((category) => category.type === tranType);
      //     cy.getDataCy("categories-title").contains(tranType, { matchCase: false });
      //     cy.getDataCy("categories-max").should("have.text", `${expenseCategories.length} / ${maxCategories}`);
      //     cy.getDataCy("category-item").should("have.length", expenseCategories.length);

      //     // Check each category name and delete button
      //     expenseCategories.forEach((category, index) => {
      //       cy.getDataCy("category-item")
      //         .eq(index)
      //         .within(() => {
      //           cy.getDataCy("category-name").should("have.text", category.name);
      //         });
      //       cy.getDataCy("delete-category-btn").should("exist");
      //     });
      //   });
      // });
      // xit("should show add category form when under max limit", () => {
      //   cy.wait("@getCategories").then((response) => {
      //     const { categories, maxCategories } = response.response.body.data;
      //     if (categories.length < maxCategories) {
      //       cy.getDataCy("add-category-form").should("exist");
      //       cy.getDataCy("add-category-input").should("exist");
      //       cy.getDataCy("add-category-btn").should("exist");
      //     }
      //   });
      // });
      // xit("create new category", () => {
      //   cy.wait("@getCategories").then((response) => {
      //     const { categories, maxCategories } = response.response.body.data;
      //     const expenseCategories = categories.filter((category) => category.type === tranType);

      //     if (expenseCategories.length < maxCategories) {
      //       const newCategoryName = `Test ${tranType} `;

      //       cy.getDataCy("add-category-input").type(newCategoryName);
      //       cy.getDataCy("add-category-btn").click();

      //       // Wait for the add request to complete
      //       cy.wait("@addCategory").then((interception) => {
      //         expect(interception.response.statusCode).to.eq(200);
      //       });

      //       // Verify success toast
      //       cy.contains("Category added successfully").should("be.visible");

      //       // Verify new category appears in list using data-cy
      //       cy.getDataCy("category-name").contains(newCategoryName).should("exist");

      //       // Verify category count updated
      //       cy.getDataCy("categories-max").should("contain", `${expenseCategories.length + 1} `);
      //     }
      //   });
      // });
      // xit("should delete category after confirmation", () => {
      //   cy.wait("@getCategories").then(() => {
      //     const newCategoryName = `Test ${tranType} `;

      //     cy.getDataCy("delete-category-btn").contains(newCategoryName).click();

      //     // Confirm in sweet alert
      //     // cy.get(".swal2-confirm").click();

      //     // Verify success toast
      //     // cy.contains("Category deleted successfully").should("be.visible");
      //   });
      // });

      // xit("should hide add category form when at max limit", () => {
      //   cy.wait("@getCategories").then((response) => {
      //     const { categories, maxCategories } = response.response.body.data;
      //     if (categories.length === maxCategories) {
      //       cy.getDataCy("add-category-form").should("not.exist");
      //       cy.getDataCy("add-category-input").should("not.exist");
      //       cy.getDataCy("add-category-btn").should("not.exist");
      //     }
      //   });
      // });
      // xit("should add new category", () => {
      //   cy.wait("@getCategories").then((response) => {
      //     const { categories, maxCategories } = response.response.body.data;
      //     if (categories.length < maxCategories) {
      //       const newCategoryName = "Test Category";

      //       cy.get('input[placeholder="Add new category ..."]').type(newCategoryName);
      //       cy.get('button[type="submit"]').click();

      //       // Verify success toast
      //       cy.contains("Category added successfully").should("be.visible");

      //       // Verify new category appears in list
      //       cy.get(".my-card-item").contains(newCategoryName).should("exist");
      //     }
      //   });
      // });
    });
  });
});

//

//       xit("should delete category after confirmation", () => {
//         cy.wait("@getCategories").then(() => {
//           // Click delete on first category
//           cy.get(".my-card-item").first().find("button").click();

//           // Confirm in sweet alert
//           cy.get(".swal2-confirm").click();

//           // Verify success toast
//           cy.contains("Category deleted successfully").should("be.visible");
//         });
//       });

//       xit("should cancel category deletion", () => {
//         cy.wait("@getCategories").then(() => {
//           const firstCategory = cy.get(".my-card-item").first();

//           // Store category name
//           firstCategory.invoke("text").then((text) => {
//             // Click delete
//             firstCategory.find("button").click();

//             // Cancel in sweet alert
//             cy.get(".swal2-cancel").click();

//             // Verify category still exists
//             cy.get(".my-card-item").first().should("have.text", text);
//           });
//         });
//       });
//     });
//   });
// });
