// Include gulp
var gulp = require('gulp');

// Include plugins
var log = require('fancy-log');

var concat = require('gulp-concat');
var rename = require('gulp-rename');

var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var prefix = require('gulp-autoprefixer');

var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');

// Paths
var src = 'src/';
var dest = 'static/';

 // Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src(src + 'js/*.js')
        .pipe(plumber(function(error) {
            log.error(error.message);
            this.emit('end');
        }))
        .pipe(concat('main.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(dest + 'js'));
});

gulp.task('sass', function() {
    return gulp.src(src + 'scss/*.scss')
        .pipe(plumber(function(error) {
            log.error(error.message);
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(sass({style: 'compressed'}).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(prefix({browsers: ['last 2 version']}))
        .pipe(gulp.dest(dest + 'css'));
});

gulp.task('images', function() {
  return gulp.src(src + 'images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest(dest + 'img'));
});

gulp.task('watch', function() {
   // Watch .js files
  gulp.watch(src + 'js/*.js', ['scripts']);
   // Watch .scss files
  gulp.watch(src + 'scss/*.scss', ['sass']);
   // Watch image files
  gulp.watch(src + 'images/**/*', ['images']);
 });


 // Default Task
gulp.task('default', ['scripts', 'sass', 'images', 'watch']);
// Build task
gulp.task('build', ['scripts', 'sass', 'images']);
