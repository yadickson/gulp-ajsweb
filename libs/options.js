(function() {
  'use strict';

  function getOptions(options) {
    return options || {};
  }

  function getSourceDir(options) {
    return getOptions(options).sourceDir || 'app';
  }

  function getTestDir(options) {
    return getOptions(options).testDir || 'test';
  }

  function isMinimal(options) {
    return getOptions(options).minimal === true;
  }

  function isProcess(options) {
    return getOptions(options).process === true;
  }

  function getDestination(options) {
    return getOptions(options).dest || 'build';
  }

  function getConfigFile(options) {
    return getOptions(options).configFile || '.ajswebrc';
  }

  function isAddPaths(options) {
    return getAddPaths(options).length > 0;
  }

  function getAddPaths(options) {
    return getOptions(options).addpaths || [];
  }

  function isExcludePaths(options) {
    return getExcludePaths(options).length > 0;
  }

  function getExcludePaths(options) {
    return getOptions(options).excludepaths || [];
  }

  function isAddTestPaths(options) {
    return getAddTestPaths(options).length > 0;
  }

  function getAddTestPaths(options) {
    return getOptions(options).addtestpaths || [];
  }

  function isExcludeTestPaths(options) {
    return getExcludeTestPaths(options).length > 0;
  }

  function getExcludeTestPaths(options) {
    return getOptions(options).excludetestpaths || [];
  }

  function isAddCss(options) {
    return getAddCss(options).length > 0;
  }

  function getAddCss(options) {
    return getOptions(options).addcss || [];
  }

  function isAddScss(options) {
    return getAddScss(options).length > 0;
  }

  function getAddScss(options) {
    return getOptions(options).addscss || [];
  }

  function isAddFonts(options) {
    return getAddFonts(options).length > 0;
  }

  function getAddFonts(options) {
    return getOptions(options).addfonts || [];
  }

  function getOrderBy(options) {
    return getOptions(options).orderBy || [];
  }

  function getNotProcess(options) {
    return getOptions(options).notprocess || [];
  }

  function getDocPaths(options) {
    return getOptions(options).docpaths || [];
  }

  module.exports = {
    getOptions: getOptions,
    getSourceDir: getSourceDir,
    getTestDir: getTestDir,
    isMinimal: isMinimal,
    isProcess: isProcess,
    getDestination: getDestination,
    getConfigFile: getConfigFile,
    isAddPaths: isAddPaths,
    getAddPaths: getAddPaths,
    isExcludePaths: isExcludePaths,
    getExcludePaths: getExcludePaths,
    getNotProcess: getNotProcess,
    getOrderBy: getOrderBy,
    getDocPaths: getDocPaths
  };
})();
