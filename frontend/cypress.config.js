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
    baseUrl: process.env.REACT_APP_BASE_URL,
    viewportHeight: 1000,
    viewportWidth: 1280,

    setupNodeEvents(on, config) {},
  },
});
