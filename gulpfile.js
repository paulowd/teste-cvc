var gulp = require('gulp'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  minify = require('gulp-minify'),
  concat = require('gulp-concat'),
  runSequence = require('run-sequence'),
  spritesmith = require('gulp.spritesmith');

// Declara caminho dos diretórios de arquivos fontes
// e seus respectivos destinos após o build
var path = {
  css_src: 'src/sass/',
  css_dist: 'public/assets/css/',
  js_src: 'src/js/',
  js_dist: 'public/assets/js/',
  img_src: 'src/img/',
  img_dist: 'public/assets/img/',
  html_src: 'src/html/',
  html_dist: './public/',
  fonts_src: 'src/fonts/',
  fonts_dist: 'public/assets/fonts/',
  node: 'node_modules/',
  sprite: 'src/sprite/'
};

gulp.task('scripts', function() {
  gulp.src([path.js_src + '**/*.js'])
    .pipe(concat('cvc-carros.js'))
    .pipe(minify({
      ext: {
        src: '-debug.js',
        min: '.js'
      },
      exclude: ['tasks'],
      ignoreFiles: ['.combo.js', '-min.js']
    }))
    .pipe(gulp.dest(path.js_dist));
});

gulp.task('styles', function() {

  gulp.src(path.css_src + '*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    })).on('error', sass.logError)
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(path.css_dist));
});

gulp.task('html', function() {
  gulp.src([path.html_src + '**/*.html'])
    .pipe(gulp.dest(path.html_dist));
});

gulp.task('img', function() {
  gulp.src([path.img_src + '**/*'])
    .pipe(gulp.dest(path.img_dist));
});

gulp.task('watch', function() {
  gulp.run('build');

  gulp.watch(path.css_src + '**/*', ['styles']);
  gulp.watch(path.js_src + '**/*', ['scripts']);
  gulp.watch(path.html_src + '**/*', ['html']);
  gulp.watch(path.img_src + '**/*', ['img']);
  gulp.watch(path.sprite + '*.png', ['sprite']);
});

gulp.task('copy_angular', function() {
  gulp.src(
    [
      path.node + 'angular/angular.min.js', 
      path.node + 'angular-resource/angular-resource.min.js', 
      path.node + 'angular-animate/angular-animate.min.js', , 
      path.node + 'angular-aria/angular-aria.min.js', 
      path.node + 'angular-messages/angular-messages.min.js',
      path.node + 'angular-material/angular-material.min.js'
    ])
    .pipe(concat('angular.js'))
    .pipe(gulp.dest(path.js_dist));

    gulp.src(
        path.node + 'angular-material/angular-material.min.css'
      )
      .pipe(gulp.dest(path.css_dist));

    
});

gulp.task('build', function(callback) {
  runSequence('styles', 'sprite', 'copy_angular', 'scripts', 'html', 'img', callback);
});

gulp.task('sprite', function () {
  var spriteData = gulp.src(path.sprite + '*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.css'
  }));
  spriteData.pipe(gulp.dest('public/assets/sprite/'));
});