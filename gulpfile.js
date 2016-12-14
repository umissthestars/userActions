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

gulp.task('webpack', function() {
  return gulp.src('src/index.js')
    .pipe(webpack( require('./webpack.config.js') ))
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

gulp.task('default', ['less', 'lint', 'webpack', 'copy']);
gulp.watch(['src/**/*.*', 'src/**/**/*.*'], ['less', 'lint', 'webpack', 'copy'], function (){});