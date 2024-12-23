describe("MyCash App", () => {
  // Test responsive layout
  describe("Layout Tests", () => {
    it("should display correct navigation based on screen size", () => {
      // Test desktop layout
      cy.viewport(1200, 800);
      cy.visit("/");
      cy.getDataCy("side-nav").should("be.visible");
      cy.getDataCy("bottom-nav").should("not.be.visible");

      // Test mobile layout
      cy.viewport(375, 667);
      cy.getDataCy("side-nav").should("not.be.visible");
      cy.getDataCy("bottom-nav").should("be.visible");
    });
  });

  // Test Home page
  describe("Home Page", () => {
    beforeEach(() => {
      cy.visit("/");
      // Intercept yearly data request
      cy.intercept("GET", "/api/transactions/yearly/*", {
        fixture: "yearlyStats.json",
      }).as("yearlyData");
    });

    it("should show skeleton loading on initial load", () => {
      cy.getDataCy("main-skeleton").should("be.visible");
      cy.wait("@yearlyData");
      cy.getDataCy("main-skeleton").should("not.exist");
    });

    it("should display yearly statistics and chart", () => {
      cy.wait("@yearlyData");
      cy.getDataCy("year-stats").within(() => {
        cy.getDataCy("total-expenses").should("contain", "$134,040.00");
        cy.getDataCy("total-incomes").should("contain", "$104,500.00");
        cy.getDataCy("balance").should("contain", "-$29,540.00");
      });
      cy.getDataCy("year-chart").should("be.visible");
    });

    it("should update data when year changes", () => {
      cy.wait("@yearlyData");
      cy.getDataCy("year-selector").click();
      cy.getDataCy("year-2023").click();
      cy.wait("@yearlyData");
      // Verify updated data
    });
  });

  // Test Transactions pages (Income/Expense)
  describe("Transaction Pages", () => {
    beforeEach(() => {
      // Intercept API calls
      cy.intercept("GET", "/api/transactions/monthly/*", {
        fixture: "monthlyStats.json",
      }).as("monthlyData");
      cy.intercept("GET", "/api/categories", {
        fixture: "categories.json",
      }).as("categoriesData");
    });

    it("should load and display expense data", () => {
      cy.visit("/expenses");
      cy.getDataCy("transaction-skeleton").should("be.visible");
      cy.wait(["@monthlyData", "@categoriesData"]);
      cy.getDataCy("transaction-skeleton").should("not.exist");
      cy.getDataCy("progress-bar").should("be.visible");
      cy.getDataCy("transactions-table").should("be.visible");
    });

    it("should update data when month changes", () => {
      cy.visit("/expenses");
      cy.wait(["@monthlyData", "@categoriesData"]);
      cy.getDataCy("month-selector").click();
      cy.getDataCy("month-2").click();
      cy.wait("@monthlyData");
      cy.getDataCy("loading-overlay").should("not.exist");
      // Verify updated data
    });
  });

  // Test Contact page
  describe("Contact Page", () => {
    beforeEach(() => {
      cy.visit("/contact");
    });

    it("should submit contact form", () => {
      cy.getDataCy("contact-name").type("John Doe");
      cy.getDataCy("contact-email").type("john@example.com");
      cy.getDataCy("contact-message").type("Test message");
      cy.getDataCy("contact-submit").click();
      // Verify submission success/failure
    });
  });

  // Test Settings page
  // describe('Settings Page', () => {
  //   beforeEach(() => {
  //     cy.visit('/settings')
  //   })

  //   it('should handle profile image upload', () => {
  //     cy.getDataCy('image-upload').attachFile('test-image.jpg')
  //     // Verify upload success
  //   })

  //   it('should update profile information', () => {
  //     cy.getDataCy('edit-profile-form').within(() => {
  //       cy.getDataCy('edit-name').clear().type('New Name')
  //       cy.getDataCy('edit-email').clear().type('new@email.com')
  //       cy.getDataCy('save-profile').click()
  //     })
  //     // Verify update success
  //   })
  // })
});
