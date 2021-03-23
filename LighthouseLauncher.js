const lighthouse = require("lighthouse");
const debug = require("debug")("Pagespeeder-Core:LighthouseLauncher");

/**
 * @description Launches chrome with url, options and config
 * @class LighthouseLauncher
 */
class LighthouseLauncher {
  /**
   * Creates an instance of LighthouseLauncher.
   * @param {string} url
   * @param {Browser} Browser
   * @param {Object} options
   * @memberof LighthouseLauncher
   */
  constructor({ url, browser, browserPort, lighthouseConfig = null }) {
    this.url = url;
    this.browser = browser;
    this.browserPort = browserPort;
    this.lighthouseConfig = lighthouseConfig;
    debug("LighthouseLauncher instance constructed");
  }

  /**
   * @description Finally launches chrome
   * @returns {Promise<Object>} Results
   * @memberof LighthouseLauncher
   */
  launch() {
    debug("launching lighthouse");
    return lighthouse(
      this.url,
      { port: this.browserPort },
      this.lighthouseConfig
    )
      .then((results) => {
        // use results.lhr for the JS-consumable output
        // https://github.com/GoogleChrome/lighthouse/blob/master/types/lhr.d.ts
        // use results.report for the HTML/JSON/CSV output as a string
        // use results.artifacts for the trace/screenshots/other specific case you need (rarer)
        debug("lighthouse run successfully");
        return results.lhr;
      })
      .catch((err) => {
        debug("lighthouse crashed");
        console.error(err);
      });
  }
}

module.exports = LighthouseLauncher;
