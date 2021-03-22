const constants = require("lighthouse/lighthouse-core/config/constants");

module.exports = {
  extends: "lighthouse:default",
  settings: {
    onlyAudits: [
      "first-contentful-paint",
      "speed-index",
      "largest-contentful-paint",
      "first-meaningful-paint",
      "interactive",
      "total-blocking-time",
      "first-cpu-idle",
      "cumulative-layout-shift",
      "estimated-input-latency",
    ],
    formFactor: "desktop",
    throttling: constants.throttling.desktopDense4G,
    screenEmulation: constants.screenEmulationMetrics.desktop,
    emulatedUserAgent: constants.userAgents.desktop,
  },
};
