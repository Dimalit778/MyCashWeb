const { defineConfig } = require("cypress");
require("dotenv").config();
module.exports = defineConfig({
  retries: {
    runMode: 2,
  },
  env: {
    API_URL: process.env.REACT_APP_API_URL,
    mobileViewportWidthBreakpoint: 414,
    TEST_EMAIL: process.env.REACT_APP_TEST_EMAIL,
    TEST_PASSWORD: process.env.REACT_APP_TEST_PASSWORD,
  },
  e2e: {
    watchForFileChanges: false,
    baseUrl: process.env.REACT_APP_BASE_URL,
    viewportHeight: 1000,
    viewportWidth: 1280,

    setupNodeEvents(on, config) {
      // on("task", {
      //   async "db:seed"() {
      //     try {
      //       await fetch(`${process.env.REACT_APP_API_URL}/api/seed/create`, {
      //         method: "POST",
      //       });
      //       return null; // Cypress tasks must return null or a value
      //     } catch (error) {
      //       console.error("Seed error:", error);
      //       return null;
      //     }
      //   },
      //   async "db:clear"() {
      //     try {
      //       await fetch(`${process.env.REACT_APP_API_URL}/api/seed/clear`, {
      //         method: "DELETE",
      //       });
      //       return null;
      //     } catch (error) {
      //       console.error("Clear error:", error);
      //       return null;
      //     }
      //   },
      // });
    },
  },
});
