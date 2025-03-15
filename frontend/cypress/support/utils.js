import { format } from "date-fns";

export const isMobile = () => {
  return Cypress.config("viewportWidth") < Cypress.env("mobileViewportWidthBreakpoint");
};
// export const checkYearlyStats = (data) => {
//   cy.getDataCy("year-calender").should("be.visible");
//   cy.getDataCy("year-stats").should("be.visible");
//   cy.getDataCy("year-chart").should("be.visible");
//   const stats = data.data.yearlyStats;
//   ["expenses", "incomes", "balance"].forEach((type) => {
//     cy.getDataCy(`${type}-amount`).should(
//       "have.attr",
//       "data-amount",
//       stats[`total${type.charAt(0).toUpperCase() + type.slice(1)}`].toString()
//     );
//     cy.getDataCy(`${type}-title`).should(($el) => {
//       expect($el.text()).to.match(new RegExp(type, "i"));
//     });
//   });
// };

// export const checkMonthTitle = (interception) => {
//   const url = new URL(interception.request.url);
//   const params = new URLSearchParams(url.search);
//   const month = parseInt(params.get("month"));
//   const year = parseInt(params.get("year"));

//   const date = new Date(year, month - 1);
//   const expectedTitle = format(date, "MMMM yyyy");

//   cy.getDataCy("calendar-title").should("have.text", expectedTitle);
// };
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};
