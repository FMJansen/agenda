// Include gulp
import gulp from 'gulp';

// Include plugins
import log from 'fancy-log';
import colors from 'ansi-colors';

import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';

import plumber from 'gulp-plumber';
import * as sass from 'sass';
import gulpSass from 'gulp-sass';
const usingSass = gulpSass(sass);
import sourcemaps from 'gulp-sourcemaps';
import prefix from 'gulp-autoprefixer';

// Include browsersync
import browserSyncImport from 'browser-sync'
var browserSync = browserSyncImport.create();

// Paths
var src = 'src/';
var dest = 'static/';



// Concatenate & minify JS
gulp.task('scripts', function() {
    return gulp.src(src + 'js/*.js')
        .pipe(plumber(function(error) {
            log(colors.red(error.message));
            this.emit('end');
        }))
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(dest + 'js'));
});

// Concatenate & sourcemap JS
gulp.task('scriptsDev', function() {
    return gulp.src(src + 'js/*.js')
        .pipe(plumber(function(error) {
            log(colors.red(error.message));
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(concat('main.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dest + 'js'));
});



// Process & compress SCSS
gulp.task('sass', function() {
    return gulp.src(src + 'scss/main.scss')
        .pipe(plumber(function(error) {
            log(colors.red(error.message));
            this.emit('end');
        }))
        .pipe(usingSass({style: 'compressed'}).on('error', usingSass.logError))
        .pipe(prefix())
        .pipe(rename('main.css'))
        .pipe(gulp.dest(dest + 'css'));
});

// Process & sourcemap SCSS
gulp.task('sassDev', function() {
    return gulp.src(src + 'scss/main.scss')
        .pipe(plumber(function(error) {
            log(colors.red(error.message));
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(usingSass().on('error', usingSass.logError))
        .pipe(sourcemaps.write())
        .pipe(rename('main.css'))
        .pipe(gulp.dest(dest + 'css'))
        .pipe(browserSync.stream());
});

// Copy SCSS
gulp.task('copy-scss', function() {
    return gulp.src(src + 'scss/*.scss')
        .pipe(gulp.dest(dest + 'css'));
});

// Copy fonts
gulp.task('copy-fonts', function() {
    return gulp.src(src + 'fonts/*', { encoding: false })
        .pipe(gulp.dest(dest + 'fonts'));
});



// Static Server + watching scss/html/js files
gulp.task('serve', function() {

    browserSync.init({
        files: ['_site/**'],
        port: 3000,
        server: {
            index: 'index.html'
        }
    });

    gulp.watch("src/scss/*.scss", gulp.series('sassDev'));
    gulp.watch("*.html").on('change', browserSync.reload);
    gulp.watch("*.md").on('change', browserSync.reload);
    gulp.watch("src/js/*.js", gulp.series('scriptsDev'));
});



// Default task: serve with browserSync
gulp.task('default',
    gulp.series(
        'serve',
        gulp.parallel('sassDev', 'scriptsDev', 'copy-scss')
    )
);



// Build task: everything minified only
gulp.task('build', gulp.parallel('scripts', 'sass', 'copy-fonts'));
