const browserify = require('browserify');
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
// const gutil = require('gulp-util');
// var uglify = require('gulp-uglify');
// const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const historyApiFallback = require('connect-history-api-fallback');

gulp.task('browser-sync', () => {
  browserSync.init({
    server: {
      baseDir: './docs/demo/admin',
      middleware: [historyApiFallback()],
    },
  });
});

gulp.task('demo', () => {
  const b = browserify({
    entries: './docs/demo/run.js',
    debug: true,
  }).transform('babelify', { presets: ['env', 'react'] });

  return b.bundle()
    .pipe(source('./docs/demo/run.js'))
    .pipe(buffer())
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('./docs/demo/admin/'));
});

gulp.task('javascript', () => {
  const b = browserify({
    entries: './client/run.js',
    debug: true,
    transform: [['babelify', { es6: true, everything: true }]],
  });

  return b.bundle()
    .pipe(source('./client/run.js'))
    .pipe(buffer())
    // .pipe(sourcemaps.init({loadMaps: true}))
    // Add transformation tasks to the pipeline here.
    // .pipe(uglify())
    // .on('error', gutil.log)
    // .pipe(sourcemaps.write('./'))
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('./www/'));
});

const less = require('gulp-less');

gulp.task('less', () => gulp.src('./client/less/index.less')
  .pipe(less({
    // paths: [path.join(__dirname,
  }))
  .pipe(rename('bundle.css'))
  .pipe(gulp.dest('./www')));

gulp.task('build', ['less', 'javascript']);

gulp.task('watch', () => {
  gulp.watch('client/**/*.js', ['javascript']);
  gulp.watch('client/**/*.less', ['less']);
});

gulp.task('watch-demo', ['demo', 'browser-sync'], () => {
  gulp.watch('client/**/*.js', ['demo']);
  gulp.watch('client/**/*.less', ['demo']);
});

// gulp.task('watch-demo', ['demo', 'browser-sync']);

gulp.task('default', ['build', 'watch']);
