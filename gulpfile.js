const autoprefixer = require("gulp-autoprefixer");
const csso = require("gulp-csso");
const del = require("del");
const gulp = require("gulp");
const htmlmin = require("gulp-htmlmin");
const runSequence = require("run-sequence");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");

const SUPOORTED_BROWSERS = [
  "ie >= 10",
  "ie_mob >= 10",
  "ff >= 30",
  "chrome >= 34",
  "safari >= 7",
  "android >= 4.4",
  "opera >= 23",
  "ios >= 7"
];

// Minify SASS files
gulp.task("sass", function() {
  return gulp
    .src("./src/sass/styles.scss")
    .pipe(
      sass({
        outputStyle: "nested",
        precision: 10,
        includePaths: ["."],
        onError: console.error.bind(console, "Sass error:")
      })
    )
    .pipe(autoprefixer({ browsers: SUPOORTED_BROWSERS }))
    .pipe(csso())
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(gulp.dest("./dist/css"));
});

// Minify CSS files
gulp.task("minify-css", () => {
  return gulp
    .src("./src/**/*/*.css")
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(gulp.dest("./dist"));
});

// Minify JavaScript files
gulp.task("scripts", function() {
  return gulp
    .src("./src/js/**/*.js")
    .pipe(uglify())
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(gulp.dest("./dist/js"));
});

// Minify HTML files
gulp.task("pages", function() {
  return gulp
    .src(["./src/**/*.html"])
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true
      })
    )
    .pipe(gulp.dest("./dist"));
});

// Clean dist directory
gulp.task("clean", () => del(["dist"]));

// Use sequence to execute all tasks
gulp.task("default", ["clean"], function() {
  runSequence("minify-css", "sass", "scripts", "pages");
});
