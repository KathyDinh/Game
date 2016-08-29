var gulp = require("gulp");
var nodemon = require("gulp-nodemon");

var browserSync = require('browser-sync');
var reload = browserSync.reload;

var nodeAppPort = 5000;


gulp.task('browser-sync', ['nodemon'], function() {
  browserSync({
    proxy: "localhost:" + nodeAppPort,  // local node app address
    notify: true,
    files: "**"
  });
});

gulp.task('nodemon', function (cb) {
  var called = false;
  var options = require("./nodemon.config")(nodeAppPort);

  return nodemon(options)
  .on('start', function () {
    if (!called) {
      called = true;
      cb();
    }
  })
  .on('restart', function () {
    setTimeout(function () {
      reload({ stream: false });
    }, 1000);
  });
});

gulp.task('default',['browser-sync']);

