import constants from "lighthouse/lighthouse-core/config/constants.js";

export default {
  extends: "lighthouse:default",
  settings: {
    onlyAudits: [
      "first-contentful-paint",
      "speed-index",
      "largest-contentful-paint",
      "interactive",
      "total-blocking-time",
      "cumulative-layout-shift",
      "first-meaningful-paint",
    ],
    formFactor: "desktop",
    throttling: constants.throttling.desktopDense4G,
    screenEmulation: constants.screenEmulationMetrics.desktop,
    emulatedUserAgent: constants.userAgents.desktop,
  },
};
