(function() {
  'use strict';

  const rename = require('gulp-rename');

  const opt = require('./options');
  const vendorScripts = require('./vendor-scripts');

  function get_scripts_karma(options) {
		var dest = opt.getDestination(options);
    return get_scripts_base(options)
		.pipe(rename, function(path) {
			path.dirname = dest + '/js/vendor/';
			return path;
		});
  }

	  function get_scripts_base(options) {
	    options.renameVendor = false;
			options.addpaths = opt.getAddPaths(options).concat(opt.getAddTestPaths(options));
			options.excludepaths = opt.getExcludePaths(options).concat(opt.getExcludeTestPaths(options));
	    return vendorScripts.getScriptsFull(options);
	  }

  module.exports = {
    getScripts: get_scripts_karma,
		getScriptsHtml: get_scripts_base
  };
})();
