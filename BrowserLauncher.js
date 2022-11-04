import puppeteer from "puppeteer";
import doDebug from "debug";

const debug = doDebug("Pagespeeder-Core:BrowserLauncher");

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
export default async (browserOptions) => {
  let _browser = null;
  let _browserPort = browserOptions.port || null;
  let _isOwnBrowser = true;
  // If port exists and is a number
  if (!isNaN(parseInt(_browserPort))) {
    try {
      debug(`Trying to connect to browser with port ${_browserPort}`);
      _browser = await connectToBrowser(_browserPort);
      _isOwnBrowser = false;
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
    debug("No browserport set. Launching a new browser.");
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

  return {
    browser: _browser,
    browserPort: _browserPort,
    isOwnBrowser: _isOwnBrowser,
  };
};
