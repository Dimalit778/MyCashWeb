import { format } from "date-fns";
import { verifyTableData } from "../support/utils";

describe("Transactions ", () => {
  //   before(() => {
  //     cy.task("db:clear");
  //     cy.task("db:seed");
  //   });

  beforeEach(() => {
    cy.setupApiMonitors();
    cy.loginUser();
    cy.visit("/transactions/expenses");
    cy.url().should("include", "/transactions/expenses");
  });

  //   after(() => {
  it("Should display correct column headers", () => {
    const expectedHeaders = ["Name", "Amount", "Category", "Date", ""];
    cy.getDataCy("table-titles")
      .find("tr th")
      .each(($th, index) => {
        cy.wrap($th).should("contain", expectedHeaders[index]);
      });
  });
  it("should load yearly transactions", () => {
    cy.wait("@monthlyData").then((interception) => {
      if (interception.response) {
        console.log("Response:", interception.response.body);
        expect(interception.response.statusCode).to.eq(200);
      } else {
        console.log("No response received");
      }
    });
  });
  it("Number of table rows & columns", () => {
    cy.wait("@monthlyData").then((data) => {
      const { transactions } = data.response.body.data;
      cy.getDataCy("transactions-table").should("exist");

      verifyTableData(transactions);
    });
  });
  it("Next month click updates table data", () => {
    cy.wait("@monthlyData").then(() => {
      cy.getDataCy("calendar-next-button").click();

      cy.wait("@monthlyData").then((data) => {
        const { transactions } = data.response.body.data;
        verifyTableData(transactions);
      });
    });
  });
  xit("Previous month click updates table data", () => {
    cy.wait("@monthlyData").then(() => {
      cy.getDataCy("calendar-previous-button").click();

      cy.wait("@monthlyData").then((data) => {
        const { transactions } = data.response.body.data;
        verifyTableData(transactions);
      });
    });
  });
});
