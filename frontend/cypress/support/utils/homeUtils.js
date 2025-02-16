export const verifyStatsCard = (type, amount) => {
  cy.getDataCy(`${type}-amount`).should("have.attr", "data-amount").and("eq", amount.toString());

  cy.getDataCy(`${type}-title`).should("contain", type);
};

export const checkYearlyStats = (data) => {
  const stats = data.yearlyStats;

  ["expenses", "incomes", "balance"].forEach((type) => {
    verifyStatsCard(type, stats[`total${type.charAt(0).toUpperCase() + type.slice(1)}`]);
  });
};
