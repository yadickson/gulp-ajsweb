(function() {
  'use strict';

  const lazypipe = require('lazypipe');
  const order = require('gulp-order');
  const stripDebug = require('gulp-strip-debug');
  const babel = require('gulp-babel');
  const uglify = require('gulp-uglify');
  const gulpif = require('gulp-if');
  const concat = require('gulp-concat');
  const flatmap = require('gulp-flatmap');
  const path = require('path');
  const browserify = require('gulp-browserify');
  const rename = require('gulp-rename');
  const addsrc = require('gulp-add-src').append;
  const filter = require('gulp-filter');

  function matchInArray(string, array) {
    var i;
    var input = string.replace(/[\/\.\\\@]/g, '_');

    for (i = 0; i < array.length; i++) {
      var value = array[i].replace(/[\/\.\\\@]/g, '_');
      var re = new RegExp(value);
      var result = input.match(re) || {};

      if (result.index !== undefined) {
        return true;
      }
    }

    return false;

  };

  function get_scripts_base(options) {
    var minimal = options.minimal === true;
    var orderBy = options.orderBy || [];
    var addpaths = options.addpaths || [];
    var isaddpaths = addpaths.length > 0;
    var excludepaths = options.excludepaths || [];
    var isexcludepaths = excludepaths.length > 0;
    var notprocess = options.notprocess || [];

    return lazypipe()
      .pipe(gulpif, isaddpaths, !isaddpaths || addsrc(addpaths, {
        base: process.cwd()
      }))
      .pipe(gulpif, isexcludepaths, !isexcludepaths || filter(['**'].concat(excludepaths)))
      .pipe(flatmap, function(stream, file) {

        var dirname = file.path;
        var filename = dirname.replace(/.*\/node_modules\/(.*?)\/.*/g, '$1.js');
        var isprocess = matchInArray(file.path, notprocess);

        return stream
          .pipe(gulpif(isprocess, !isprocess || browserify({
            insertGlobals: false,
            global: false,
            debug: false
          })))
          .pipe(concat(filename));
      })
      .pipe(gulpif, minimal, !minimal || stripDebug())
      .pipe(order, orderBy.concat(['*']))
      .pipe(gulpif, minimal, !minimal || babel({
        presets: ['env', 'minify']
      }))
      .pipe(gulpif, minimal, !minimal || uglify())
      .pipe(rename, function(path) {
        path.dirname = 'js/vendor/';
        return path;
      })
      .pipe(gulpif, minimal, !minimal || concat('js/vendor.js'));
  }

  module.exports = {
    getScriptsBase: get_scripts_base
  };
})();
