describe("Home Page", () => {
  const currentYear = new Date().getFullYear();

  beforeEach(() => {
    cy.loginUser();
    cy.visit("/transactions/expenses");
  });

  //   describe("Should display Calendar", () => {
  //     it("Current year and get data", () => {
  //         // cy.getDataCy("month-calendar-title").should("have.text", currentYear.toString());
  //       });
  //   })
  describe("Should display Categories", () => {});
});
