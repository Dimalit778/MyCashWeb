// src/setupProxy.js
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  const target = process.env.REACT_APP_ENVIRONMENT === "test" ? "http://localhost:5001" : "http://localhost:5000";

  console.log(`Setting up proxy to: ${target}`);

  app.use(
    "/api",
    createProxyMiddleware({
      target,
      changeOrigin: true,
    })
  );
};
