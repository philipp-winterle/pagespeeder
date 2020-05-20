# pagespeeder

Measure pagespeed with a simple configuration.

## Install

`npm i -g pagespeeder`

## CLI Options

| Option            | Values             |  Default        |
| ----------------- | ------------------ | --------------- |
| -u / --url        | https://github.com | none (required) |
| -d / --device     | mobile, desktop    | all             |
| -o / --output     | cli, json          | cli             |
| -p / --outputPath | ./results/         | all             |

### Examples

To get desktop and mobile results with 1 run
`pagespeeder -u https://github.com`
