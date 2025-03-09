import { format } from "date-fns";

describe("Transaction View", () => {
  before(() => {
    cy.clearDatabase();
    cy.seedDatabase({
      count: 20,
      type: "expenses",
      targetMonth: new Date().getMonth(),
    });
  });
});
describe("Transaction UI", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/api/transactions/monthly*").as("monthlyData");
    cy.loginUser();
    cy.visit("/transactions/expenses");
  });

  it("should sort by date in ascending and descending order", () => {
    cy.get("@monthlyData").then((interceptObj) => {
      console.log(interceptObj.response.body);
      const transactions = interceptObj.response.body.data.transactions;
      expect(transactions).to.be.an("array");
      cy.getDataCy("transactions-row").each((row, index) => {
        if (index < 10) {
          const dateString = format(new Date(transactions[index].date), "MMM dd, yyyy");
          cy.wrap(row).should("contain", dateString);
        }
      });
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
  xit("should sort by amount in ascending and descending order", () => {
    cy.get("@monthlyData").then((interceptObj) => {
      const transactions = interceptObj.response.body.data.transactions;
      cy.getDataCy("transactions-row").each((row, index) => {
        if (index < 10) {
          cy.wrap(row)
            .invoke("text")
            .then((text) => {
              const textDigits = text.replace(/[^0-9]/g, "");
              const amountDigits = transactions[index].amount.toString().replace(/[^0-9]/g, "");
              expect(textDigits).to.include(amountDigits);
            });
        }
      });
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
});

// xdescribe("Pagination Transaction pages", () => {
//   before(() => {
//     cy.seedDatabase({
//       count: 25,
//       month: new Date().getMonth(),
//     });
//     cy.loginWithTestUser();
//     cy.visit(`/transactions/expenses`);
//   });
//   it("verifies correct number of pages for transaction data", () => {
//     cy.wait("@monthlyData").then(({ response }) => {
//       const transactions = response.body.data.transactions;
//       const totalItems = transactions.length;
//       const itemsPerPage = 10;
//       const expectedPages = Math.ceil(totalItems / itemsPerPage);

//       cy.getDataCy("transactions-body").find("tr").should("have.length", "10");

//       cy.get(".pagination .page-item").then(($pageItems) => {
//         const actualPageButtons = $pageItems.length - 2;

//         if (expectedPages > 1) {
//           expect(actualPageButtons).to.be.at.least(expectedPages);
//           const expectedLastPageItems = totalItems % itemsPerPage || itemsPerPage;

//           // Navigate to last page
//           cy.get(".pagination .page-item").contains(`${expectedPages}`).click();

//           // Verify correct number of items on last page
//           cy.getDataCy("transactions-body").find("tr").should("have.length", expectedLastPageItems);
//           cy.log(`Last page has ${expectedLastPageItems} items as expected`);
//         } else {
//           cy.log("Only one page of results, pagination may not be displayed");
//         }
//       });
//     });
//   });

//   it("verifies next/prev button states on different pages", () => {
//     const totalItems = 25;
//     const itemsPerPage = 10;
//     const expectedPages = Math.ceil(totalItems / itemsPerPage);

//     cy.get(".pagination .page-item").first().should("have.class", "disabled");

//     cy.get(".pagination .page-item").last().should("not.have.class", "disabled");

//     cy.get(".pagination .page-item").last().click();

//     // On page 2, both prev and next should be enabled
//     cy.get(".pagination .active").should("contain", "2");
//     cy.get(".pagination .page-item").first().should("not.have.class", "disabled");
//     cy.get(".pagination .page-item").last().should("not.have.class", "disabled");

//     // Go to last page
//     cy.get(".pagination .page-item").contains(`${expectedPages}`).click();

//     // On last page, next button should be disabled
//     cy.get(".pagination .active").should("contain", `${expectedPages}`);
//     cy.get(".pagination .page-item").last().should("have.class", "disabled");

//     // Prev button should be enabled
//     cy.get(".pagination .page-item").first().should("not.have.class", "disabled");

//     // Go back to first page using prev button
//     cy.get(".pagination .page-item").first().click();
//     cy.get(".pagination .page-item").first().click();

//     cy.get(".pagination .active").should("contain", "1");
//   });

//   it("navigates through all pages using next button", () => {
//     cy.get(".pagination .active").should("contain", "1");

//     const navigateNext = () => {
//       cy.get(".pagination .page-item")
//         .last()
//         .then(($next) => {
//           if (!$next.hasClass("disabled")) {
//             cy.get(".pagination .active")
//               .invoke("text")
//               .then((pageNum) => {
//                 cy.log(`Currently on page ${pageNum}, clicking next`);
//               });

//             cy.getDataCy("transactions-body")
//               .find("tr")
//               .first()
//               .invoke("text")
//               .then((text) => {
//                 const firstItemText = text.trim();

//                 cy.get(".pagination .page-item").last().click();

//                 cy.getDataCy("transactions-body")
//                   .find("tr")
//                   .first()
//                   .invoke("text")
//                   .should("not.equal", firstItemText);
//                 navigateNext();
//               });
//           } else {
//             cy.get(".pagination .active")
//               .invoke("text")
//               .then((pageNum) => {
//                 cy.log(`Reached last page: ${pageNum}`);
//               });
//           }
//         });
//     };

//     navigateNext();
//   });
// });
// xdescribe("Empty state", () => {
//   // Override the beforeEach for just this context
//   beforeEach(() => {
//     cy.intercept("GET", "**/api/transactions/monthly*", {
//       statusCode: 200,
//       body: {
//         data: {
//           transactions: [],
//           total: 0,
//         },
//       },
//     }).as("emptyData");

//     cy.loginWithTestUser();
//     cy.visit("/transactions/expenses");
//     cy.wait("@emptyData");
//   });

//   it("should display empty state", () => {
//     cy.getDataCy("transactions-table").should("not.exist");
//     cy.getDataCy("transactions-empty").should("be.visible");
//   });
// });
