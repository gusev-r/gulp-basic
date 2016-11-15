var path = require('path');
var gulp = require('gulp');
var less = require('gulp-less');
var cleanCSS = require('gulp-clean-css');
var concatCss = require('gulp-concat-css');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var rename = require("gulp-rename");
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');

// synchronize with browser
gulp.task('browserSync', function() {
	browserSync({
		server: {
			baseDir: 'dist'
		},
	});
});

// optimization image
gulp.task('images', function(){
  return gulp.src('app/img/**/*.+(png|jpg|jpeg|gif|svg)')
  // кэширование изображений, прошедших через imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/img'))
});

// compile less
gulp.task('less', function(){
    gulp.src('./less/incLess.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(cleanCSS())
        .pipe(sourcemaps.write())
		.pipe(rename('main.min.css'))
        .pipe(gulp.dest('./dist/css'))
		.pipe(browserSync.reload({stream: true}));
});

// default watcher
gulp.task('watch', function(){
    gulp.watch("./less/*.less", ['browserSync', 'less'], function(event){
        gulp.run('less');
    });
	gulp.watch('app/*.html', browserSync.reload);
});


gulp.task('default', function(callback) {
  runSequence(['less', 'browserSync'], 'watch',
    callback
  )
});