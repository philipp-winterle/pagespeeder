/*
 * GNU General Public License, Version 3.0
 *
 * Copyright (c) 2020 Philipp Winterle
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const lighthouse = require("lighthouse");

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
  }

  /**
   * @description Finally launches chrome
   * @returns {Promise<Object>} Results
   * @memberof LighthouseLauncher
   */
  launch() {
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
        return results.lhr;
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

module.exports = LighthouseLauncher;
