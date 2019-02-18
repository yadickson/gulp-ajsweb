(function() {
  'use strict';

  const opt = require('./options');

  function get_scripts(options) {
    var src = opt.getSourceDir(options);
    return [src + '/scripts/**/*.js'];
  }

  module.exports = {
    getScripts: get_scripts
  };
})();
