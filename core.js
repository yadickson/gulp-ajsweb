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

let gulp;
let startOptions = {};

const stylePath = {
  lessStyles: 'app/styles/*.less',
  scssStyles: 'app/styles/*.scss',
  cssStyles: 'app/styles/*.css'
};

const paths = {
  appScripts: ['app/scripts/**/*.js'],
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
 * Appliation elements
 */
function appScripts() {
  return gulp.src(paths.appScripts)
    .pipe(order([
      'main.js',
      '*'
    ]))
    .pipe(resolveDependencies());
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
 * Build appliation elements
 */
function buildScripts(options) {
  var minimal = isMinimal(options);
  var dest = getDestination(options);
  return appScripts()
    .pipe(gulpif(minimal, stripDebug()))
    .pipe(gulpif(minimal, babel({
      presets: ['env', 'minify']
    })))
    .pipe(gulpif(minimal, concat('app.js')))
    .pipe(gulpif(minimal, uglify()))
    .pipe(gulp.dest(dest + '/js'));
}

function buildStyles(options) {
  var minimal = isMinimal(options);
  var dest = getDestination(options);
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
    .pipe(gulp.dest(dest + '/css'));
}

function buildFonts(options) {
  var dest = getDestination(options);
  var addFonts = isAddFonts(options);
  return appFonts()
    .pipe(gulpif(addFonts, getAddFonts(options)))
    .pipe(rename({
      dirname: ''
    }))
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
  var dest = getDestination(options);
  return appImages()
    .pipe(cache(imagemin()))
    .pipe(gulp.dest(dest + '/resource'));
}

function buildIcon(options) {
  var dest = getDestination(options);
  return appIcon()
    .pipe(gulp.dest(dest));
}

function buildDocs(options) {
  var dest = getDestination(options);
  var options = {
    scripts: getDocPaths(options),
    html5Mode: true,
    editExample: false
  };

  return appScripts()
    .pipe(ngdocs.process(options))
    .pipe(removeLines({
      'filters': ['js/angular.min.js']
    }))
    .pipe(removeLines({
      'filters': ['js/angular-animate.min.js']
    }))
    .pipe(gulp.dest(dest))
}

function processVendor(stream, file) {

      var basepath = path.normalize(__dirname + path.sep + '..');
      var filename = file.path.replace(basepath, '').split(path.sep)[1];
      var process = getNotProcess().indexOf(filename) === -1;

        return stream
        .pipe(gulpif(process, browserify({
          insertGlobals: false,
          global: false,
          debug: false
        })))
        .pipe(concat(filename + '.js'));
}

/**
 * Vendor elements
 */
function vendorScripts(options) {
  var addPaths = isAddPaths();
  var exclude = isExcludePaths();

  return gulp.src(mainNpmFiles())
    .pipe(gulpif(exclude, filter(['**'].concat(getExcludePaths()))))
    .pipe(gulpif(addPaths, !addPaths || addsrc(getAddPaths())))
    .pipe(flatmap(processVendor))
    .pipe(order(getOrderBy().concat(['*'])));
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
 * Build vendor elements
 */
function buildVendorScripts(options) {
  var minimal = isMinimal(options);
  var dest = getDestination(options);
  return vendorScripts(options)
    .pipe(stripDebug())
    .pipe(gulpif(minimal, babel({
      presets: ['env', 'minify']
    })))
    .pipe(gulpif(minimal, concat('vendors.js')))
    .pipe(gulpif(minimal, uglify()))
    .pipe(gulp.dest(dest + '/js'));
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
 * Test application scripts
 */
function appTestsScripts() {
  return gulp.src(paths.appTests)
    .pipe(order([
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
    ]));
}

/**
 * Test vendor scripts
 */
function vendorTestScripts(options) {
  var addPaths = isAddPaths();
  var addTestPaths = isAddTestPaths();
  var exclude = isExcludePaths();

  return gulp.src(mainNpmFiles())
    .pipe(gulpif(exclude, filter(['**'].concat(getExcludePaths()))))
    .pipe(gulpif(addPaths, !addPaths || addsrc(getAddPaths())))
    .pipe(gulpif(addTestPaths, !addTestPaths || addsrc(getAddTestPaths())))
    .pipe(flatmap(processVendor))
    .pipe(order(getOrderBy().concat(['*'])));
}

/**
 * Build test elements
 */
function buildMochaTestScripts(options) {
  var dest = getDestination(options);
  return mochaTestScripts()
    .pipe(gulp.dest(dest + '/js'));
}

function buildMochaTestStyle(options) {
  var dest = getDestination(options);
  return mochaTestStyles()
    .pipe(gulp.dest(dest + '/css'));
}

function buildAppTestScripts(options) {
  var dest = getDestination(options);
  return appTestsScripts()
    .pipe(gulp.dest(dest + '/test'));
}

function buildVendorTestScripts(options) {
  var dest = getDestination(options);
  return vendorTestScripts(options)
    .pipe(gulp.dest(dest + '/js'));
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
    .pipe(inject(series(buildVendorTestScripts(options), appScripts(), appTestsScripts()), {
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
  buildScripts: buildScripts,
  buildStyles: buildStyles,
  buildFonts: buildFonts,
  buildViews: buildViews,
  buildImages: buildImages,
  buildIcon: buildIcon,
  buildDocs: buildDocs,
  buildIndexTest: buildIndexTest,
  buildAppTestScripts: buildAppTestScripts,
  updateKarmaFile: updateKarmaFile,
  paths: paths
};
