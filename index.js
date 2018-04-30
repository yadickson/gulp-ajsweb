'use strict'

const ajsweb = require('./core');
const connect = require('gulp-connect');
const open = require('gulp-open');
const runSequence = require('run-sequence');
const karma = require('karma').Server;
const del = require('del');
const jshint = require("gulp-jshint");
const rename = require("gulp-rename");

let dev = true;
let minimal = false;
let dest = 'dist';
let port = 9100;

function tasks(gulp, options) {

  options = options || {};

  options.addpaths = options.addpaths || [];
  options.addtestpaths = options.addtestpaths || [];
  options.excludepaths = options.excludepaths || [];
  options.addcss = options.addcss || [];
  options.addscss = options.addscss || [];
  options.addfonts = options.addfonts || [];
  options.orderBy = options.orderBy || [];

  port = options.port || 9100;

  ajsweb.register(gulp, options);

  gulp = require('gulp-help')(gulp);

  gulp.task('clean', 'Clean project', () => {
    return del(['build', 'dist', 'coverage', 'reports', '*.tgz', '*.zip', 'docs']);
  });

  gulp.task('compile', false, ['scripts', 'styles', 'jshint', 'fonts', 'images', 'icon', 'views'], () => {});

  gulp.task('build', 'Build project for develop', () => {
    return new Promise(resolve => {
      minimal = false;
      dest = 'build';
      runSequence(['clean'], ['compile'], resolve);
    });
  });

  gulp.task('dist', 'Dist project for production', () => {
    return new Promise(resolve => {
      minimal = true;
      dest = 'dist';
      runSequence(['clean'], ['compile'], resolve);
    });
  });

  gulp.task('docs', false, () => {
    return new Promise(resolve => {
      minimal = true;
      dest = 'docs';
      runSequence(['clean'], ['compile'], ['js2docs'], resolve);
    });
  });

  gulp.task('scripts', false, () => {
    return ajsweb.buildScripts({
        dest: dest,
        minimal: minimal
      })
      .pipe(connect.reload());
  });

  gulp.task('styles', false, () => {
    return ajsweb.buildStyles({
        dest: dest,
        minimal: minimal
      })
      .pipe(connect.reload());
  });

  gulp.task('jshint', false, () => {
    return ajsweb.appScripts()
      .pipe(jshint())
      .pipe(jshint.reporter());
  });

  gulp.task('fonts', false, () => {
    return ajsweb.buildFonts({
        dest: dest,
        minimal: minimal
      })
      .pipe(connect.reload());
  });

  gulp.task('views', false, () => {
    return ajsweb.buildViews({
        dest: dest,
        minimal: minimal
      })
      .pipe(connect.reload());
  });

  gulp.task('images', false, () => {
    return ajsweb.buildImages({
        dest: dest,
        minimal: minimal
      })
      .pipe(connect.reload());
  });

  gulp.task('icon', false, () => {
    return ajsweb.buildIcon({
        dest: dest,
        minimal: minimal
      })
      .pipe(connect.reload());
  });

  gulp.task('js2docs', false, function() {
    return ajsweb.buildDocs({
      dest: dest,
      docpaths: ['vendors.js', 'app.js']
    });
  });

  gulp.task('karma-cnf', false, () => {
    return ajsweb.updateKarmaFile({
      configFile: 'karma.conf.js',
      dest: '.'
    });
  });

  gulp.task('karma-server', false, () => {
    return new karma({
      configFile: __dirname + '/../../karma.conf.js',
      singleRun: true
    }).start();
  });

  gulp.task('testHtml', false, () => {
    return ajsweb.buildIndexTest({
        dest: dest,
        minimal: minimal
      })
      .pipe(rename('index.html'))
      .pipe(gulp.dest(dest));
  });

  gulp.task('test', 'Run test project', function() {
    return new Promise(resolve => {
      runSequence(['karma-cnf'], ['build'], ['testHtml'], ['karma-server'], resolve);
    });
  });

  gulp.task('connect', false, function() {
    return connect.server({
      port: port,
      root: [dest],
      livereload: true
    });
  });

  gulp.task('open', false, function() {
    return gulp.src(dest + '/index.html')
      .pipe(open({
        uri: 'localhost:' + port,
        app: 'firefox'
      }));
  });

  gulp.task('watch', false, function() {
    gulp.watch(ajsweb.paths.appScripts, ['scripts', 'jshint']);
    gulp.watch(ajsweb.paths.appStyles, ['styles']);
    gulp.watch(ajsweb.paths.appViews, ['views']);
    gulp.watch(ajsweb.paths.appImages, ['images']);
    gulp.watch(ajsweb.paths.appFonts, ['fonts']);
    gulp.watch(ajsweb.paths.appIcon, ['icons']);
  });

  gulp.task('watchtest', false, function() {
    gulp.watch(ajsweb.paths.appTests, ['scripts', 'jshint', 'testHtml']);
  });

  gulp.task('serve:build', 'Run develop application on server http://localhost:' + port, function() {
    return new Promise(resolve => {
      runSequence(['build'], ['connect'], ['watch'], ['open'], resolve);
    });
  });

  gulp.task('serve:dist', 'Run product application on server http://localhost:' + port, function() {
    return new Promise(resolve => {
      runSequence(['dist'], ['connect'], ['open'], resolve);
    });
  });

  gulp.task('serve:test', 'Run tests on server http://localhost:' + port, function() {
    return new Promise(resolve => {
      runSequence(['karma-cnf'], ['build'], ['testHtml'], ['connect'], ['watch'], ['watchtest'], ['open'], resolve);
    });
  });

  gulp.task('serve:docs', 'Run documentation application on server http://localhost:' + port, function() {
    return new Promise(resolve => {
      runSequence(['docs'], ['connect'], ['open'], resolve);
    });
  });

  return gulp;
}

module.exports = tasks;
