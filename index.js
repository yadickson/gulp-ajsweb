'use strict'

const ajsweb = require('./core');
const connect = require('gulp-connect');
const open = require('gulp-open');
const runSequence = require('run-sequence');
const karma = require('karma').Server;
const del = require('del');
const jshint = require("gulp-jshint");
const rename = require("gulp-rename");
const usage = require('gulp-help-doc');
const zip = require('gulp-zip');
const path = require('path');
const sonar = require('gulp-sonar');
const pjson = require(path.join(process.cwd(), 'package.json'));

let dev = true;
let minimal = false;
let dest = 'dist';
let port = 9100;
let karmaPort = 9200;
let browser = 'firefox';
let target = './';
let buildPath = 'build';
let distPath = 'dist';
let testVendor = './test/vendor/';
let sonarServer = 'http://localhost:9000';
let sourceDir = 'app';

function tasks(gulp, options) {

  options = options || {};

  target = options.target || target;
  buildPath = options.buildPath || buildPath;
  distPath = options.distPath || distPath;

  sonarServer = options.sonarServer || sonarServer;
  sourceDir = options.sourceDir || sourceDir;

  options.addpaths = options.addpaths || [];
  options.addtestpaths = options.addtestpaths || [];
  options.excludepaths = options.excludepaths || [];
  options.excludetestpaths = options.excludetestpaths || [];
  options.addcss = options.addcss || [];
  options.addscss = options.addscss || [];
  options.addfonts = options.addfonts || [];
  options.notprocess = options.notprocess || [];
  options.orderBy = options.orderBy || [];

  port = options.port || port;
  karmaPort = options.karmaPort || karmaPort;
  browser = options.browser || browser;

  ajsweb.register(gulp, options);

  /**
   * Clean project.
   *
   * @task {clean}
   * @group {Basic tasks}
   * @order {10}
   */
  gulp.task('clean', () => {
    return new Promise(resolve => {
      runSequence(['clean-all'], ['clean-css-folder'], ['clean-js-folder'], ['clean-resource-folder'], resolve);
    });
  });

  gulp.task('clean-all', () => {
    return del([testVendor, 'build', 'dist', 'coverage', 'reports', '*.tgz', '*.zip', 'docs']);
  });

  gulp.task('clean-css-folder', () => {
    return del('css');
  });

  gulp.task('clean-js-folder', () => {
    return del('js');
  });

  gulp.task('clean-resource-folder', () => {
    return del('resource');
  });

  gulp.task('test-clean', () => {
    return del([testVendor]);
  });

  /**
   * Run sonar.
   *
   * @task {sonar}
   * @group {Basic tasks}
   * @order {8}
   */
  gulp.task('sonar', () => {
    return new Promise(resolve => {
      runSequence(['clean'], ['test'], ['sonar-runner'], resolve);
    });
  });

  gulp.task('sonar-runner', () => {
    var options = {
      sonar: {
        host: {
          url: sonarServer
        },
        projectKey: 'sonar:' + pjson.name + ':' + pjson.version,
        projectName: pjson.name,
        projectVersion: pjson.version,
        sources: sourceDir,
        language: 'js',
        sourceEncoding: 'UTF-8',
        javascript: {
          lcov: {
            reportPath: 'coverage/lcov.info'
          }
        },
        exec: {
          maxBuffer: 1024 * 1024
        }
      }
    };

    return gulp.src('any.js', {
        read: false
      })
      .pipe(sonar(options));
  });

  gulp.task('compile', () => {
    return new Promise(resolve => {
      runSequence(['scripts'], ['styles'], ['jshint'], ['fonts'], ['images'], ['icon'], ['views'], ['vendor'], ['clean-js-folder'], ['clean-css-folder'], ['clean-resource-folder'], resolve);
    });
  });

  gulp.task('zip', () => {
    return gulp.src(dest + '/**')
      .pipe(zip(dest + '.zip'))
      .pipe(gulp.dest('.'));
  });

  /**
   * Build project for develop.
   *
   * @task {build}
   * @group {Basic tasks}
   * @order {1}
   */
  gulp.task('build', () => {
    return new Promise(resolve => {
      minimal = false;
      dest = target + buildPath;
      runSequence(['clean'], ['compile'], ['zip'], resolve);
    });
  });

  /**
   * Dist project for production.
   *
   * @task {dist}
   * @group {Basic tasks}
   * @order {2}
   */
  gulp.task('dist', () => {
    return new Promise(resolve => {
      minimal = true;
      dest = target + distPath;
      runSequence(['clean'], ['compile'], ['zip'], resolve);
    });
  });

  /**
   * Documentation project.
   *
   * @task {docs}
   * @group {Basic tasks}
   * @order {4}
   */
  gulp.task('docs', () => {
    return new Promise(resolve => {
      minimal = true;
      dest = target + 'docs';
      runSequence(['clean'], ['compile'], ['js2docs'], ['zip'], resolve);
    });
  });

  gulp.task('scripts', () => {
    return ajsweb.buildScripts({
        dest: dest,
        minimal: minimal
      })
      .pipe(connect.reload());
  });

  gulp.task('styles', () => {
    return ajsweb.buildStyles({
        dest: dest,
        minimal: minimal
      })
      .pipe(connect.reload());
  });

  gulp.task('jshint', () => {
    return ajsweb.appScripts()
      .pipe(jshint())
      .pipe(jshint.reporter());
  });

  gulp.task('fonts', () => {
    return ajsweb.buildFonts({
        dest: dest,
        minimal: minimal
      })
      .pipe(connect.reload());
  });

  gulp.task('views', () => {
    return ajsweb.buildViews({
        dest: dest,
        minimal: minimal
      })
      .pipe(connect.reload());
  });

  gulp.task('vendor', () => {
    return ajsweb.buildVendorScripts({
      dest: dest,
      minimal: minimal
    });
  });

  gulp.task('test-vendor', () => {
    return ajsweb.buildVendorTestScripts({
      dest: dest,
      minimal: minimal
    });
  });

  gulp.task('test-mocha-vendor', () => {
    return ajsweb.buildMochaTestScripts({
      dest: dest,
      minimal: minimal
    });
  });

  gulp.task('test-mocha-style', () => {
    return ajsweb.buildMochaTestStyle({
      dest: dest,
      minimal: minimal
    });
  });

  gulp.task('images', () => {
    return ajsweb.buildImages({
        dest: dest,
        minimal: minimal
      })
      .pipe(connect.reload());
  });

  gulp.task('icon', () => {
    return ajsweb.buildIcon({
        dest: dest,
        minimal: minimal
      })
      .pipe(connect.reload());
  });

  gulp.task('js2docs', function() {
    return ajsweb.buildDocs({
      dest: dest,
      docpaths: ['vendors.js', 'app.js']
    });
  });

  gulp.task('karma-cnf', () => {
    return ajsweb.updateKarmaFile({
      configFile: 'karma.conf.js',
      dest: testVendor
    });
  });

  gulp.task('karma-server', function (done) {
    new karma({
      configFile: path.join(process.cwd(), 'karma.conf.js'),
      singleRun: true,
      autoWatch: false,
      port: karmaPort
    }, done).start();
  });

  gulp.task('test-scripts', () => {
    return ajsweb.buildAppTestScripts({
        dest: dest,
        minimal: minimal
      })
      .pipe(connect.reload());
  });

  gulp.task('test-jshint', () => {
    return ajsweb.appTestsScripts()
      .pipe(jshint({
        expr: true
      }))
      .pipe(jshint.reporter());
  });

  gulp.task('test-views', () => {
    return ajsweb.buildIndexTest({
        dest: dest,
        minimal: minimal
      })
      .pipe(rename('index.html'))
      .pipe(gulp.dest(target + dest));
  });

  /**
   * Test project.
   *
   * @task {test}
   * @group {Basic tasks}
   * @order {3}
   */
  gulp.task('test', function() {
    return new Promise(resolve => {
      runSequence(['test-clean'], ['jshint'], ['test-jshint'], ['karma-cnf'], ['karma-server'], resolve);
    });
  });

  gulp.task('connect', function() {
    return connect.server({
      port: port,
      root: [dest],
      livereload: true
    });
  });

  gulp.task('open', function() {
    return gulp.src(dest + '/index.html')
      .pipe(open({
        uri: 'localhost:' + port,
        app: browser
      }));
  });

  gulp.task('watch', function() {
    gulp.watch(ajsweb.paths.appScripts, ['scripts', 'jshint', 'clean-js-folder']);
    gulp.watch(ajsweb.paths.appStyles, ['styles', 'clean-css-folder']);
    gulp.watch(ajsweb.paths.appViews, ['views']);
    gulp.watch(ajsweb.paths.appImages, ['images', 'clean-resource-folder']);
    gulp.watch(ajsweb.paths.appFonts, ['fonts', 'clean-resource-folder']);
    gulp.watch(ajsweb.paths.appIcon, ['icons']);
  });

  gulp.task('watchtest', function() {
    gulp.watch(ajsweb.paths.appScripts, ['scripts', 'jshint', 'test-views']);
    gulp.watch(ajsweb.paths.appTests, ['test-scripts', 'test-jshint', 'test-views']);
  });

  /**
   * Run develop application on browser.
   *
   * @task {serve}
   * @group {Advance tasks}
   * @order {11}
   */
  gulp.task('serve', function() {
    return new Promise(resolve => {
      runSequence(['build'], ['connect'], ['watch'], ['open'], resolve);
    });
  });

  /**
   * Run production application on browser.
   *
   * @task {serve:dist}
   * @group {Advance tasks}
   * @order {12}
   */
  gulp.task('serve:dist', function() {
    return new Promise(resolve => {
      runSequence(['dist'], ['connect'], ['open'], resolve);
    });
  });

  /**
   * Run test application on browser.
   *
   * @task {serve:test}
   * @group {Advance tasks}
   * @order {13}
   */
  gulp.task('serve:test', function() {
    return new Promise(resolve => {
      dest = target + buildPath;
      minimal = false;
      runSequence(['clean'], ['scripts'], ['jshint'], ['test-scripts'], ['test-vendor'], ['test-mocha-vendor'], ['test-mocha-style'], ['test-jshint'], ['test-views'], ['connect'], ['watchtest'], ['open'], resolve);
    });
  });

  /**
   * Run docs application on browser.
   *
   * @task {serve:docs}
   * @group {Advance tasks}
   * @order {14}
   */
  gulp.task('serve:docs', function() {
    return new Promise(resolve => {
      runSequence(['docs'], ['connect'], ['open'], resolve);
    });
  });

  /**
   * Prints this help usage.
   *
   * @task {help}
   * @group {Misc}
   * @order {30}
   */
  gulp.task('help', function() {
    return usage(gulp, {
      gulpfile: __dirname + "/index.js",
      emptyLineBetweenTasks: false,
      padding: 2,
      groupPadding: 1,
      lineWidth: 80
    });
  });

  return gulp;
}

module.exports = tasks;
