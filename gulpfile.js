"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var del = require("del");
var run = require("run-sequence");
var uglify = require("gulp-uglify");
var pump = require("pump");
var csscomb = require("gulp-csscomb");
var gnf = require('gulp-npm-files');
var svgstore = require("gulp-svgstore");
var cheerio = require('gulp-cheerio');
var rsync = require('gulp-rsync');
var buffer = require('vinyl-buffer');
var merge = require('merge-stream');
var spritesmith = require('gulp.spritesmith');

const config = {
  build: "/var/www/sweetcake/wp-content/themes/sweetcake/",
  templates: ["", "inc/", "template-parts/"]
}

gulp.task("clean", function() {
  return del(config.build + "*",{force:true});
});

gulp.task("copy", function() {
  return gulp.src([
    "fonts/**",
    "inc/**",
    "img/**",
    "languages/**",
    "layouts/**",
    "js/**",
    "js-mini/**",
    "template-parts/**",
    "*.php",
    "rtl.css"
  ], {
    base: "."
  })
  .pipe(gulp.dest(config.build));
});

gulp.task("copyNpmDependenciesOnly", function() {
  gulp.src(gnf(), {base:'./'})
  .pipe(gulp.dest(config.build));
});

gulp.task("svgsprite", function() {
  var sources = gulp
  .src("img/icons-svg/*.svg")
  .pipe(svgstore({
      inlineSvg: true
    }))
  .pipe(cheerio({
      run: function ($) {
          $('svg').addClass('svg-sprite');
      },
      parserOptions: { xmlMode: true }
  }))
  .pipe(rename("svg-sprite.svg"))
  .pipe(gulp.dest(config.build + "img/svg-sprite"));
});


gulp.task("images", function(){
  return gulp.src("build/img/**/*.{png,jpg,gif}")
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.jpegtran({progressive: true})
  ]))
  .pipe(gulp.dest("build/img"));
});

gulp.task("compress", function(cb){
  pump([
    gulp.src("build/js/**/*.js"),
    uglify(),
    gulp.dest("build/js-mini")
    ],
    cb
    );
});

 // Call before 'style' task and after 'image' task
gulp.task('sprite', function () {
  // Generate our spritesheet
  var spriteData = gulp.src('img/icons-png/*.png').pipe(spritesmith({
    imgName: 'img/sprite.png',
    cssFormat: 'scss',
    cssName: 'sprite.scss'
  }));

  // Pipe image stream through image optimizer and onto disk
  var imgStream = spriteData.img
    // DEV: We must buffer our stream into a Buffer for `imagemin`
    .pipe(gulp.dest(config.build));

  // Pipe CSS stream through CSS optimizer and onto disk
  var cssStream = spriteData.css
    .pipe(gulp.dest('sass/'));

  // Return a merged stream to handle both `end` events
  return merge(imgStream, cssStream);
});


gulp.task("style", function() {
  gulp.src("sass/style.scss")
    .pipe(plumber())
    .pipe(sass({
            includePaths: require('node-normalize-scss').includePaths
          }))
    .pipe(postcss([
      autoprefixer({browsers: [
        "last 2 versions"
      ]})
    ]))
    .pipe(csscomb())
    .pipe(gulp.dest(config.build))
//    .pipe(minify())
//    .pipe(rename("style.min.css"))
//    .pipe(gulp.dest("build/css"))

    .pipe(server.stream());
});


gulp.task('deploy', function() {
  return gulp.src(config.build + '**')
    .pipe(rsync({
      root: config.build,
      hostname: 'u0415326@maya-site.ru',
      destination: 'www/maya-site.ru/sweetcake/wp-content/themes/sweetcake/',
      archive: false,
      recursive: true,
      links: true,
      times: true,
      silent: true,
      compress: true
      //, command: true
    }));
});

gulp.task("build", function(fn) {
  run("clean",
      "copy",
      "copyNpmDependenciesOnly",
      "svgsprite",
      "style",
      "images",
      "compress",
      fn);
});

gulp.task("php:copy", function(){
  config.templates.map(function(folder) {
    return gulp.src(folder + "*.php")
    .pipe(gulp.dest(config.build + folder));
  });
});

/*gulp.task("php:update", ["php:copy"], function(done){
  server.reload();
  done();
});*/

gulp.task("serve", function() {
/*  server.init({
    server: "floorball.ru",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });*/

  gulp.watch("sass/**/*.{scss,sass}", ["style"]);
  gulp.watch(
   config.templates.map(function(folder){
    return folder + "*.php";
   }),
   ["php:copy"]);
});
