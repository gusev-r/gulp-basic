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
var del = require('del');
var autoprefixer = require('gulp-autoprefixer');

// clean distribution directories: ALL
gulp.task('clean', function(callback) {
  del('dist');
  return cache.clearAll(callback);
});

// clean distribution directories: except dist/images
gulp.task('clean:dist', function() {
  return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});


// synchronize with browser
gulp.task('browserSync', function() {
	browserSync({
		server: {
			baseDir: 'dist'
		},
	});
});

// Optimizing CSS and JavaScript 
gulp.task('useref', function() {
  return gulp.src('app/*.html')
//    .pipe(useref())
//    .pipe(gulpIf('*.js', uglify()))
//    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({ // Reloading with Browser Sync
      stream: true
    }));
});

// optimization image
gulp.task('images', function(){
  return gulp.src('./app/img/**/*.+(png|jpg|jpeg|gif|svg)')
  // кэширование изображений, прошедших через imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/img'));
});

// compile less
gulp.task('less', function(){
    gulp.src('./app/less/incLess.less')
        .pipe(sourcemaps.init())
        .pipe(less())
		.pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write())
		.pipe(rename('main.min.css'))
        .pipe(gulp.dest('./dist/css'))
		.pipe(browserSync.reload({stream: true}));
});

// default watcher
gulp.task('watch', function(){
    gulp.watch("./app/less/*.less", ['browserSync', 'less']);
	gulp.watch('app/*.html', ['useref']);
});

// Build 
// ---------------
gulp.task('default', function(callback) {
  runSequence('build',['browserSync'], 'watch',
    callback
  )
});

gulp.task('build', function(callback) {
  runSequence(
    'clean:dist',
    'less',
    ['useref', 'images'],
    callback
  )
})