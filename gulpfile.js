var gulp = require('gulp');
var postcss = require('gulp-postcss');
var less = require('gulp-less');
var webpack = require('gulp-webpack');
var flatten = require('gulp-flatten');
var eslint = require('gulp-eslint');

var autoprefixer = require('autoprefixer');

var processors = [
  autoprefixer({browsers: ['last 4 version']})
];

gulp.task('less', function (type){
  gulp.src('src/style/*.less')
    .pipe(less())
    .pipe(postcss(processors))
    .pipe(gulp.dest('src/style/'))
});

var webpackConfig = require('./webpack.config.js');
webpackConfig.output.path = '';

gulp.task('webpack', function() {
  return gulp.src('src/index.js')
    .pipe( webpack( webpackConfig ) )
    .pipe(gulp.dest('dist/'));
});

gulp.task('lint', () => {
  return gulp.src(['src/**/*.*', 'src/**/**/*.*'])
      .pipe(eslint())
      .pipe(eslint.result(result => {
        // Called for each ESLint result. 
        // console.log('ESLint result: ${result.filePath}');
        // console.log('# Messages: ${result.messages.length}');
        // console.log('# Warnings: ${result.warningCount}');
        // console.log('# Errors: ${result.errorCount}');
      }));
});

gulp.task('copy', function() {
  return gulp.src('./dist/*.*')
    .pipe(flatten())
    .pipe(gulp.dest('../../Scripts/'));
});

gulp.task('copy local', function() {
  return gulp.src('./src/style/local.css')
    .pipe(flatten())
    .pipe(gulp.dest('../../theme/assets/admin/pages/css/'));
});

gulp.task('default', ['less', 'lint', 'webpack', 'copy', 'copy local']);
gulp.watch(['src/**/*.*', 'src/**/**/*.*'], ['less', 'lint', 'webpack', 'copy', 'copy local'], function (){});