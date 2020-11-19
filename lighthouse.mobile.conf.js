module.exports = {
  extends: "lighthouse:default",
  settings: {
    onlyAudits: [
      "first-contentful-paint-3g",
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
    emulatedFormFactor: "mobile",
  },
};
