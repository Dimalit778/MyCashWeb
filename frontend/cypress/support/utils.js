import { format } from "date-fns";

export const isMobile = () => {
  return Cypress.config("viewportWidth") < Cypress.env("mobileViewportWidthBreakpoint");
};
export const checkYearlyStats = (data) => {
  cy.getDataCy("year-calender").should("be.visible");
  cy.getDataCy("year-stats").should("be.visible");
  cy.getDataCy("year-chart").should("be.visible");
  const stats = data.data.yearlyStats;
  ["expenses", "incomes", "balance"].forEach((type) => {
    cy.getDataCy(`${type}-amount`).should(
      "have.attr",
      "data-amount",
      stats[`total${type.charAt(0).toUpperCase() + type.slice(1)}`].toString()
    );
    cy.getDataCy(`${type}-title`).should(($el) => {
      expect($el.text()).to.match(new RegExp(type, "i"));
    });
  });
};
export const verifyTableData = (transactions) => {
  cy.getDataCy("transactions-body").find("tr").should("have.length", transactions.length);

  cy.getDataCy("transactions-row").each(($row, index) => {
    const transaction = transactions[index];
    cy.wrap($row).within(() => {
      cy.get("td").eq(0).should("contain", transaction.name);
      cy.get("td").eq(1).should("contain", `$${transaction.amount.toLocaleString()}`);
      cy.get("td").eq(2).find(".badge").should("contain", transaction.category.name);
      cy.get("td")
        .eq(3)
        .should("contain", format(new Date(transaction.date), "MMM dd, yyyy"));
    });
  });
};
