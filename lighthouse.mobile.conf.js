import constants from "lighthouse/lighthouse-core/config/constants";

export default {
  extends: "lighthouse:default",
  settings: {
    onlyAudits: [
      "first-contentful-paint-3g",
      "first-contentful-paint",
      "speed-index",
      "largest-contentful-paint",
      "interactive",
      "total-blocking-time",
      "cumulative-layout-shift",
      "first-meaningful-paint",
    ],
    formFactor: "mobile",
    throttling: constants.throttling.mobileSlow4G,
    screenEmulation: constants.screenEmulationMetrics.mobile,
    emulatedUserAgent: constants.userAgents.mobile,
  },
};
