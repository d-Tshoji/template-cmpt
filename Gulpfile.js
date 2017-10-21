'use strict';

let gulp = require('gulp');
let sass = require('gulp-sass');
let pug = require('gulp-pug');
let imagemin = require('gulp-imagemin');
let browserSync = require('browser-sync').create();
let pngquant = require('imagemin-pngquant');
let mozjpeg = require('imagemin-mozjpeg');
let watch = require('gulp-watch');
let plumber = require('gulp-plumber');


gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
  });
});

gulp.task('sass', function() {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist'));
});

gulp.task('pug', function() {
  return gulp.src('src/pug/**/!(_)*.pug')
    .pipe(plumber())
    .pipe(pug({
      pretty: true,
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('imagemin', function() {
  return gulp.src('src/img/**/*')
    .pipe(imagemin([
      pngquant({
        quality: '65-80',
        speed: 1,
      }),
      mozjpeg({
        quality: 80,
      }),
      imagemin.svgo(),
      imagemin.gifsicle(),
    ]))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('js', function() {
  return gulp.src('./src/scripts/**/*.js')
    .pipe(gulp.dest('./dist'));
});

gulp.task('ico', function() {
  return gulp.src('./src/favicons/**/*')
    .pipe(gulp.dest('./dist'));
});

gulp.task('sitemap', function() {
  return gulp.src('./src/sitemap.xml')
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', ['js', 'sass', 'pug', 'imagemin', 'ico'], function() {
  watch(['./src/scss/**/*.scss'], function() {
    gulp.start('sass');
  });
  watch(['./src/pug/**/*.pug'], function() {
    gulp.start('pug');
  });
  watch(['./src/img/**/*'], function() {
    gulp.start('imagemin');
  });
  watch(['./src/scripts/**/*.js'], function() {
    gulp.start('js');
  });
  watch(['./src/favicons/**/*'], function() {
    gulp.start('ico');
  });
  watch(['./src/sitemap.xml'], function() {
    gulp.start('sitemap');
  });

  watch(['./dist/**/*'], function() {
    browserSync.reload();
  });
});

gulp.task('default', ['watch'], function() {
  gulp.start('serve');
});
