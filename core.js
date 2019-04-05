'use strict'

const rename = require('gulp-rename');
const gulpif = require('gulp-if');
const concat = require('gulp-concat');
const addsrc = require('gulp-add-src');
const mainNpmFiles = require('gulp-main-npm-files');
const styleNpmFiles = require('gulp-style-npm-files');
const fontNpmFiles = require('gulp-font-npm-files');
const imgNpmFiles = require('gulp-img-npm-files');
const merge = require('merge-stream');
const less = require('gulp-less');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const stripCssComments = require('gulp-strip-css-comments');
const order = require('gulp-order');
const babel = require('gulp-babel');
const series = require('stream-series');
const inject = require('gulp-inject');
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const ngdocs = require('gulp-ngdocs-components');
const filter = require('gulp-filter');
const gulpPostcss = require('gulp-postcss');
const cssdeclsort = require('css-declaration-sorter');
const stripDebug = require('gulp-strip-debug');
const urlAdjuster = require('gulp-css-url-adjuster');
const removeLines = require('gulp-remove-lines');
const print = require('gulp-print').default;
const browserify = require('gulp-browserify');
const flatmap = require('gulp-flatmap');
const path = require('path');
const resolveDependencies = require('gulp-resolve-dependencies');

const appFilesModule = require('./libs/app-files');
const appScriptModule = require('./libs/app-scripts');
const appTestScriptModule = require('./libs/app-test-scripts');
const vendorScriptModule = require('./libs/vendor-scripts');
const vendorTestScriptModule = require('./libs/vendor-test-scripts');

let gulp;
let startOptions = {};

const stylePath = {
  lessStyles: 'app/styles/*.less',
  scssStyles: 'app/styles/*.scss',
  cssStyles: 'app/styles/*.css'
};

const paths = {
  appStyles: [stylePath.lessStyles, stylePath.scssStyles, stylePath.cssStyles, '!README'],
  appViews: ['app/**/*.html'],
  appIcon: ['app/*.ico'],
  appImages: ['app/images/**/*'],
  appFonts: ['app/fonts/**/*.{eot,svg,ttf,woff,woff2}', '!README'],
  appTests: ['test/**/*.js'],
  testHtml: ['test/*.html']
}

function getOptions(options) {
  return options || {};
}

function isMinimal(options) {
  return getOptions(options).minimal === true;
}

function getDestination(options) {
  return getOptions(options).dest || 'build';
}

function getConfigFile(options) {
  return getOptions(options).configFile || '.ajswebrc';
}

function isAddPaths() {
  return getAddPaths().length > 0;
}

function getAddPaths() {
  return startOptions.addpaths || [];
}

function isExcludePaths() {
  return getExcludePaths().length > 0;
}

function getExcludePaths() {
  return startOptions.excludepaths || [];
}

function isExcludeTestPaths() {
  return getExcludeTestPaths().length > 0;
}

function getExcludeTestPaths() {
  return startOptions.excludetestpaths || [];
}

function isAddTestPaths() {
  return getAddTestPaths().length > 0;
}

function getAddTestPaths() {
  return startOptions.addtestpaths || [];
}

function isAddCss() {
  return getAddCss().length > 0;
}

function getAddCss() {
  return startOptions.addcss || [];
}

function isAddScss() {
  return getAddScss().length > 0;
}

function getAddScss() {
  return startOptions.addscss || [];
}

function isAddFonts() {
  return getAddFonts().length > 0;
}

function getAddFonts() {
  return startOptions.addfonts || [];
}

function getOrderBy() {
  return startOptions.orderBy || [];
}

function getNotProcess() {
  return startOptions.notprocess || [];
}

function getDocPaths(options) {
  return getOptions(options).docpaths || [];
}

/**
 * Application elements
 */
function appScripts() {
  return gulp.src(appFilesModule.getScripts(startOptions), {
    base: process.cwd()
  });
}

/**
 * Vendor elements
 */
function vendorScripts() {
  return gulp.src(mainNpmFiles(), {
    base: process.cwd()
  });
}

function appStyles() {
  return gulp.src(paths.appStyles);
}

function appFonts() {
  return gulp.src(fontNpmFiles()
    .concat(paths.appFonts)
  );
}

function appViews() {
  return gulp.src(paths.appViews);
}

function appImages() {
  return gulp.src(imgNpmFiles()
    .concat(paths.appImages)
  );
}

function appIcon() {
  return gulp.src(paths.appIcon);
}

/**
 * Build application elements
 */
function buildScripts(options) {
  startOptions.minimal = isMinimal(options);
  return appScripts()
    .pipe(appScriptModule.getScriptsBase(startOptions)());
}

/**
 * Build application elements and copy files
 */
function buildScriptsAndCopy(options) {
  var dest = getDestination(options);
  startOptions.minimal = isMinimal(options);
  return appScripts()
    .pipe(appScriptModule.getScriptsFull(startOptions)())
    .pipe(gulp.dest(dest));
}

/**
 * Build vendor elements
 */
function buildVendorScripts(options) {
	startOptions.orderBy = getOrderBy(options);
  startOptions.minimal = isMinimal(options);
  return vendorScripts()
    .pipe(vendorScriptModule.getScriptsBase(startOptions)());
}

/**
 * Build vendor elements and copy
 */
function buildVendorScriptsAndCopy(options) {
  startOptions.minimal = isMinimal(options);
  var dest = getDestination(options);
  return vendorScripts()
    .pipe(vendorScriptModule.getScriptsFull(startOptions)())
    .pipe(gulp.dest(dest));
}

/**
 * Test application scripts
 */
function appTestsScripts() {
  return gulp.src(appFilesModule.getTestScripts(startOptions), {
      base: process.cwd()
    })
    .pipe(appTestScriptModule.getScripts(startOptions)());
}

/**
 * Test vendor scripts
 */
function buildVendorKarmaTestScripts() {
  return gulp.src(mainNpmFiles(), {
      base: process.cwd()
    })
    .pipe(vendorTestScriptModule.getScripts(startOptions)());
}

/**
 * Test vendor scripts
 */
function buildVendorTestScripts() {
  return gulp.src(mainNpmFiles(), {
      base: process.cwd()
    })
    .pipe(vendorTestScriptModule.getScriptsHtml(startOptions)());
}

function buildVendorKarmaTestScriptsAndCopy(options) {
  return buildVendorKarmaTestScripts()
    .pipe(gulp.dest('.'));
}

function buildVendorTestScriptsAndCopy(options) {
  var dest = getDestination(options);
  return buildVendorTestScripts()
    .pipe(gulp.dest(dest));
}

function buildStyles(options) {
  var minimal = isMinimal(options);
  var lessStream = gulp.src(stylePath.lessStyles)
    .pipe(less());

  function transformFilepath(filepath) {
    return '@import "' + filepath + '";';
  }

  var injectAppOptions = {
    transform: transformFilepath,
    starttag: '// inject:sass',
    endtag: '// endinject',
    addRootSlash: false
  };

  var injectAppFiles = gulp.src([stylePath.scssStyles, '!app/styles/main.scss'], {
      read: false
    })
    .pipe(order([
      'global.scss',
      '*'
    ]));

  var scssStream = gulp.src(['app/styles/main.scss'])
    .pipe(inject(series(vendorSCSSStyles(options), injectAppFiles), injectAppOptions))
    .pipe(sass().on('error', sass.logError));

  var cssStream = gulp.src(stylePath.cssStyles);

  return merge(vendorCSSStyles(options), lessStream, scssStream, cssStream)
    .pipe(gulpPostcss([cssdeclsort({
      order: 'smacss'
    })]))
    .pipe(gulpif(minimal, stripCssComments()))
    .pipe(gulpif(minimal, sourcemaps.init()))
    .pipe(gulpif(minimal, cleanCSS()))
    .pipe(gulpif(minimal, sourcemaps.write()))
    .pipe(gulpif(minimal, concat('app.css')))
    .pipe(urlAdjuster({
      replace: function(url) {
        return '../resource/' + url.replace(new RegExp('^.+\/'), '');
      }
    }))
    .pipe(gulp.dest('css'));
}

function buildStylesAndCopy(options) {
  var dest = getDestination(options);
  return buildStyles(options)
    .pipe(gulp.dest(dest + '/css'));
}

function buildFonts(options) {
  var addFonts = isAddFonts(options);
  return appFonts()
    .pipe(gulpif(addFonts, getAddFonts(options)))
    .pipe(rename({
      dirname: ''
    }))
    .pipe(gulp.dest('resource'));
}

function buildFontsAndCopy(options) {
  var dest = getDestination(options);
  return buildFonts(options)
    .pipe(gulp.dest(dest + '/resource'));
}

function buildViews(options) {
  var dest = getDestination(options);
  return appViews()
    .pipe(inject(series(buildVendorScripts(options), buildScripts(options), buildStyles(options)), {
      ignorePath: dest,
      addRootSlash: false
    }))
    .pipe(gulp.dest(dest));
}

function buildImages(options) {
  return appImages()
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('resource'));
}

function buildImagesAndCopy(options) {
  var dest = getDestination(options);
  return buildImages(options)
    .pipe(gulp.dest(dest + '/resource'));
}

function buildIcon(options) {
  return appIcon();
}

function buildIconAndCopy(options) {
  var dest = getDestination(options);
  return buildIcon(options)
    .pipe(gulp.dest(dest));
}

function buildDocs(options) {
  var docOptions = {
    scripts: getDocPaths(options),
    html5Mode: true,
    editExample: false
  };

  return appScripts()
    .pipe(ngdocs.process(docOptions))
    .pipe(removeLines({
      'filters': ['js/angular.min.js']
    }))
    .pipe(removeLines({
      'filters': ['js/angular-animate.min.js']
    }));
}

function buildDocsAndCopy(options) {
  var dest = getDestination(options);
  return buildDocs(options)
    .pipe(gulp.dest(dest));
}

function vendorCSSStyles(options) {
  var addCss = isAddCss();

  return gulp.src(styleNpmFiles())
    .pipe(filter('**/*.css'))
    .pipe(gulpif(addCss, !addCss || addsrc(getAddCss())));
}

function vendorSCSSStyles(options) {
  var addScss = isAddScss();

  return gulp.src(styleNpmFiles())
    .pipe(filter('**/*.scss'))
    .pipe(gulpif(addScss, !addScss || addsrc(getAddScss())));
}

/**
 * Test preview elements
 */
function mochaTestScripts() {
  return gulp.src([]
      .concat('node_modules/mocha/mocha.js')
      .concat('node_modules/chai/chai.js')
      .concat('node_modules/sinon/pkg/sinon.js')
    )
    .pipe(order([
      'mocha.js',
      'chai.js',
      '*'
    ]));
}

function mochaTestStyles() {
  return gulp.src([]
    .concat('node_modules/mocha/mocha.css')
  );
}

/**
 * Build test elements
 */
function buildMochaTestScripts(options) {
  var dest = getDestination(options);
  return mochaTestScripts()
    .pipe(gulp.dest('js'));
}

/**
 * Build test elements
 */
function buildMochaTestScriptsAndCopy(options) {
  var dest = getDestination(options);
  return buildMochaTestScripts(options)
    .pipe(gulp.dest(dest + '/js'));
}

function buildMochaTestStyle(options) {
  return mochaTestStyles()
    .pipe(gulp.dest('css'));
}

function buildMochaTestStyleAndCopy(options) {
  var dest = getDestination(options);
  return buildMochaTestStyle(options)
    .pipe(gulp.dest(dest + '/css'));
}

function buildAppTestScripts(options) {
  return appTestsScripts()
    .pipe(gulp.dest('test'));
}

function buildAppTestScriptsAndCopy(options) {
  var dest = getDestination(options);
  return buildAppTestScripts(options)
    .pipe(gulp.dest(dest + '/test'));
}

function buildIndexTest(options) {
  var dest = getDestination(options);
  return gulp.src(paths.testHtml)
    .pipe(inject(series(buildMochaTestScripts(options), buildMochaTestStyle(options)), {
      starttag: '<!-- mocha:{{ext}} -->',
      ignorePath: dest,
      addRootSlash: false
    }))
    .pipe(inject(series(buildVendorTestScripts(options), buildScripts(options), buildAppTestScripts(options)), {
      ignorePath: dest,
      addRootSlash: false
    }));
}

function updateKarmaFile(options) {
  var configFile = getConfigFile(options);
  return gulp.src(configFile)
    .pipe(inject(series(buildVendorKarmaTestScripts(options), appScripts(), appTestsScripts()), {
      starttag: 'files: [',
      endtag: '],',
      relative: true,
      transform: function(filepath, file, i, length) {
        return '"' + filepath + '"' + (i + 1 < length ? ',' : '');
      }
    }))
    .pipe(gulp.dest('.'));
}

function register(_gulp, _options) {
  gulp = _gulp;
  startOptions = _options;
}

module.exports = {
  register: register,
  appScripts: appScripts,
  appStyles: appStyles,
  appViews: appViews,
  appImages: appImages,
  appFonts: appFonts,
  appTestsScripts: appTestsScripts,
  buildScripts: buildScriptsAndCopy,
  buildStyles: buildStylesAndCopy,
  buildFonts: buildFontsAndCopy,
  buildViews: buildViews,
  buildImages: buildImagesAndCopy,
  buildIcon: buildIconAndCopy,
  buildDocs: buildDocsAndCopy,
  buildIndexTest: buildIndexTest,
  buildAppTestScripts: buildAppTestScriptsAndCopy,
  buildVendorScripts: buildVendorScriptsAndCopy,
  buildVendorTestScripts: buildVendorTestScriptsAndCopy,
	buildVendorKarmaTestScripts: buildVendorKarmaTestScriptsAndCopy,
  buildMochaTestScripts: buildMochaTestScriptsAndCopy,
  buildMochaTestStyle: buildMochaTestStyleAndCopy,
  updateKarmaFile: updateKarmaFile,
  paths: paths
};
