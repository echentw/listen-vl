var gulp = require('gulp');
var sass = require('gulp-sass');
var server = require('gulp-develop-server');

var serverJS = ["**/*.js", "!node_modules/**", '!bin/**'];

gulp.task('server:start', function() {
  server.listen({path: 'bin/www'}, function(error) {
    console.log(error);
  });
});

gulp.task('server:restart', function() {
  server.restart();
});

gulp.task('default', ['server:start', 'sass'], function() {
  gulp.watch(serverJS, ['server:restart']);
  gulp.watch(paths.styles.files, ['sass']);
});

var paths = {
  styles: {
    src: './public/sass',
    files: './public/sass/**/*.scss',
    dest: './public/css'
  }
};

gulp.task('sass', function() {
  gulp.src(paths.styles.files)
    .pipe(sass({
      outputStyle: 'compressed',
      sourceComments: 'map',
      includePaths: [paths.styles.src]
    }))
    .pipe(gulp.dest(paths.styles.dest));
});
