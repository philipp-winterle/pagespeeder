const deepmerge = require("deepmerge");
const LighthouseLauncher = require("./LighthouseLauncher.js");
const browserLauncher = require("./BrowserLauncher.js");
const lighthouseMobileConfig = require("./lighthouse.mobile.conf.js");
const lighthouseDesktopConfig = require("./lighthouse.desktop.conf.js");

const debug = require("debug")("Pagespeeder-Core");

/**
 * @description
 * @class PageSpeeder
 */
class PageSpeeder {
  availableDevices = [PageSpeeder.DEVICE_MOBILE, PageSpeeder.DEVICE_DESKTOP];
  scores = [];
  devices = [];
  runCount = 1;
  options = {
    launcherOptions: {
      port: null,
      ignoreHTTPSErrors: true,
      headless: true, // Should always be true. Only for testing to false
      args: [
        "--no-zygote",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-gpu",
      ],
    },
    silent: false,
    hooks: {
      beforeRunDevice: (device, options) => {},
      afterRunDevice: (device, options) => {},
      beforeRunIteration: (run, runCount, options) => {},
      afterRunInteration: (run, runCount, options) => {},
    },
  };

  /**
   *Creates an instance of PageSpeeder.
   * @param {string} [device=null]
   * @param {number} [runCount=1]
   * @param {Object} options
   * @memberof PageSpeeder
   */
  constructor(url, device = null, runCount = 1, options = {}) {
    this.url = url;

    // Which devices should be calculated?
    if (device !== null) {
      this.devices = this.availableDevices.filter(
        (availableDevice) => availableDevice === device
      );
    } else {
      this.devices = this.availableDevices;
    }

    runCount = Number(runCount);
    if (!isNaN(runCount) && runCount > 0) {
      this.runCount = runCount;
    }

    this.options = deepmerge(this.options, options);
  }

  static get DEVICE_DESKTOP() {
    return "desktop";
  }
  static get DEVICE_MOBILE() {
    return "mobile";
  }

  static getDeviceConfig(device) {
    if (device === "mobile") {
      return lighthouseMobileConfig;
    } else if (device === "desktop") {
      return lighthouseDesktopConfig;
    } else {
      throw new Error(`Can not get lighthouse config for device ${device}`);
    }
  }

  /**
   * @description Takes the score of n runs of LighthouseLauncher and put out a normalized score object
   * @private
   * @param {Array} scores
   * @returns {Object} scoresBucket
   * @memberof PageSpeeder
   */
  normalizeScores(scores) {
    const scoresCount = scores.length;
    let scoresBucket = {
      mainScore: 0,
      auditScores: {},
    };
    const scoreNames = new Set();

    for (const result of scores) {
      // Add up the main scores
      scoresBucket.mainScore += result.score * 100;

      // iterate over the audits and sum them up
      const audits = result.audits;

      for (const [key, audit] of audits) {
        const scoreBucket = scoresBucket.auditScores[audit.title];
        scoreNames.add(audit.title);
        if (scoreBucket !== undefined) {
          scoreBucket.score = scoreBucket.score + audit.score * 100;
          scoreBucket.value = scoreBucket.value + audit.numericValue;
        } else {
          scoresBucket.auditScores[audit.title] = {
            score: audit.score * 100,
            value: audit.numericValue,
            unit: audit.numericUnit,
            displayValue: "",
          };
        }
      }
    }

    scoresBucket.mainScore = Math.round(scoresBucket.mainScore / scoresCount);

    for (const scoreName of scoreNames) {
      const scoreBucket = scoresBucket.auditScores[scoreName];
      scoreBucket.score = Math.round(scoreBucket.score / scoresCount);
      scoreBucket.value = Math.round(scoreBucket.value / scoresCount);
      if (scoreBucket.unit !== "unitless") {
        scoreBucket.displayValue = `${(scoreBucket.value / 1000).toFixed(1)}s`;
      } else {
        scoreBucket.displayValue = null;
      }
    }

    return scoresBucket;
  }

  /**
   * @public
   * @description run the PageSpeeder with the given options
   * @returns {Array} Scores
   * @memberof PageSpeeder
   */
  async run() {
    // Variables
    const scores = [];
    const canCloseBrowser = this.options.launcherOptions.port === null;
    const { browser, browserPort } = await browserLauncher(
      this.options.launcherOptions
    ); // returns a browser or null
    this.options.launcherOptions.port = browserPort;

    for await (const device of this.devices) {
      // Call hook
      this.options.hooks.beforeRunDevice(device, this.options);

      const lighthouseConfig = PageSpeeder.getDeviceConfig(device);
      let run = 0;
      let scoresArr = [];

      while (run++ < this.runCount) {
        this.options.hooks.beforeRunIteration(run, this.runCount, this.options);

        const lhl = new LighthouseLauncher({
          url: this.url,
          browser,
          browserPort,
          lighthouseConfig,
        });

        await lhl
          .launch()
          .then((results) => {
            // Results can be empty on lh crash
            if (results) {
              const audits = Object.entries(results.audits);

              const result = {
                score: results.categories.performance.score,
                audits: audits,
              };

              scoresArr.push(result);
            }
          })
          .catch((err) => {
            console.error(err);
          });

        this.options.hooks.afterRunInteration(run, this.runCount, this.options);
      }

      if (scoresArr.length > 0) {
        // Contains an object of scores
        const score = this.normalizeScores(scoresArr);

        this.options.hooks.afterRunDevice(device, this.options);

        scores.push({
          device: device,
          score: score,
        });
      }
    }

    // When there is a browser -> close it. If the browser was not opened by us -> keep it
    if (canCloseBrowser) {
      await browser.close();
    } else {
      await browser.disconnect();
    }

    return scores;
  }
}

module.exports = PageSpeeder;
