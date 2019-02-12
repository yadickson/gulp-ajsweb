gulp-ajsweb
===========

Gulp Angular JS utils to build Web Application

[![TravisCI Status](https://travis-ci.org/yadickson/gulp-ajsweb.svg)](https://travis-ci.org/yadickson/gulp-ajsweb)
[![Coverage Status][https://coveralls.io/repos/github/yadickson/gulp-ajsweb/badge.svg]][https://coveralls.io/github/yadickson/gulp-ajsweb]
[![npm version](https://badge.fury.io/js/gulp-ajsweb.svg)](https://badge.fury.io/js/gulp-ajsweb)

Installation
------------

Simply run a install using your terminal and you're good to go!

```bash
npm install --save gulp karma angular@~1.6.0 angular-animate@~1.6.0 gulp-add-src gulp-imagemin gulp-ngdocs-components gulp-order gulp-sass gulp-ajsweb
```

If you're a cool kid using Yarn then simply just use yarn as you would

```bash
yarn add gulp karma angular@~1.6.0 angular-animate@~1.6.0 gulp-add-src gulp-imagemin gulp-ngdocs-components gulp-order gulp-sass gulp-ajsweb
```

How to use
----------

```JavaScript
let addpaths = [
  'node_modules/bootstrap/**/bootstrap.js'
];

let addtestpaths = [
  'node_modules/angular-mocks/angular-mocks.js'
];

let excludepaths = [
  // '!node_modules/project/index.js'
];

let addcss = [
  // 'node_modules/project/file.css'
];

let addscss = [
  'node_modules/bootstrap-sass/assets/stylesheets/**/*.scss'
];

let addfonts = [
  // 'node_modules/project/file.ttf'
];

let notprocess = [
   'jquery'
];

let orderBy = [
  'jquery.js',
  'angular.js',
  'angular-mocks.js',
  'angular-*.js',
  'bootstrap.js',
  'bootstrap-*.js'
];

let options = {
  target: './',
  buildPath: 'build',
  distPath: 'dist',
  sourceDir: 'app',
  addpaths: addpaths,
  addtestpaths: addtestpaths,
  excludepaths: excludepaths,
  excludetestpaths: excludetestpaths,
  addcss: addcss,
  addscss: addscss,
  addfonts: addfonts,
  orderBy: orderBy,
  notprocess: notprocess,
  browser: 'firefox',
  port: 9500,
  karmaPort: 9600,
  sonarServer: 'http://localhost:9000'
};

let gulp = require("gulp-ajsweb")(require('gulp'), options);
gulp.task('default', ['help'], () => {});
```

ChangeLog
=========

version 1.7.7 >= Fix bugs

version 1.7.6 >= Sonar support

version 1.7.3 >= Target directory support

version 1.6.8 >= Add browser support

version 1.6.4 >= Update dependency versions

version 1.6.3 >= Support gulp-zip

version 1.6.2 >= Support gulp-help-doc

version 1.6.0 >= Support gulp-help

version 1.5.0 <= not supported, please see how to use the new version

Generator ajsweb
----------------

See [generator-ajsweb](https://github.com/yadickson/generator-ajsweb)

License
-------

GPL-3.0 © [Yadickson Soto](https://github.com/yadickson)


