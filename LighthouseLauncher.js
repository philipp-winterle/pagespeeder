import lighthouse from "lighthouse";
import puppeteer from "puppeteer";
import doDebug from "debug";

const debug = doDebug("Pagespeeder-Core:LighthouseLauncher");

/**
 * @description Launches chrome with url, options and config
 * @class LighthouseLauncher
 */
class LighthouseLauncher {
  launcherOptions = {
    ignoreHTTPSErrors: true,
    headless: true, // Should always be true. Only for testing to false
    args: [
      "--no-zygote",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-gpu",
    ],
  };

  /**
   * Creates an instance of LighthouseLauncher.
   * @param {string} url
   * @param {Browser} Browser
   * @param {Object} options
   * @memberof LighthouseLauncher
   */
  constructor({ url, lighthouseConfig = null, browserOptions }) {
    this.url = url;
    this.lighthouseConfig = lighthouseConfig;
    this.browserOptions = browserOptions;
    debug("LighthouseLauncher instance constructed");
  }

  /**
   * @description Finally launches chrome
   * @returns {Promise<Object>} Results
   * @memberof LighthouseLauncher
   */
  async launch() {
    debug("launching lighthouse");

    let browser;
    let page;

    if (this.browserOptions.browserWSEndpoint) {
      browser = await puppeteer.connect({
        browserWSEndpoint: this.browserOptions.browserWSEndpoint,
        ignoreHTTPSErrors: true,
      });
    } else if (this.browserOptions.port) {
      const host = this.browserOptions.host || "127.0.0.1";

      browser = await puppeteer.connect({
        browserURL: `http://${host}:${this.browserOptions.port}`,
      });
    } else {
      browser = await puppeteer.launch(this.launcherOptions);
    }

    if (browser) {
      page = await browser.newPage();
    }

    const result = await lighthouse(
      this.url,
      { output: "json" },
      this.lighthouseConfig,
      page
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
        throw err;
      });

    if (browser) {
      await browser.close();
      debug("Browser closed");
    }

    return result;
  }
}

export { LighthouseLauncher, LighthouseLauncher as default };
