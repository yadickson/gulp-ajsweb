(function() {
  'use strict';

  const rename = require('gulp-rename');

  const opt = require('./options');
  const vendorScripts = require('./vendor-scripts');

  function get_scripts(options) {
    options.minimal = false;
		options.renameVendor = false;
    return vendorScripts.getScriptsFull(options);
  }

  module.exports = {
    getScripts: get_scripts
  };
})();
