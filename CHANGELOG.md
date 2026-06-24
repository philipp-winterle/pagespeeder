CHANGELOG
## [4.0.2](https://github.com/philipp-winterle/pagespeeder/compare/pagespeeder-v4.0.1...pagespeeder-v4.0.2) (2026-06-24)


### 🐞 Bug Fixes

* extend lighthouse lr presets without mutating shared config ([f8c312a](https://github.com/philipp-winterle/pagespeeder/commit/f8c312ab60a69b6d2917d7ec18b4251e62faeeed))
* remove leading ./ from pagespeeder bin path ([bd9dfff](https://github.com/philipp-winterle/pagespeeder/commit/bd9dfffe87ff091c8969cc093dd4d2b8f385df38))

## [4.0.1](https://github.com/philipp-winterle/pagespeeder/compare/pagespeeder-v4.0.0...pagespeeder-v4.0.1) (2026-06-24)


### 🐞 Bug Fixes

* update bin path for pagespeeder in package.json ([75f4c64](https://github.com/philipp-winterle/pagespeeder/commit/75f4c64587c0b56debb73814b2e0f6878aa51f75))

## [4.0.0](https://github.com/philipp-winterle/pagespeeder/compare/pagespeeder-v3.0.1...pagespeeder-v4.0.0) (2026-06-24)


### ⚠ BREAKING CHANGES

* Minimum Node.js version is now 22.19. Dropped support for Node.js 18 and 20. Upgraded Lighthouse 13, Puppeteer 25, Jest 30, and Yargs 18. Migrated release workflow to release-please v5 with manifest config.
* rewritten browser creation
* reworked to nodejs 18 minimum
* **release:** switched to esm module
* switched to ESM module synatx

### 🚀 Features

* switched to ESM module synatx ([6620612](https://github.com/philipp-winterle/pagespeeder/commit/6620612d3a11b2c7168bb71d03dd3fea29961806))
* upgrade dependencies and require Node.js 22.19+ ([3777f2d](https://github.com/philipp-winterle/pagespeeder/commit/3777f2d1c76e720f3cf6d09df616aa4a1d3b337d))


### 🐞 Bug Fixes

* added no sandbox mode to allow usage as root ([5ddbcef](https://github.com/philipp-winterle/pagespeeder/commit/5ddbcef0fb541add7989b7e209abcfdf3a338743))
* capture sigint better (try at least) ([eeb463f](https://github.com/philipp-winterle/pagespeeder/commit/eeb463f2fedaf6b579f4cbc62e7b6019d2f84cd8))
* fixed cli to esm ([acd0def](https://github.com/philipp-winterle/pagespeeder/commit/acd0def4bb70d49b82c8be415f33bc93c382edc7))
* import constants with file extensions added to prevent error ([6800b04](https://github.com/philipp-winterle/pagespeeder/commit/6800b0433207035d0808bd8d2403838e58d3fd94))
* publish was missing npm ci command ([b8ee230](https://github.com/philipp-winterle/pagespeeder/commit/b8ee230429a5f7b9433f4c8814b9fcdddcde8d4f))
* update package dependencies and add overrides for specific versions ([5f898a6](https://github.com/philipp-winterle/pagespeeder/commit/5f898a6363616926d9e12b892d6c59380af4668a))


### 🧪 Tests

* updated tests ([acd0def](https://github.com/philipp-winterle/pagespeeder/commit/acd0def4bb70d49b82c8be415f33bc93c382edc7))
* updated tests - still raising coverage ([f593f2a](https://github.com/philipp-winterle/pagespeeder/commit/f593f2ac2f2a834188dcd8d6794fdcf8e2ef1436))


### 📝 Chore

* **release:** version bumb to 2.0.0 ([01cefd1](https://github.com/philipp-winterle/pagespeeder/commit/01cefd1a06099da4187feb70f98206e717817197))
* reworked to nodejs 18 minimum ([acd0def](https://github.com/philipp-winterle/pagespeeder/commit/acd0def4bb70d49b82c8be415f33bc93c382edc7))
* rewritten browser creation ([acd0def](https://github.com/philipp-winterle/pagespeeder/commit/acd0def4bb70d49b82c8be415f33bc93c382edc7))

## [3.0.1](https://github.com/philipp-winterle/pagespeeder/compare/v3.0.0...v3.0.1) (2024-06-18)


### Bug Fixes

* publish was missing npm ci command ([b8ee230](https://github.com/philipp-winterle/pagespeeder/commit/b8ee230429a5f7b9433f4c8814b9fcdddcde8d4f))

## [3.0.0](https://github.com/philipp-winterle/pagespeeder/compare/v2.0.1...v3.0.0) (2024-06-18)


### ⚠ BREAKING CHANGES

* rewritten browser creation
* reworked to nodejs 18 minimum

### Bug Fixes

* fixed cli to esm ([acd0def](https://github.com/philipp-winterle/pagespeeder/commit/acd0def4bb70d49b82c8be415f33bc93c382edc7))


### Miscellaneous Chores

* reworked to nodejs 18 minimum ([acd0def](https://github.com/philipp-winterle/pagespeeder/commit/acd0def4bb70d49b82c8be415f33bc93c382edc7))
* rewritten browser creation ([acd0def](https://github.com/philipp-winterle/pagespeeder/commit/acd0def4bb70d49b82c8be415f33bc93c382edc7))

### [2.0.1](https://github.com/hummal/pagespeeder/compare/v2.0.0...v2.0.1) (2022-11-04)


### 🐞 Bug Fixes

* import constants with file extensions added to prevent error ([6800b04](https://github.com/hummal/pagespeeder/commit/6800b0433207035d0808bd8d2403838e58d3fd94))

## [2.0.0](https://github.com/hummal/pagespeeder/compare/v1.5.0...v2.0.0) (2022-11-04)


### ⚠ BREAKING CHANGES

* **release:** switched to esm module

### 📝 Chore

* **release:** version bumb to 2.0.0 ([01cefd1](https://github.com/hummal/pagespeeder/commit/01cefd1a06099da4187feb70f98206e717817197))
