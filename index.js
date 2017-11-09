'use strict'

const gulp = require('gulp');
const rename = require('gulp-rename');
const gulpif = require('gulp-if');
const concat = require('gulp-concat');
const addsrc = require('gulp-add-src');
const mainNpmFiles = require('gulp-main-npm-files');
const styleNpmFiles = require('gulp-style-npm-files');
const fontNpmFiles = require('gulp-font-npm-files');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const stripCssComments = require('gulp-strip-css-comments');
const order = require('gulp-order');
const angularFilesort = require('gulp-angular-filesort');
const babel = require('gulp-babel');
const series = require('stream-series');
const inject = require('gulp-inject');
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');

const paths = {
    appScripts: ['app/scripts/**/*.js'],
    appStyles: ['app/styles/*.*css', '!README'],
    appViews: ['app/**/*.html'],
    appIcon: ['app/*.ico'],
    appImages: ['app/images/**/*'],
    appFonts: ['app/fonts/**/*.{eot,svg,ttf,woff,woff2}', '!README'],
    appTests: ['test/**/*.js'],
    testHtml: ['test/test.html']
}

function getOptions(options) {
    return options || {};
}

function isBootstrap(options) {
    return getOptions(options).bootstrap === true;
}

function isSass(options) {
    return getOptions(options).sass === true;
}

function isMinimal(options) {
    return getOptions(options).minimal === true;
}

function getDestination(options) {
    return getOptions(options).dest || 'build';
}

/**
 * Appliation elements
 */
function appScripts() {
    return gulp.src(paths.appScripts)
        .pipe(angularFilesort())
        .pipe(order([
            'main.js',
            '*'
        ]));
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
    return gulp.src(paths.appImages);
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
    return appStyles()
        .pipe(gulpif(isSass(options), sass().on('error', sass.logError)))
        .pipe(gulpif(minimal, sourcemaps.init()))
        .pipe(gulpif(minimal, cleanCSS()))
        .pipe(gulpif(minimal, sourcemaps.write()))
        .pipe(gulpif(minimal, concat('app.css')))
        .pipe(gulp.dest(dest + '/css'));
}

function buildFonts(options) {
    var dest = getDestination(options);
    return appFonts()
        .pipe(rename({
            dirname: ''
        }))
        .pipe(gulp.dest(dest + '/fonts'));
}

function buildViews(options) {
    var dest = getDestination(options);
    return appViews()
        .pipe(inject(series(buildVendorScripts(options), buildScripts(options), buildVendorStyles(options), buildStyles(options)), {
            ignorePath: dest,
            addRootSlash: false
        }))
        .pipe(gulp.dest(dest));
}

function buildImages(options) {
    var dest = getDestination(options);
    return appImages()
        .pipe(cache(imagemin()))
        .pipe(gulp.dest(dest + '/images'));
}

function buildIcon(options) {
    var dest = getDestination(options);
    return appIcon()
        .pipe(gulp.dest(dest));
}

/**
 * Vendor elements
 */
function vendorScripts(options) {
    var bootstrap = isBootstrap(options);
    return gulp.src(mainNpmFiles()
            .concat('!node_modules/**/index.js')
            .concat('node_modules/angular/angular.js')
        )
        .pipe(gulpif(bootstrap, addsrc('node_modules/bootstrap/**/bootstrap.js')))
        .pipe(order([
            'jquery.js',
            'angular.js',
            'angular-ui-router.js',
            'bootstrap.js',
            '*'
        ]));
}

function vendorStyles() {
    return gulp.src(styleNpmFiles());
}

/**
 * Build vendor elements
 */
function buildVendorScripts(options) {
    var minimal = isMinimal(options);
    var dest = getDestination(options);
    return vendorScripts()
        .pipe(gulpif(minimal, babel({
            presets: ['env', 'babili']
        })))
        .pipe(gulpif(minimal, concat('vendors.js')))
        .pipe(gulpif(minimal, uglify()))
        .pipe(gulp.dest(dest + '/js'));
}

function buildVendorStyles(options) {
    var minimal = isMinimal(options);
    var dest = getDestination(options);
    return vendorStyles()
        .pipe(gulpif(isSass(options), sass().on('error', sass.logError)))
        .pipe(stripCssComments())
        .pipe(gulpif(minimal, sourcemaps.init()))
        .pipe(gulpif(minimal, cleanCSS()))
        .pipe(gulpif(minimal, sourcemaps.write()))
        .pipe(gulpif(minimal, concat('vendor.css')))
        .pipe(gulp.dest(dest + '/css'));
}

/**
 * Test preview elements
 */
function mochaTestScripts() {
    return gulp.src([]
            .concat('node_modules/mocha/mocha.js')
            .concat('node_modules/chai/chai.js')
        )
        .pipe(order([
            'mocha.js',
            'chai.js'
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
            '**/*_ctrl_test.js',
            '*'
        ]));
}

/**
 * Test vendor scripts
 */
function vendorTestScripts(options) {
    var bootstrap = isBootstrap(options);
    return gulp.src(mainNpmFiles()
            .concat('!node_modules/**/index.js')
            .concat('node_modules/angular/angular.js')
            .concat('node_modules/angular-mocks/angular-mocks.js')
        )
        .pipe(gulpif(bootstrap, addsrc('node_modules/bootstrap/**/bootstrap.js')))
        .pipe(order([
            'jquery.js',
            'angular.js',
            'angular-ui-router.js',
            'angular-mocks.js',
            'bootstrap.js',
            '*'
        ]));
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
    return vendorTestScripts()
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
        }))
        .pipe(gulp.dest(dest));
}

function updateKarmaFile(options) {

    return gulp.src('karma.conf.js')
        .pipe(inject(series(vendorScripts(options), vendorTestScripts(options), appScripts(), appTestsScripts()), {
            starttag: 'files: [',
            endtag: '],',
            relative: true,
            transform: function(filepath, file, i, length) {
                return '"' + filepath + '"' + (i + 1 < length ? ',' : '');
            }
        }))
        .pipe(gulp.dest('./'));
}

module.exports = {
    appScripts: appScripts,
    appStyles: appStyles,
    appViews: appViews,
    appImages: appImages,
    appFonts: appFonts,
    appTests: appTests,
    buildScripts: buildScripts,
    buildStyles: buildStyles,
    buildFonts: buildFonts,
    buildViews: buildViews,
    buildImages: buildImages,
    buildIcon: buildIcon,
    buildIndexTest: buildIndexTest,
    updateKarmaFile: updateKarmaFile,
    paths: paths
};
