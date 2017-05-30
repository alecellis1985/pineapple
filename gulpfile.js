var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var webserver = require('gulp-webserver');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var useref = require('gulp-useref');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var gnf = require('gulp-npm-files');
var gutil = require('gulp-util');
var ftp = require('vinyl-ftp');
var cacheBuster = require('gulp-cache-bust');
var htmlmin = require('gulp-htmlmin');
var rootFile = 'app/';
var apiFolder = 'php';
var imgFolder = 'img';
var distResFolder = rootFile === '' ? '' : '/' + rootFile;
var minifier = require('gulp-uglify/minifier');


gulp.task('watch', function () {
  gulp.watch(rootFile + 'scss/**/*.scss', ['sass']);
  gulp.watch(rootFile + 'css/**/*.css', ['useref']);
  gulp.watch(rootFile + 'js/**/*.js', ['useref']);
  gulp.watch('*.html', ['useref']);
});

gulp.task('build', function (callback) {
  runSequence('clean:dist', 'sass',
  ['useref', 'images', 'fonts'], 'cacheBuster',
  callback
  );
});

gulp.task('default', function (callback) {
  runSequence(['sass', 'browserSync'], 'watch',
  callback
  );
});

gulp.task('api', function () {
  return gulp.src(apiFolder + '/**/*')
  .pipe(gulp.dest('dist/' + apiFolder));
});

gulp.task('templates', function () {
  return gulp.src('resources/widgets/**/*.html')
  .pipe(gulp.dest('dist/resources/widgets'));
});

gulp.task('sass', function () {
  return gulp.src(rootFile + 'scss/**/*.scss') // Gets all files ending with .scss in app/scss and children dirs
  .pipe(sass().on('error', sass.logError)) // Passes it through a gulp-sass, log errors to console
  .pipe(gulp.dest(rootFile + 'css')) // Outputs it in the css folder
  .pipe(browserSync.reload({// Reloading with Browser Sync
    stream: true
  }));
});

gulp.task('useref', function () {
  return gulp.src('*.html')
  .pipe(useref())
  .pipe(gulpIf(rootFile + 'js/**/*.js', uglify()))
  .pipe(gulpIf('*.css', cssnano()))
  .pipe(gulp.dest('dist'));
});

gulp.task('cache:clear', function (callback) {
  return cache.clearAll(callback);
});

gulp.task('clean:dist', function () {
  return del.sync(['dist/**/*', '!dist/' + rootFile + imgFolder, '!dist/' + rootFile + imgFolder + '/**/*']);
});

gulp.task('images', function () {
  return gulp.src(rootFile + imgFolder + '/**/*.+(png|jpg|jpeg|gif|svg|PNG)')
  .pipe(imagemin({
    interlaced: true
  })).pipe(gulp.dest('dist/' + rootFile + imgFolder));
});

gulp.task('fonts', function () {
  return gulp.src(rootFile + 'fonts/**/*')
  .pipe(gulp.dest('dist/' + rootFile + 'fonts'));
});

gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: 'app'
    }
  });
});
//https://blog.dmbcllc.com/using-gulp-to-bundle-minify-and-cache-bust/
gulp.task('cacheBuster', [], function () {
  return gulp.src('dist/index.html')
  .pipe(htmlmin({collapseWhitespace: true,
    removeComments: true}))
  .pipe(cacheBuster())
  .pipe(gulp.dest('dist/'));
});

/** Configuration **/
var user = process.env.FTP_USER;
var password = process.env.FTP_PWD;
var host = '107.180.41.238';
var port = 21;
var localFilesGlob = ['dist/**/*'];

var remoteFolder = '/';

http://loige.co/gulp-and-ftp-update-a-website-on-the-fly/
// helper function to build an FTP connection based on our configuration
function getFtpConnection() {
  return ftp.create({
    host: host,
    port: port,
    user: user,
    password: password,
    parallel: 1,
    log: gutil.log
  });
}

/**
 * Deploy task.
 * Copies the new files to the server
 *
 * Usage: `FTP_USER=someuser FTP_PWD=somepwd gulp ftp-deploy`
 */
gulp.task('ftp-deploy', function () {
  var conn = getFtpConnection();
  return gulp.src(localFilesGlob, {base: '.', buffer: false})
  .pipe(conn.newer(remoteFolder)) // only upload newer files 
  .pipe(conn.dest(remoteFolder));
});

// Copy dependencies to build/node_modules/ 
gulp.task('copyNpmDependenciesOnly', function () {
  gulp.src(gnf(), {base: './'}).pipe(gulp.dest('./dist/popis'));
});

gulp.task('copyAllNpmDependencies', function () {
  gulp.src(gnf(true), {base: './'}).pipe(gulp.dest('./resources/vendor'));
});


// Serve Task
gulp.task('serve', function () {
  gulp.src('dist')
  .pipe(webserver({
    livereload: true,
    open: true,
    port: 9089,
    directoryListing: {
      enable: true,
      path: '/index.html'
    },
    fallback: './dist/index.html'
  }));
});