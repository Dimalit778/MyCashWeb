describe("Home Page", () => {
  const currentYear = new Date().getFullYear();

  const checkYearlyStats = (data) => {
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

  beforeEach(() => {
    cy.loginUser();
    cy.visit("/home");
  });

  it("Current year and get data", () => {
    cy.getDataCy("year-display").should("have.text", currentYear.toString());
    cy.fetchYearlyData(currentYear).then((data) => checkYearlyStats(data));
    cy.getDataCy("loading-overlay").should("not.exist");
  });

  it("Next year click and get data", () => {
    cy.getDataCy("year-next-btn").click();
    cy.getDataCy("year-display").should("have.text", (currentYear + 1).toString());
    cy.fetchYearlyData(currentYear + 1).then((data) => checkYearlyStats(data));
    cy.getDataCy("loading-overlay").should("not.exist");
  });

  it("Prev year click and get data", () => {
    cy.getDataCy("year-prev-btn").click();
    cy.getDataCy("year-display").should("have.text", (currentYear - 1).toString());

    cy.fetchYearlyData(currentYear - 1).then((data) => checkYearlyStats(data));
    cy.getDataCy("loading-overlay").should("not.exist");
  });
});
