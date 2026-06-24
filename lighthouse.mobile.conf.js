import baseConfig from "lighthouse/core/config/lr-mobile-config.js";

/** @type {import('lighthouse').Config} */
const config = {
  ...baseConfig,
  settings: {
    ...baseConfig.settings,
    onlyCategories: ["performance"],
  },
};

export default config;
export { config };
