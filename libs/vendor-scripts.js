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

  const opt = require('./options');

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

  function process_scripts() {
    return lazypipe()
      .pipe(stripDebug)
      .pipe(babel, {
        presets: ['env', 'minify']
      })
      .pipe(uglify);
  }

  function rename_scripts() {
    return lazypipe()
      .pipe(rename, function(path) {
        path.dirname = 'js/vendor/';
        return path;
      });
  }

  function browserify_scripts(options) {
    return lazypipe()
      .pipe(flatmap, function(stream, file) {

        var notprocess = opt.getNotProcess(options);
        var dirname = file.path;
        var filename = dirname.replace(/.*\/node_modules\/(.*?)\/.*/g, '$1.js');
        var isprocess = opt.isProcess(options) && matchInArray(file.path, notprocess);

        return stream
          .pipe(gulpif(isprocess, !isprocess || browserify({
            insertGlobals: false,
            global: false,
            debug: false
          })))
          .pipe(concat(filename));
      });
  }

  function get_scripts(options) {
    var minimal = opt.isMinimal(options);
    var orderBy = opt.getOrderBy(options);
    var addpaths = opt.getAddPaths(options);
    var isaddpaths = opt.isAddPaths(options);
    var excludepaths = opt.getExcludePaths(options);
    var isexcludepaths = opt.isExcludePaths(options);
    var isRename = opt.getRenameVendor(options);

    return lazypipe()
      .pipe(gulpif, isaddpaths, !isaddpaths || addsrc(addpaths, {
        base: process.cwd()
      }))
      .pipe(gulpif, isexcludepaths, !isexcludepaths || filter(['**'].concat(excludepaths)))
      .pipe(gulpif, isRename, !isRename || browserify_scripts(options)())
      .pipe(order, orderBy.concat(['*']))
      .pipe(gulpif, process, !process || process_scripts()())
      .pipe(gulpif, isRename, !isRename || rename_scripts()())
      .pipe(gulpif, minimal, !minimal || concat('js/vendor.js'));
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
