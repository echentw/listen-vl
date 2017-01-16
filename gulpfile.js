var gulp = require('gulp');
var sass = require('gulp-sass');
var server = require('gulp-develop-server');

var paths = {
  styles: {
    src: './public/sass',
    files: './public/sass/**/*.scss',
    dest: './public/css'
  },
  serverJS: {
    files: ['**/*.js', '!node_modules/**', '!bin/**']
  },
  scripts: {
    start: 'bin/www'
  }
};

gulp.task('server:start', function() {
  server.listen({path: paths.scripts.start}, function(error) {
    console.log(error);
  });
});

gulp.task('server:restart', function() {
  server.restart();
});

gulp.task('default', ['server:start', 'sass'], function() {
  gulp.watch(paths.serverJS.files, ['server:restart']);
  gulp.watch(paths.styles.files, ['sass']);
});


gulp.task('sass', function() {
  gulp.src(paths.styles.files)
    .pipe(sass({
      outputStyle: 'compressed',
      sourceComments: 'map',
      includePaths: [paths.styles.src]
    }))
    .pipe(gulp.dest(paths.styles.dest));
});
