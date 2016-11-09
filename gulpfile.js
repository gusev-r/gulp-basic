var path = require('path');
var gulp = require('gulp');
var less = require('gulp-less');
var cleanCSS = require('gulp-clean-css');
var concatCss = require('gulp-concat-css');
var sourcemaps = require('gulp-sourcemaps');

// Действия по умолчанию
gulp.task('less', function(){
    gulp.src('./less/incLess.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(cleanCSS())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./css'));
});

// Действия по умолчанию
gulp.task('default', function(){
    gulp.run('less');

// Отслеживаем изменения в файлах
    gulp.watch("./less/*.less", function(event){
        gulp.run('less');
    });
});