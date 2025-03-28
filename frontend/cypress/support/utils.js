export const isMobile = () => {
  return Cypress.config("viewportWidth") < Cypress.env("mobileViewportWidthBreakpoint");
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};
