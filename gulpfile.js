var gulp = require('gulp');
var server = require('gulp-develop-server');

var serverJS = ["app/**/*.js", "!node_modules/**", '!bin/**'];

gulp.task('server:start', function() {
  server.listen({path: 'bin/www'}, function(error) {
    console.log(error);
  });
});

gulp.task('server:restart', function() {
  server.restart();
});

gulp.task('default', ['server:start'], function() {
  gulp.watch(serverJS, ['server:restart']);
});
