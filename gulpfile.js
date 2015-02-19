var gulp = require('gulp');
var uglify = require('gulp-uglify');

gulp.task('script', function() {
  
  return gulp.src('ui-bootstrap-dialog.js')
            .pipe(uglify())
            .pipe(gulp.dest('ui-bootstrap-dialog.min.js'));
  
});