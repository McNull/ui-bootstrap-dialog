var gulp = require('gulp');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');

var errorHandler = function (err) {
  notify.onError("Error: <%= error.message %>")(err);
  this.emit('end');
}

gulp.task('scripts', ['templates'], function () {

  var uglify = require('gulp-uglify');
  var wrapper = require('gulp-wrapper');
  var concat = require('gulp-concat');
  var pkg = require('./bower.json');
  var ng = require('gulp-ng-annotate');
  var jshint = require('gulp-jshint');

  var license =
    '/**\n' +
    ' * @license ui-bootstrap-dialog v' + pkg.version + '\n' +
    ' * (c) 2015 Null McNull. https://github.com/McNull\n' +
    ' * License: MIT\n' +
    ' */\n';

  var header = '(function(angular, undefined) {\'use strict\';\n';
  var footer = '})(angular);';

  return gulp.src(['src/ui-bootstrap-dialog.js', 'src/**/*.js', 'tmp/**/*.js'])
    .pipe(plumber({
      errorHandler: errorHandler
    }))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
    .pipe(concat('ui-bootstrap-dialog.min.js'))
    .pipe(ng())
    .pipe(wrapper({
      header: header,
      footer: footer
    }))
    .pipe(uglify())
    .pipe(wrapper({
      header: license
    }))
    .pipe(gulp.dest('dist/'))
    .pipe(notify({
      message: 'Generated \"<%= file.relative %>\"'
    }));

});

gulp.task('templates', function () {

  var tc = require('gulp-angular-templatecache');
  var minHtml = require('gulp-minify-html');

  var TEMPLATE_HEADER = 'dlg.run(["$templateCache", function($templateCache) {';
  var TEMPLATE_FOOTER = '}]);';

  return gulp.src('src/**/*.ng.html')
    .pipe(plumber({
      errorHandler: errorHandler
    }))
    .pipe(minHtml({
      quotes: true
    }))
    .pipe(tc({
      filename: 'ui-bootstrap-dialog-templates.js',
      root: '/ui-bootstrap-dialog/',
      templateHeader: TEMPLATE_HEADER,
      templateFooter: TEMPLATE_FOOTER
    }))
    .pipe(gulp.dest('tmp/'))
    .pipe(notify({
      message: 'Generated \"<%= file.relative %>\"'
    }));

});

gulp.task('watch', ['scripts'], function (cb) {
  gulp.watch(['src/**/*.js', 'tmp/**/*.js', 'src/**/*.ng.html'], ['scripts'])
    .on('change', function (e) {
      console.log('File ' + e.path + ' was ' + e.type + ', running tasks...');
    });
  cb();
});

gulp.task('build', ['scripts']);

gulp.task('default', ['watch']);