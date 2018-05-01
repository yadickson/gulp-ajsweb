# gulp-ajsweb
Gulp Angular JS utils to build Web Application

[![dependencies][dependencies-image]][dependencies-url]
[![Known Vulnerabilities][vulnerabilities-image]][vulnerabilities-url]
[![npm version][npm-image]][npm-url]

## Installation

Simply run a install using your terminal and you're good to go!

```bash
npm install --save gulp karma angular@~1.6.0 angular-animate@~1.6.0 gulp-add-src gulp-imagemin gulp-ngdocs-components gulp-order gulp-sass gulp-ajsweb
```

If you're a cool kid using Yarn then simply just use yarn as you would

```bash
yarn add gulp karma angular@~1.6.0 angular-animate@~1.6.0 gulp-add-src gulp-imagemin gulp-ngdocs-components gulp-order gulp-sass gulp-ajsweb
```

## How to use

```JavaScript
let addpaths = [
  'node_modules/angular/angular.js',
  'node_modules/angular-animate/angular-animate.js',
  'node_modules/bootstrap/**/bootstrap.js'
];

let addtestpaths = [
  'node_modules/angular-mocks/angular-mocks.js'
];

let excludepaths = [
  '!node_modules/angular/index.js',
  '!node_modules/angular-animate/index.js'
];

let addcss = [

];

let addscss = [

];

let addfonts = [

];

let orderBy = [
  'jquery.js',
  'angular.js',
  'angular-*.js',
  'bootstrap.js',
  'bootstrap-*.js'
];

options = {
  addpaths: addpaths,
  addtestpaths: addtestpaths,
  excludepaths: excludepaths,
  addcss: addcss,
  addscss: addscss,
  addfonts: addfonts,
  orderBy: orderBy,
  port: 9100
};

let gulp = require("gulp-ajsweb")(require('gulp'), options);
gulp.task('default', ['help'], () => {});
```

# ChangeLog

 version 1.6.4 >= Update dependency versions
 version 1.6.3 >= Support gulp-zip
 version 1.6.2 >= Support gulp-help-doc
 version 1.6.0 >= Support gulp-help
 version 1.5.0 <= not supported, please see how to use the new version

## Generator ajsweb

See [generator-ajsweb](https://github.com/yadickson/generator-ajsweb)

## License

GPL-3.0 © [Yadickson Soto](https://github.com/yadickson)

[dependencies-image]: https://david-dm.org/yadickson/gulp-ajsweb/status.svg
[dependencies-url]: https://david-dm.org/yadickson/gulp-ajsweb?view=list

[vulnerabilities-image]: https://snyk.io/package/npm/gulp-ajsweb/badge.svg
[vulnerabilities-url]: https://snyk.io/package/npm/gulp-ajsweb

[npm-image]: https://badge.fury.io/js/gulp-ajsweb.svg
[npm-url]: https://badge.fury.io/js/gulp-ajsweb
