const desktopDense4G = require("lighthouse/lighthouse-core/config/constants")
  .throttling.desktopDense4G;

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
    emulatedFormFactor: "desktop",
    throttling: desktopDense4G,
  },
};
