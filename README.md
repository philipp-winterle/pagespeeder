# pagespeeder

Measure pagespeed with a simple configuration.

## Install

### Requirements

- Chrome / Chromium needs to be installed first

`npm i -g pagespeeder`

## CLI Usage

### Options

| Option              | Values                |  Default          | Description                                                                                                                                                                                        |
| ------------------- | --------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| -u</br>--url        | https://github.com    | none (required)   | URL to check the pagespeed for                                                                                                                                                                     |
| -d</br>--device     | mobile, desktop       | all               | Which device you want the check. Default is both. If you select a value only this value will be checked                                                                                            |
| -o</br>--output     | cli, json             | cli               | cli will only be displayed in console window while json output will create a json file with the results                                                                                            |
| -p</br>--outputPath | ./results/result.json | working directory | The output path which is used to save the result json for every device. Device names are added to the filename automatically. If you just enter a path a default filename is added.                |
| -r</br>--runs       | 3                     | 1                 | How many runs you want to do against an url. This is used to get precise results instead of an single test. Pagespeed tests can differ between 2 runs. The result will be the average of all runs. |

### Examples

To get desktop and mobile results with 1 run
`pagespeeder -u https://github.com`

## Node Module Usage

### API

```javascript
new PageSpeeder(url, device, runs, options);
```

#### Options

```javascript
url = string - "https://google.com";
```

```javascript
device = string - "mobile" || "desktop" || null; // null means "mobile && desktop"
```

```javascript
runs = number - 1; // Number of runs for one result (average score)
```

```javascript
options = {
    // Options for the chrome-launcher and chrome flags itselt
    launcherOptions: {
      port: null,
      ignoreHTTPSErrors: true,
      headless: true,
      args: [
        "--no-zygote",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-gpu",
      ],
    },
    // Config to give to lighthouse. Default Config 'lighthouse.conf.js' is used.
    lighthouseConfig: lighthouseConfig,
    // Just supress some output things. Leave it to false for better usage
    silent: false,
    // Simple function that will be called before or after the named actions
    hooks: {
      beforeRunDevice: (device, options) => {},
      afterRunDevice: (device, options) => {},
      beforeRunIteration: (run, runCount, options) => {},
      afterRunInteration: (run, runCount, options) => {},
    },
```

### Examples

```javascript
const PageSpeeder = require("pagespeeder");
const ps = new PageSpeeder("https://github.com", "mobile", 3);

const scores = await ps.run();

// Use the scores array to your needs
```
