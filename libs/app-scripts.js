(function() {
  'use strict';

  const lazypipe = require('lazypipe');
  const order = require('gulp-order');
  const resolveDependencies = require('gulp-resolve-dependencies');
  const rename = require('gulp-rename');

  function get_scripts(options) {
    var src = options.sourceDir;
    return [src + '/scripts/**/*.js'];
  }

  function get_scripts_base() {
    return get_scripts_full()
      .pipe(rename, function(path) {
        var dirname = path.dirname;
        path.dirname = dirname.replace(/.*\/scripts/g, 'js/scripts');
        return path;
      });
  }

  function get_scripts_full() {
    return lazypipe()
      .pipe(order, [
        'main.js',
        '*'
      ])
      .pipe(resolveDependencies, {
        pattern: /@requires [\s-]*(.*\.js)/g
      });
  }

  module.exports = {
    getScripts: get_scripts,
    getScriptsBase: get_scripts_base,
    getScriptsFull: get_scripts_full
  };
})();
