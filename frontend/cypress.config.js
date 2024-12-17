const { defineConfig } = require("cypress");

module.exports = defineConfig({
  env: {
    BASE_URL: "http://localhost:3000",
    API_URL: "http://localhost:5000",
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    // Configure viewport sizes
    viewportWidth: 1200,
    viewportHeight: 800,
    // Handle React routing
    experimentalSessionAndOrigin: true,
  },
});
