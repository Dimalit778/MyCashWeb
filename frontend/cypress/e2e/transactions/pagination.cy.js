describe("Transaction Pagination", () => {
  beforeEach(() => {
    const transactions = Array.from({ length: 25 }, (_, i) => ({
      _id: `id-${i + 1}`,
      description: `Item ${i + 1}`,
      amount: (i + 1) * 100,
      category: i % 3 === 0 ? "Home" : i % 3 === 1 ? "Shopping" : "Car",
      date: new Date(`2025-03-${(i % 28) + 1}`).toISOString(),
    }));

    cy.intercept("GET", "**/api/transactions/monthly*", {
      statusCode: 200,
      body: {
        data: {
          transactions: transactions,
          total: transactions.reduce((sum, t) => sum + t.amount, 0),
        },
      },
    }).as("transactionData");

    cy.loginUser();
    cy.visit("/transactions/expenses");
  });

  it("verifies correct number of pages for transaction data", () => {
    cy.wait("@transactionData").then(({ response }) => {
      const transactions = response.body.data.transactions;
      const totalItems = transactions.length;
      const itemsPerPage = 10;
      const expectedPages = Math.ceil(totalItems / itemsPerPage);

      cy.getDataCy("transactions-body").find("tr").should("have.length", "10");

      cy.get(".pagination .page-item").then(($pageItems) => {
        const actualPageButtons = $pageItems.length - 2;

        if (expectedPages > 1) {
          expect(actualPageButtons).to.be.at.least(expectedPages);
          const expectedLastPageItems = totalItems % itemsPerPage || itemsPerPage;

          // Navigate to last page
          cy.get(".pagination .page-item").contains(`${expectedPages}`).click();

          // Verify correct number of items on last page
          cy.getDataCy("transactions-body").find("tr").should("have.length", expectedLastPageItems);
          cy.log(`Last page has ${expectedLastPageItems} items as expected`);
        } else {
          cy.log("Only one page of results, pagination may not be displayed");
        }
      });
    });
  });

  it("verifies next/prev button states on different pages", () => {
    const totalItems = 25;
    const itemsPerPage = 10;
    const expectedPages = Math.ceil(totalItems / itemsPerPage);

    cy.get(".pagination .page-item").first().should("have.class", "disabled");

    cy.get(".pagination .page-item").last().should("not.have.class", "disabled");

    cy.get(".pagination .page-item").last().click();

    // On page 2, both prev and next should be enabled
    cy.get(".pagination .active").should("contain", "2");
    cy.get(".pagination .page-item").first().should("not.have.class", "disabled");
    cy.get(".pagination .page-item").last().should("not.have.class", "disabled");

    // Go to last page
    cy.get(".pagination .page-item").contains(`${expectedPages}`).click();

    // On last page, next button should be disabled
    cy.get(".pagination .active").should("contain", `${expectedPages}`);
    cy.get(".pagination .page-item").last().should("have.class", "disabled");

    // Prev button should be enabled
    cy.get(".pagination .page-item").first().should("not.have.class", "disabled");

    // Go back to first page using prev button
    cy.get(".pagination .page-item").first().click();
    cy.get(".pagination .page-item").first().click();

    cy.get(".pagination .active").should("contain", "1");
  });

  it("navigates through all pages using next button", () => {
    cy.get(".pagination .active").should("contain", "1");

    const navigateNext = () => {
      cy.get(".pagination .page-item")
        .last()
        .then(($next) => {
          if (!$next.hasClass("disabled")) {
            cy.get(".pagination .active")
              .invoke("text")
              .then((pageNum) => {
                cy.log(`Currently on page ${pageNum}, clicking next`);
              });

            cy.getDataCy("transactions-body")
              .find("tr")
              .first()
              .invoke("text")
              .then((text) => {
                const firstItemText = text.trim();

                cy.get(".pagination .page-item").last().click();

                cy.getDataCy("transactions-body").find("tr").first().invoke("text").should("not.equal", firstItemText);
                navigateNext();
              });
          } else {
            cy.get(".pagination .active")
              .invoke("text")
              .then((pageNum) => {
                cy.log(`Reached last page: ${pageNum}`);
              });
          }
        });
    };

    navigateNext();
  });
});
