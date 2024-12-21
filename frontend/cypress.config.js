const { defineConfig } = require("cypress");
module.exports = defineConfig({
  retries: {
    runMode: 2,
  },
  env: {
    apiUrl: process.env.REACT_APP_API_URL,
    mobileViewportWidthBreakpoint: 414,
    test_email: process.env.REACT_APP_TEST_EMAIL,
    test_password: process.env.REACT_APP_TEST_PASSWORD,
  },
  e2e: {
    baseUrl: process.env.REACT_APP_BASE_URL,
    viewportHeight: 1000,
    viewportWidth: 1280,
    experimentalSessionAndOrigin: true,
    setupNodeEvents(on, config) {},
  },
});
