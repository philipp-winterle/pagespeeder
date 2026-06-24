import baseConfig from "lighthouse/core/config/lr-desktop-config.js";

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
