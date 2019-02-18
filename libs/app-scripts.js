(function() {
  'use strict';

  const lazypipe = require('lazypipe');
  const order = require('gulp-order');
  const resolveDependencies = require('gulp-resolve-dependencies');
  const rename = require('gulp-rename');
  const stripDebug = require('gulp-strip-debug');
  const babel = require('gulp-babel');
  const uglify = require('gulp-uglify');
  const gulpif = require('gulp-if');
  const concat = require('gulp-concat');

  const opt = require('./options');

  function process_scripts() {
    return lazypipe()
      .pipe(stripDebug)
      .pipe(babel, {
        presets: ['env', 'minify']
      })
      .pipe(uglify);
  }

  function get_scripts(options) {
    var minimal = opt.isMinimal(options);
    var process = opt.isProcess(options);
    return lazypipe()
      .pipe(order, [
        'main.js',
        '*'
      ])
      .pipe(resolveDependencies, {
        pattern: /@requires [\s-]*(.*\.js)/g
      })
      .pipe(gulpif, process, !process || process_scripts()())
      .pipe(rename, function(path) {
        var dirname = path.dirname;
        path.dirname = dirname.replace(/.*\/scripts(\/*)/g, 'js/app/');
        return path;
      })
      .pipe(gulpif, minimal, !minimal || concat('js/app.js'));
  }

  function get_scripts_base(options) {
    options.process = false;
    return get_scripts(options);
  }

  function get_scripts_full(options) {
    options.process = true;
    return get_scripts(options);
  }

  module.exports = {
    getScriptsBase: get_scripts_base,
    getScriptsFull: get_scripts_full
  };
})();
