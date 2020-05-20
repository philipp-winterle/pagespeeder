#!/usr/bin/env node

const path = require("path");
const argv = require("yargs").argv;
const Table = require("cli-table3");
const c = require("ansi-colors");
const fs = require("fs").promises;
const mkdirp = require("mkdirp");
const PageSpeeder = require("./Pagespeeder");

// Get Parameters
const outputType = argv.output || argv.o || "default";
const url = argv.url || argv.u;
const device = argv.device || argv.d;
let outputPath = argv.outputPath || argv.p || path.join(".");
let runCount = Number(argv.runs || argv.r) || 1;

// Constants
const isOutputJSON = outputType === "json";
const defaultFileName = "lighthouse_result_###.json";

if (
  outputType === "json" &&
  (outputPath === null || outputPath === undefined)
) {
  console.error(
    "OutputType is set to json but no valid output path is set. (--outputPath, -p)"
  );
  process.exit(1);
} else {
  outputPath = path.resolve(outputPath);
  const ext = path.extname(outputPath);

  if (ext !== ".json" || ext !== ".JSON") {
    // If path has no json file ext write default filename
    outputPath = path.join(outputPath, defaultFileName);
  }
}

// Capture Events
process.once("SIGINT", () => {
  process.exit(0);
});

const colorScore = (score) => {
  const rating = {
    "90": "green",
    "40": "yellow",
    "0": "red",
  };
  const ratingKeys = Object.keys(rating);

  const colorKey = ratingKeys.reduce((prev, curr) => {
    return prev === null ? curr : curr < score ? curr : prev;
  }, null);

  score = c.bold[rating[colorKey]](score);

  return score;
};

const createResultTable = (device, scores) => {
  console.log(
    c.bold.bgBlue(
      c.whiteBright(
        `\tLighthouse Performance Check - Device ${c.blackBright.italic(
          device
        )}`
      )
    )
  );
  console.log(`\t${c.bold("Score:")} ${colorScore(scores.mainScore)}`);

  // Create Table head
  const table = new Table({
    chars: {
      "top-left": "\t╔",
      "bottom-left": "\t╚",
      left: "\t║",
      "left-mid": "\t╟",
    },
    head: ["Audit", "Score", "Value"],
  });

  const scoresArr = Object.entries(scores.auditScores);

  // Create table rows
  for (const [scoreName, scoreObj] of scoresArr) {
    table.push([scoreName, colorScore(scoreObj.score), scoreObj.displayValue]);
  }
  console.log(table.toString() + "\n\n");
};

(async () => {
  console.log(`
\t${c.yellow.bold("Lighthouse Performance Measurement")}
\t${c.italic.grey("Version:")} ${c.italic.grey(
    require("lighthouse/package.json").version
  )}`);

  /** @type {PageSpeeder} ps  */
  const ps = new PageSpeeder(url, device, runCount, {
    hooks: {
      beforeRunDevice: (device, options) => {
        if (options.silent === false) {
          console.log(`\n\tCalculating score for ${c.magentaBright(device)}`);
        }
      },
      beforeRunIteration: (run, runCount, options) => {
        if (options.silent === false) {
          process.stdout.write(
            `\tRun ${c.greenBright(run)} of ${c.blueBright(runCount)} ...\r`
          );
        }
      },
    },
  });
  const scores = await ps.run();

  for (const scoreObj of scores) {
    if (isOutputJSON) {
      await mkdirp(path.dirname(outputPath));
      const deviceOutputPath = outputPath.replace("###", scoreObj.device);
      await fs.writeFile(
        deviceOutputPath,
        JSON.stringify(scoreObj.score),
        "utf8"
      );
    } else {
      createResultTable(scoreObj.device, scoreObj.score);
    }
  }

  console.log(`\t${c.green("Lighthouse run finished")}`);
})();
