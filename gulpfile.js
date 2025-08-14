const {
  src,
  dest,
  watch,
  parallel,
  series
} = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const fileInclude           = require('gulp-file-include');
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const rename                = require('gulp-rename');

const htmlInclude = () => {
  return src(['app/html/*.html']) 													
  .pipe(fileInclude({
    prefix: '@',
    basepath: '@file',
  }))
  .pipe(dest('app')) 
  .pipe(browserSync.stream());
}

function scripts() {
  return src([
      'app/js/main.js'
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream())
}

function styles() {
  return src('app/scss/*.scss')
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 10 versions'],
      grid: true
    }))
    .pipe(rename ({
      suffix : ".min"
    }))
    .pipe(scss({
      outputStyle: 'compressed'
    }))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())
}

function watching() {
  watch(['app/scss/**/*.scss'], styles)
  watch(['app/js/main.js'], scripts)
  watch(['app/**/*.html']).on('change', browserSync.reload)
  watch(['app/html/**/*.html'], htmlInclude);
}

function browsersync() {
  browserSync.init({
    server: {
      baseDir: "app/"
    },
    notify: false
  });
}

function cleanDist() {
  return src('dist')
    .pipe(clean())
}


function building() {
  return src([
      'app/**/*.html',
      'app/css/style.min.css',
      'app/js/main.min.js',
      'app/images/**/*.*'
    ], {
      base: 'app'
    })
    .pipe(dest('dist'))
}

exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.browsersync = browsersync;
exports.htmlInclude = htmlInclude;

exports.build = series(cleanDist, building);
exports.default = parallel(htmlInclude, styles, scripts, browsersync, watching);