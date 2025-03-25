const { defineConfig } = require("cypress");
require("dotenv").config();

module.exports = defineConfig({
  retries: {
    runMode: 2,
  },
  env: {
    API_URL: process.env.REACT_APP_TEST_API_URL,
    mobileViewportWidthBreakpoint: 414,
    TEST_EMAIL: process.env.REACT_APP_TEST_EMAIL,
    TEST_PASSWORD: process.env.REACT_APP_TEST_PASSWORD,
    protectedRoutes: ["/home", "/transactions/expenses", "/transactions/incomes", "/settings", "/contact"],
  },
  e2e: {
    watchForFileChanges: false,
    baseUrl: process.env.REACT_APP_BASE_URL,
    viewportHeight: 1000,
    viewportWidth: 1280,

    setupNodeEvents(on, config) {
      on("task", {
        async "db:seedUser"() {
          try {
            await fetch(`${process.env.REACT_APP_TEST_API_URL}/seed/userAndCategories`, {
              method: "POST",
            });
            return null;
          } catch (error) {
            console.error("Seed error:", error);
            return null;
          }
        },

        async "db:seedTransactions"({ count, type, monthly }) {
          try {
            await fetch(`${process.env.REACT_APP_TEST_API_URL}/seed/transactions`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ count, type, monthly }),
            });
            return null;
          } catch (error) {
            console.error("Seed error:", error);
            return null;
          }
        },

        async "db:clear"() {
          try {
            await fetch(`${process.env.REACT_APP_TEST_API_URL}/seed/clear`, {
              method: "DELETE",
            });
            return null;
          } catch (error) {
            console.error("Clear error:", error);
            return null;
          }
        },
      });
    },
  },
});
