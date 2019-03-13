(function() {
  'use strict';

  const opt = require('./options');

  function get_scripts(options) {
    var src = opt.getSourceDir(options);
    return [src + '/scripts/**/*.js'];
  }

	  function get_test_scripts(options) {
	    var src = opt.getTestDir(options);
	    return [src + '/spec/**/*.js'];
	  }

  module.exports = {
    getScripts: get_scripts,
		getTestScripts: get_test_scripts
  };
})();
