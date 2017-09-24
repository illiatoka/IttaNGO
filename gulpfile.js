var gulp        = require('gulp'),
    gutil       = require('gulp-util'),
    plumber     = require('gulp-plumber'),
    browserSync = require('browser-sync'),
    jade        = require('gulp-jade'),
    sass        = require('gulp-sass'),
    prefix      = require('gulp-autoprefixer'),
    cp          = require('child_process'),
    cssNano     = require("gulp-cssnano");

var jekyll      = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll',
    messages    = { jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build' };

// Build the Jekyll Site
gulp.task('jekyll-build', function (done) {
  browserSync.notify(messages.jekyllBuild);
  return cp.spawn(jekyll, ['build'], {stdio: 'inherit'})
    .on('error', function (error) {
      gutil.log(gutil.colors.red(error.message));
      this.emit('end');
      })
    .on('close', done);
});

// Rebuild Jekyll & do page reload
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
  browserSync.reload();
});

// Wait for jekyll-build, then launch the Server
gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
  browserSync({
    server: {
      baseDir: '_site'
    },
    notify: false
  });
});

// Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
gulp.task('sass', function () {
  return gulp.src('assets/sass/*.{scss,sass}')
    .pipe(plumber(function (error) {
        gutil.log(gutil.colors.red(error.message));
        this.emit('end');
    }))
    .pipe(sass({outputStyle: 'compact'}))
    .pipe(prefix(['last 2 versions'], { cascade: true }))
    .pipe(cssNano())
    .pipe(gulp.dest('_site/assets/css'))
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest('assets/css'));
});

// Compile files from _jade into _includes
gulp.task('jade', function () {
  return gulp.src('_jade/**/*.jade')
    .pipe(plumber(function (error) {
        gutil.log(gutil.colors.red(error.message));
        this.emit('end');
    }))
    .pipe(jade({pretty: true}))
    .pipe(gulp.dest('_includes'));
});

// Watch scss files for changes & recompile. Watch html/md/js files, run jekyll & reload BrowserSync
gulp.task('watch', function () {
  gulp.watch('assets/sass/**/*.{scss,sass}', ['sass']);
  gulp.watch(['assets/js/*.js', '*.html', 'news/**/*.html', 'projects/**/*.html', '_layouts/*.html', '_includes/**/*.html'], ['jekyll-rebuild']);
});

// Default task, running just `gulp` will compile the sass, compile the jekyll site, launch BrowserSync & watch files.
gulp.task('default', ['browser-sync', 'watch']);

// Compile all assets and run jekyll build
gulp.task('build', ['sass', 'jekyll-build']);
