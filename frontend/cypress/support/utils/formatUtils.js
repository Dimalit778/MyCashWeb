export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const validateTableData = (transactions) => {
  cy.getDataCy("transactions-body").find("tr").should("have.length", transactions.length);

  transactions.forEach((transaction, index) => {
    cy.getDataCy("transactions-row")
      .eq(index)
      .within(() => {
        cy.contains(transaction.description);
        cy.contains(formatCurrency(transaction.amount));
        cy.contains(transaction.category);
      });
  });
};
