"use strict";


const { series, parallel, src, dest, watch, lastRun } = require('gulp');
const del = require('del');
const cpy = require('cpy');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const autoprefixer = require("autoprefixer");
const insert = require('gulp-insert');
const sass = require('gulp-sass');
//const copydir = require('copy-dir');

// var gulp = require("gulp");
// var sass = require("gulp-sass");
// var plumber = require("gulp-plumber");
// var postcss = require("gulp-postcss");
// var autoprefixer = require("autoprefixer");
// var server = require("browser-sync").create();
// var minify = require("gulp-csso");
// var rename = require("gulp-rename");
// var imagemin = require("gulp-imagemin");
// var del = require("del");
// var run = require("run-sequence");
// var uglify = require("gulp-uglify");
// var pump = require("pump");
// var csscomb = require("gulp-csscomb");
// var gnf = require('gulp-npm-files');
// var svgstore = require("gulp-svgstore");
// var cheerio = require('gulp-cheerio');
// var rsync = require('gulp-rsync');
// var buffer = require('vinyl-buffer');
// var merge = require('merge-stream');
// var spritesmith = require('gulp.spritesmith');

const config = {
  src: "",
  build: "/var/www/forma/wp-content/themes/forma/",
  templates: ["", "inc/", "template-parts/"],
  allPaths: {
    "fonts/**/*": "fonts/",
    "inc/*": "inc/",
    "img/*": "img/",
    "languages/*": "languages/",
    "layouts/*": "layouts/",
    "js/**/*": "js/",
    "js-mini/*": "js-mini/",
    "template-parts/*": "template-parts/",
    "*.php": "",
    "css/": "css/"
  }
}


  // allPaths: {
  //   "fonts/": "fonts/",
  //   "inc/": "inc/",
  //   "img/": "img/",
  //   "languages": "languages/",
  //   "layouts": "layouts/",
  //   "js": "js/",
  //   "js-mini": "js-mini/",
  //   "template-parts": "template-parts/",
  //   "*.php": ""
  // }


const styleTitle = 'Theme Name: forma \n Theme URI: https://github.com/MayaSol/forma \n Author: MayaSol \n Author URI: https://github.com/MayaSol \n Description: Description \n Version: 1.0.0';

function clearBuildDir() {
  return del([
    `${config.build}**`,
    `!${config.build}`,
  ],{force:true});
}
exports.clearBuildDir = clearBuildDir;

function copyAll(cb) {
  if(config.allPaths) {
    for (let item in config.allPaths) {
      let src=`${config.src}${item}`;
      console.log(src);
      let dest = `${config.build}${config.allPaths[item]}`;
      console.log(dest);
      cpy(src,dest);
    }
    cb();
  }
  else {
    cb();
  }
}
exports.copyAll = copyAll;

exports.build = series(
  clearBuildDir,
  copyAll,
  compileSass
);

function compileSass() {
  const fileList = [
    'sass/style.scss',
    'sass/style-form.scss'
  ];
  return src(fileList)
    .pipe(plumber({
      errorHandler: function (err) {
        console.log(err.message);
        this.emit('end');
      }
    }))
    .pipe(sass({
            includePaths: require('node-normalize-scss').includePaths
          }))
    .pipe(postcss([
      autoprefixer(),
    ]))
    // .pipe(insert.prepend(`/*${styleTitle}\n*/`))
    .pipe(dest(`${config.build}`));
}
exports.compileSass = compileSass;

// gulp.task("copyNpmDependenciesOnly", function() {
//   gulp.src(gnf(), {base:'./'})
//   .pipe(gulp.dest(config.build));
// });

// gulp.task("svgsprite", function() {
//   var sources = gulp
//   .src("img/icons-svg/*.svg")
//   .pipe(svgstore({
//       inlineSvg: true
//     }))
//   .pipe(cheerio({
//       run: function ($) {
//           $('svg').addClass('svg-sprite');
//       },
//       parserOptions: { xmlMode: true }
//   }))
//   .pipe(rename("svg-sprite.svg"))
//   .pipe(gulp.dest(config.build + "img/svg-sprite"));
// });

// gulp.task("images", function(){
//   return gulp.src("build/img/**/*.{png,jpg,gif}")
//   .pipe(imagemin([
//     imagemin.optipng({optimizationLevel: 3}),
//     imagemin.jpegtran({progressive: true})
//   ]))
//   .pipe(gulp.dest("build/img"));
// });

// gulp.task("compress", function(cb){
//   pump([
//     gulp.src("build/js/**/*.js"),
//     uglify(),
//     gulp.dest("build/js-mini")
//     ],
//     cb
//     );
// });

//  // Call before 'style' task and after 'image' task
// gulp.task('sprite', function () {
//   // Generate our spritesheet
//   var spriteData = gulp.src('img/icons-png/*.png').pipe(spritesmith({
//     imgName: 'img/sprite.png',
//     cssFormat: 'scss',
//     cssName: 'sprite.scss'
//   }));

//   // Pipe image stream through image optimizer and onto disk
//   var imgStream = spriteData.img
//     // DEV: We must buffer our stream into a Buffer for `imagemin`
//     .pipe(gulp.dest(config.build));

//   // Pipe CSS stream through CSS optimizer and onto disk
//   var cssStream = spriteData.css
//     .pipe(gulp.dest('sass/'));

//   // Return a merged stream to handle both `end` events
//   return merge(imgStream, cssStream);
// });


// gulp.task('deploy', function() {
//   return gulp.src(config.build + '**')
//     .pipe(rsync({
//       root: config.build,
//       hostname: 'u0415326@maya-site.ru',
//       destination: 'www/maya-site.ru/sweetcake/wp-content/themes/sweetcake/',
//       archive: false,
//       recursive: true,
//       links: true,
//       times: true,
//       silent: true,
//       compress: true
//       //, command: true
//     }));
// });


// gulp.task("php:copy", function(){
//   config.templates.map(function(folder) {
//     return gulp.src(folder + "*.php")
//     .pipe(gulp.dest(config.build + folder));
//   });
// });

// /*gulp.task("php:update", ["php:copy"], function(done){
//   server.reload();
//   done();
// });*/

// gulp.task("serve", function() {
// /*  server.init({
//     server: "floorball.ru",
//     notify: false,
//     open: true,
//     cors: true,
//     ui: false
//   });*/

//   gulp.watch("sass/**/*.{scss,sass}", ["style"]);
//   gulp.watch(
//    config.templates.map(function(folder){
//     return folder + "*.php";
//    }),
//    ["php:copy"]);
// });
