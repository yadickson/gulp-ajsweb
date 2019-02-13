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

  function get_scripts(options) {
    var src = options.sourceDir || 'app';
    return [src + '/scripts/**/*.js'];
  }

  function get_scripts_base(options) {
    var minimal = options.minimal === true;
    return lazypipe()
      .pipe(order, [
        'main.js',
        '*'
      ])
      .pipe(resolveDependencies, {
        pattern: /@requires [\s-]*(.*\.js)/g
      })
      .pipe(gulpif, minimal, !minimal || stripDebug())
      .pipe(gulpif, minimal, !minimal || babel({
        presets: ['env', 'minify']
      }))
      .pipe(gulpif, minimal, !minimal || uglify())
      .pipe(rename, function(path) {
        var dirname = path.dirname;
        path.dirname = dirname.replace(/.*\/scripts(\/*)/g, 'js/app/');
        return path;
      })
			.pipe(gulpif, minimal, !minimal || concat('js/app.js'));
  }

  module.exports = {
    getScripts: get_scripts,
    getScriptsBase: get_scripts_base
  };
})();
