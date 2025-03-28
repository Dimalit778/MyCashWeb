import { format } from "date-fns";

describe("Transaction Table", () => {
  before(() => {
    cy.task("db:clear-db");
    cy.task("db:seed-user");
  });
  beforeEach(() => {
    cy.task("db:seed-transactions", { count: 20, type: "expenses", monthly: true });
    cy.intercept("GET", "**/api/transactions/monthly*").as("monthlyData");
    cy.intercept("GET", "**/api/categories/get*").as("categories");

    cy.loginTestUser();
    cy.visit("/transactions/expenses");
    cy.wait("@monthlyData");
  });

  it("verifies correct number of pages for transaction data", () => {
    cy.get("@monthlyData").then(({ response }) => {
      const transactions = response.body.data.transactions;
      const totalItems = transactions.length;
      const itemsPerPage = 10;
      const expectedPages = Math.ceil(totalItems / itemsPerPage);

      cy.getDataCy("transactions-body").scrollIntoView();
      cy.getDataCy("transactions-body").find("tr").should("have.length", "10");

      cy.get(".pagination .page-item").then(($pageItems) => {
        const actualPageButtons = $pageItems.length - 2;

        if (expectedPages > 1) {
          expect(actualPageButtons).to.be.at.least(expectedPages);
          const expectedLastPageItems = totalItems % itemsPerPage || itemsPerPage;
          cy.get(".pagination .page-item").contains(`${expectedPages}`).click();
          cy.getDataCy("transactions-body").find("tr").should("have.length", expectedLastPageItems);
          cy.log(`Last page has ${expectedLastPageItems} items as expected`);
        } else {
          cy.log("Only one page of results, pagination may not be displayed");
        }
      });
    });
  });

  it("should recursively navigate to the last page", () => {
    function visitNextPageIfPossible() {
      cy.get(".pagination .page-item")
        .last()
        .then(($lastItem) => {
          if ($lastItem.hasClass("disabled")) {
            cy.log("Reached the last page");
            return;
          }
          cy.get(".pagination .page-item.active")
            .invoke("text")
            .then((currentPage) => {
              const nextPageNum = parseInt(currentPage) + 1;
              cy.get(".pagination .page-item").contains(nextPageNum.toString()).click();
              cy.get(".pagination .page-item.active").should("contain", nextPageNum.toString());
              visitNextPageIfPossible();
            });
        });
    }
    visitNextPageIfPossible();
    cy.get(".pagination .page-item").last().should("have.class", "disabled");
  });
  it("should sort by date in ascending and descending order", () => {
    cy.get("@monthlyData").then(({ response }) => {
      const transactions = response.body.data.transactions;
      expect(transactions).to.be.an("array");

      cy.contains("th", "Date").click();
      const sortedByDateAsc = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
      cy.getDataCy("transactions-row").each((row, index) => {
        if (index < 10) {
          const expectedDateString = format(new Date(sortedByDateAsc[index].date), "MMM dd, yyyy");
          cy.wrap(row).should("contain", expectedDateString);
        }
      });
      cy.contains("th", "Date").click();
      const sortedByDateDesc = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
      cy.getDataCy("transactions-row").each((row, index) => {
        if (index < 10) {
          const expectedDateString = format(new Date(sortedByDateDesc[index].date), "MMM dd, yyyy");
          cy.wrap(row).should("contain", expectedDateString);
        }
      });
    });
  });
  it("should sort by amount in ascending and descending order", () => {
    cy.get("@monthlyData").then((interceptObj) => {
      const transactions = interceptObj.response.body.data.transactions;

      cy.contains("th", "Amount").click();
      const sortedByAmountAsc = [...transactions].sort((a, b) => a.amount - b.amount);
      cy.getDataCy("transactions-row").each((row, index) => {
        if (index < 10) {
          cy.wrap(row)
            .invoke("text")
            .then((text) => {
              const textDigits = text.replace(/[^0-9]/g, "");
              const amountDigits = sortedByAmountAsc[index].amount.toString().replace(/[^0-9]/g, "");
              expect(textDigits).to.include(amountDigits);
            });
        }
      });
      cy.contains("th", "Amount").click();
      const sortedByAmountDesc = [...transactions].sort((a, b) => b.amount - a.amount);
      cy.getDataCy("transactions-row").each((row, index) => {
        if (index < 10) {
          cy.wrap(row)
            .invoke("text")
            .then((text) => {
              const textDigits = text.replace(/[^0-9]/g, "");
              const amountDigits = sortedByAmountDesc[index].amount.toString().replace(/[^0-9]/g, "");
              expect(textDigits).to.include(amountDigits);
            });
        }
      });
    });
  });
  it("should display table", () => {
    cy.get("@monthlyData").then((interceptObj) => {
      const transactions = interceptObj.response.body.data.transactions;
      const ITEMS_PER_PAGE = 10;
      const pageTransactions = transactions.slice(0, ITEMS_PER_PAGE);
      cy.getDataCy("transactions-body").find("tr").should("have.length", pageTransactions.length);
    });
  });
  it("should display empty state", () => {
    cy.intercept("GET", "**/api/transactions/monthly*", {
      statusCode: 200,
      body: {
        data: {
          transactions: [],
          total: 0,
        },
      },
    }).as("emptyData");
    cy.visit("/transactions/expenses");
    cy.wait("@emptyData");

    cy.getDataCy("transactions-table").should("not.exist");
    cy.getDataCy("transactions-empty").should("be.visible");
  });
});
