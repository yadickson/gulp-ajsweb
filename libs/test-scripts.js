(function() {
  'use strict';

  const lazypipe = require('lazypipe');
  const rename = require('gulp-rename');
  const order = require('gulp-order');

  function tests_scripts() {
    return lazypipe()
      .pipe(rename, function(path) {
        var dirname = path.dirname;
        path.dirname = dirname.replace(/.*\/spec(\/*)/g, 'test\/spec/');
        return path;
      })
      .pipe(order, [
        '**/main_test.js',
        '**/*_const_test.js',
        '**/*_value_test.js',
        '**/*_service_test.js',
        '**/*_factory_test.js',
        '**/*_provider_test.js',
        '**/*_directive_test.js',
        '**/*_filter_test.js',
        '**/*_decorator_test.js',
        '**/*_component_test.js',
        '**/*_ctrl_test.js',
        '*'
      ]);
  }

  module.exports = {
    getScripts: tests_scripts
  };
})();
