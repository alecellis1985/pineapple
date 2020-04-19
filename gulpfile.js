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
//var apiFolder = 'php';
var imgFolder = rootFile + 'img';
var distResFolder = rootFile === '' ? '' : '/' + rootFile;
var minifier = require('gulp-uglify/minifier');
var dev = 'dev';
var prod = 'dist';
var fontsFolder = rootFile + 'fonts';
var currentEnv;
var isDev = false;
//var imageminWebp = require('imagemin-webp');
//var imageminJpegtran = require('imagemin-jpegtran');
//var jp2 = require('gulp-jpeg-2000');


/*NEXT GEN IMGS*/
//function images(folder_path) {
//    return gulp.src(folder_path + '/*.jpg')
//        .pipe(imagemin(
//            [imageminJpegtran({ progressive: true }),
//                jxr(['-truecolours', '-tile', '32']),
//                jp2(),
//                imageminWebp()
//            ],
//            { verbose: true }
//        ))
//        .pipe(gulp.dest(paths.images.dest));
//}
//function image_loop() {
//    fs.readdir(paths.images.src, function (err, folders) {
//        for (var i = 0; i < folders.length; i++) {
//            var folder_path = path.join(paths.images.src, folders[i]);
//            images(folders[i]);
//        }
//    });
//}


function checkCurrentEnv() {
    if (isDev === true) {
        currentEnv = dev;
    } else {
        currentEnv = prod;
    }
}

gulp.task('watch', function () {
    //gulp.watch(rootFile + 'scss/**/*.scss', ['sass']);
    gulp.watch(rootFile + 'css/**/*.css', ['useref', 'index']);
    gulp.watch(rootFile + 'js/**/*', ['useref', 'index']);
    gulp.watch(rootFile + '*.html', ['templates', 'index']);
});

//BUILDS

gulp.task('build', function (callback) {
    isDev = true;
    runSequence('clean', 'sass', 'css', 'notToMinifyJs',
        ['useref', 'images', 'vendor', 'templates'], 'index', 'cacheBuster',
        callback
    );
});

gulp.task('buildProd', function (callback) {
    isDev = false;
    runSequence('clean:dist', 'sassProd', 'notToMinifyJs',
        ['useref', 'images', 'fonts', 'templates', 'templates2'], 'cacheBuster',
        callback
    );
});

//SERVE

gulp.task('buildserve', function (callback) { //Build and serve for development purposes.
    isDev = true;
    runSequence('build', ['serve', 'watch'],
        callback
    );
});

gulp.task('default', function (callback) {
    runSequence(['sass', 'browserSync'], 'watch',
        callback
    );
});


//STYLES

gulp.task('sass', function () {
    checkCurrentEnv();
    return gulp.src(rootFile + 'scss/**/*.scss') // Gets all files ending with .scss in app/scss and children dirs
        .pipe(sass().on('error', sass.logError)) // Passes it through a gulp-sass, log errors to console
        .pipe(gulp.dest(rootFile + `${currentEnv}/css/`)) // Outputs it in the css folder
        .pipe(browserSync.reload({// Reloading with Browser Sync
            stream: true
        }));
});

gulp.task('sassProd', function () {
    return gulp.src(rootFile + 'scss/**/*.scss') // Gets all files ending with .scss in app/scss and children dirs
        .pipe(sass().on('error', sass.logError)) // Passes it through a gulp-sass, log errors to console
        .pipe(gulp.dest(rootFile + 'css')) // Outputs it in the css folder
        .pipe(browserSync.reload({// Reloading with Browser Sync
            stream: true
        }));
});

gulp.task('fonts', function () {
    return gulp.src('vendor/fonts/**/*')
        .pipe(gulp.dest('dist/' + rootFile + 'fonts'));
});

gulp.task('css', function () {
    checkCurrentEnv();
    return gulp.src(rootFile + 'css/**/*.css') // Gets all files ending with .css in app/scss and children dirs
        .pipe(gulp.dest(`${currentEnv}/css/`)) // Outputs it in the css folder
        .pipe(browserSync.reload({// Reloading with Browser Sync
            stream: true
        }));
});

//ASSETS

gulp.task('assets', function (callback) {
    runSequence([`images`, 'vendor'],
        callback
    );
});

gulp.task('vendor', function () { //Copy vendor files (Fonts, CSS, Images...)
    checkCurrentEnv();
    return gulp.src(['vendor/**/*'])
        .pipe(gulp.dest(`${currentEnv}/vendor`));
});

gulp.task('images', function () {
    checkCurrentEnv();
    if (isDev === false) {
        return gulp.src(imgFolder + '/**/*.+(png|jpg|jpeg|gif|svg|PNG)')
            .pipe(imagemin({
                interlaced: true
            })).pipe(gulp.dest(`${currentEnv}/` + imgFolder));
    } else {
        return gulp.src(imgFolder + '/**/*.+(png|jpg|jpeg|gif|svg|PNG)')
            .pipe(gulp.dest(`${dev}/` + imgFolder));
    }
});

//HTML
gulp.task('templates', function () {
    checkCurrentEnv();//**/*
    return gulp.src(['*.html', '!node_modules', '!/node_modules', '!index.html'])
        .pipe(gulp.dest(`${currentEnv}/`));
});

gulp.task('templates2', function () {
    checkCurrentEnv();//**/*
    return gulp.src(['js/**/*.html'])
        .pipe(gulp.dest(`${currentEnv}/js/`));
});

gulp.task('index', function () { //Update index file.
    checkCurrentEnv();
    return gulp.src(['index.html'])
        .pipe(gulp.dest(`${currentEnv}/`));
});

//JS FILES

gulp.task('notToMinifyJs', function () {
    checkCurrentEnv();
    if (isDev === false) {
        return gulp.src(['app/js/map.js'])
            .pipe(gulp.dest(`dist/app/js/`));
    }
});

gulp.task('useref', function () {
    checkCurrentEnv();
    if (isDev === false) {
        return gulp.src(['index.html'])
            .pipe(useref())
            .pipe(gulpIf('*.js', uglify()))
            .pipe(gulpIf('*.css', cssnano({ zindex: false })))
            .pipe(gulp.dest(`${currentEnv}`));
    } else {
        runSequence('index');
        return gulp.src(['js/**/*'])
            .pipe(useref())
            .pipe(gulp.dest(`${currentEnv}/js`));
    }
});

//CLEANING
gulp.task('clean', function () { //Clean folder ignoring images and fonts.
    checkCurrentEnv();
    return del.sync([`${currentEnv}/**/*`, `!${currentEnv}/` + imgFolder + '/*', `!${currentEnv}/` + 'vendor' + '/**/*']);
});

gulp.task('clean:dist', function () {
    return del.sync(['dist/**/*', '!dist/' + imgFolder, '!dist/' + imgFolder + '/**/*']);
});


gulp.task('cacheBuster', [], function () {
    checkCurrentEnv();
    return gulp.src([`${currentEnv}/**/*.html`])
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(cacheBuster())
        .pipe(gulp.dest(`${currentEnv}/`));
});


gulp.task('cache:clear', function (callback) {
    return cache.clearAll(callback);
});

//OTHER

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: 'app'
        }
    });
});

/** Configuration **/
var user = process.env.FTP_USER;
var password = process.env.FTP_PWD;
var host = '107.180.41.238';
var port = 21;
checkCurrentEnv();
var localFilesGlob = [`${currentEnv}/**/*`];

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
    return gulp.src(localFilesGlob, { base: '.', buffer: false })
        .pipe(conn.newer(remoteFolder)) // only upload newer files 
        .pipe(conn.dest(remoteFolder));
});

// Serve Task
gulp.task('serve', function () {
    checkCurrentEnv();
    gulp.src(currentEnv)
        .pipe(webserver({
            livereload: true,
            open: true,
            port: 9089,
            directoryListing: {
                enable: true,
                path: '/index.html'
            },
            fallback: `./${currentEnv}/index.html`
        }));
});