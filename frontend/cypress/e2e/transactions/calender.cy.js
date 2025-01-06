import { format } from "date-fns";

describe("Calendar Navigation", () => {
  const initialDate = new Date(); // Or set a specific start date

  beforeEach(() => {
    cy.setupApiMonitors();
    cy.loginUser();
    cy.visit("/transactions/expenses");
    cy.wait("@monthlyData");
  });

  it("should fetch and display next month data", () => {
    // Store initial month for comparison
    cy.getDataCy("calendar-title")
      .invoke("text")
      .then((initialMonth) => {
        // Click next month
        cy.getDataCy("calendar-next-button").click();

        // Wait for new data
        cy.wait("@monthlyData").then((newData) => {
          // Get next month's expected date
          const nextMonth = new Date(initialDate);
          nextMonth.setMonth(initialDate.getMonth() + 1);

          // Verify calendar shows correct month
          cy.getDataCy("calendar-title").should("contain", format(nextMonth, "MMMM yyyy"));
        });
      });
  });

  it("should fetch and display previous month data", () => {
    cy.getDataCy("calendar-title")
      .invoke("text")
      .then((initialMonth) => {
        // Click previous month
        cy.getDataCy("calendar-prev-button").click();

        // Wait for new data
        cy.wait("@monthlyData").then((newData) => {
          // Get previous month's expected date
          const prevMonth = new Date(initialDate);
          prevMonth.setMonth(initialDate.getMonth() - 1);

          // Verify calendar shows correct month
          cy.getDataCy("calendar-title").should("contain", format(prevMonth, "MMMM yyyy"));
        });
      });
  });
});
