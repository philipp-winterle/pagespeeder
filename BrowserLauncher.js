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
const debug = require("debug")("Pagespeeder-Core:BrowserLauncher");
const puppeteer = require("puppeteer");
// const fetch = require("node-fetch");

const connectToBrowser = async (port) => {
  return await puppeteer.connect({
    browserURL: `http://127.0.0.1:${port}`,
  });
};

const launchBrowser = async (browserOptions) => {
  const browser = await puppeteer.launch(browserOptions);
  const browserWsEndpoint = browser.wsEndpoint();
  const {
    groups: { port },
  } = browserWsEndpoint.match(/ws:\/\/[0-9]+.*:(?<port>[0-9]*)?\//);
  const browserPort = port;

  return { browser, browserPort };
};

/**
 * @description Launches chrome with url, options and config
 * @returns <Promise<puppeteer.Browser>> Chrome Browser
 */
module.exports = async (browserOptions) => {
  let _browser = null;
  let _browserPort = browserOptions.port || null;
  // If port exists and is a number
  if (!isNaN(parseInt(_browserPort))) {
    try {
      debug("Trying to connect to browser with port " + _browserPort);
      _browser = await connectToBrowser(_browserPort);
      debug(`Connected to existing browser at port ${_browserPort}`);
    } catch (e) {
      debug("Connection failed.");
      debug("Error %O", e);
      debug("Launching new browser with given options.");
      const { browser, browserPort } = await launchBrowser(browserOptions);
      _browser = browser;
      _browserPort = browserPort;
    }
  } else {
    debug(
      "Browserport was not a number. Connection not possible. Launching a new browser."
    );
    const { browser, browserPort } = await launchBrowser(browserOptions);
    _browser = browser;
    _browserPort = browserPort;

    // // Get websocketDebuggerUrl for conneting to browser
    // const response = await fetch(
    //   `http://localhost:${browserPort}/json/version`
    // ).catch((err) => console.error(err));
    // const { webSocketDebuggerUrl } = await response
    //   .json()
    //   .catch((err) => console.error(err));
    //
    // // Connect to it using puppeteer.connect().
    // browser = await puppeteer.connect({
    //   browserWSEndpoint: webSocketDebuggerUrl,
    // });
  }

  return { browser: _browser, browserPort: _browserPort };
};
