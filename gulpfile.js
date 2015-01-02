var gulp = require('gulp');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');  


gulp.task('default', function(){
  gulp.run('jshint', 'mocha', 'watch-mocha');
});

gulp.task('mocha', function() {
  return gulp.src(['tests/*.js'], { read: false })
    .pipe(mocha({ reporter: 'list' }))
    .on('error', gutil.log);
});

gulp.task('watch-mocha', function() {
    gulp.watch(['app.js', 'public/**/**.js', 'tests/**'], ['jshint', 'mocha']);
});

gulp.task('jshint', function() {  
  return gulp.src(['test/**.js', 'tests/**.js', 'public/**/**.js', '**.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
