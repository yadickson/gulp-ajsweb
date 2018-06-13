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

let dev = true;
let minimal = false;
let dest = 'dist';
let port = 9100;
let browser = 'firefox';
let target = './';

function tasks(gulp, options) {

  options = options || {};

  target = options.target || './';
  options.addpaths = options.addpaths || [];
  options.addtestpaths = options.addtestpaths || [];
  options.excludepaths = options.excludepaths || [];
  options.addcss = options.addcss || [];
  options.addscss = options.addscss || [];
  options.addfonts = options.addfonts || [];
  options.notprocess = options.notprocess || [];
  options.orderBy = options.orderBy || [];

  port = options.port || port;
  browser = options.browser || browser;

  ajsweb.register(gulp, options);

  /**
   * Clean project.
   *
   * @task {clean}
   * @group {Basic tasks}
   * @order {5}
   */
  gulp.task('clean', () => {
    return del(['build', 'dist', 'coverage', 'reports', '*.tgz', '*.zip', 'docs']);
  });

  gulp.task('compile', () => {
    return new Promise(resolve => {
      runSequence(['scripts'], ['styles'], ['jshint'], ['fonts'], ['images'], ['icon'], ['views'], resolve);
    });
  });

  gulp.task('zip', () => {
    return gulp.src(dest + '/**')
      .pipe(zip(dest + '.zip'))
      .pipe(gulp.dest(target));
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
      dest = target + 'build';
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
      dest = target + 'dist';
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
        dest: target + dest,
        minimal: minimal
      })
      .pipe(connect.reload());
  });

  gulp.task('styles', () => {
    return ajsweb.buildStyles({
        dest: target + dest,
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
        dest: target + dest,
        minimal: minimal
      })
      .pipe(connect.reload());
  });

  gulp.task('views', () => {
    return ajsweb.buildViews({
        dest: target + dest,
        minimal: minimal
      })
      .pipe(connect.reload());
  });

  gulp.task('images', () => {
    return ajsweb.buildImages({
        dest: target + dest,
        minimal: minimal
      })
      .pipe(connect.reload());
  });

  gulp.task('icon', () => {
    return ajsweb.buildIcon({
        dest: target + dest,
        minimal: minimal
      })
      .pipe(connect.reload());
  });

  gulp.task('js2docs', function() {
    return ajsweb.buildDocs({
      dest: target + dest,
      docpaths: ['vendors.js', 'app.js']
    });
  });

  gulp.task('karma-cnf', () => {
    return ajsweb.updateKarmaFile({
      configFile: 'karma.conf.js',
      dest: target + 'build'
    });
  });

  gulp.task('karma-server', () => {
    return new karma({
      configFile: __dirname + '/../../karma.conf.js',
      singleRun: true
    }).start();
  });

  gulp.task('test-scripts', () => {
    return ajsweb.buildAppTestScripts({
        dest: target + dest,
        minimal: minimal
      })
      .pipe(connect.reload());
  });

  gulp.task('test-jshint', () => {
    return ajsweb.appTestsScripts()
      .pipe(jshint({expr: true}))
      .pipe(jshint.reporter());
  });

  gulp.task('test-views', () => {
    return ajsweb.buildIndexTest({
        dest: target + dest,
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
      runSequence(['clean'], ['jshint'], ['test-jshint'], ['karma-cnf'], ['karma-server'], resolve);
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
    gulp.watch(ajsweb.paths.appScripts, ['scripts', 'jshint']);
    gulp.watch(ajsweb.paths.appStyles, ['styles']);
    gulp.watch(ajsweb.paths.appViews, ['views']);
    gulp.watch(ajsweb.paths.appImages, ['images']);
    gulp.watch(ajsweb.paths.appFonts, ['fonts']);
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
      dest = target + 'build';
      minimal = false;
      runSequence(['clean'], ['scripts'], ['jshint'], ['test-scripts'], ['test-jshint'], ['test-views'], ['connect'], ['watchtest'], ['open'], resolve);
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
