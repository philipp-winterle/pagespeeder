const deepmerge = require("deepmerge");
const LighthouseLauncher = require("./LighthouseLauncher.js");
const lighthouseConfig = require("./lighthouse.conf.js");

/**
 * @description
 * @class PageSpeeder
 */
class PageSpeeder {
  availableDevices = ["mobile", "desktop"];
  scores = [];
  devices = [];
  runCount = 1;
  options = {
    launcherOptions: {
      chromeFlags: [
        "--no-zygote",
        "--headless",
        "--no-sandbox",
        "--disable-setuid-sandbox",
      ],
    },
    lighthouseConfig: lighthouseConfig,
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
    const scores = [];

    for await (const device of this.devices) {
      // Call hook
      this.options.hooks.beforeRunDevice(device, this.options);

      let run = 0;
      let scoresArr = [];

      while (run++ < this.runCount) {
        this.options.hooks.beforeRunIteration(run, this.runCount, this.options);

        const lighthouseConfig = deepmerge(this.options.lighthouseConfig, {
          emulatedFormFactor: device,
        });

        const lhl = new LighthouseLauncher(
          this.url,
          this.options.launcherOptions,
          lighthouseConfig
        );

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

    return scores;
  }
}

module.exports = PageSpeeder;
