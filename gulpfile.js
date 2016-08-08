var gulp = require('gulp');
var minify = require('gulp-minifier');
var htmlreplace = require('gulp-html-replace');
var clean = require('gulp-clean');

gulp.task('minify', function() {
  gulp.src('src/assets/css/*').pipe(minify({
    minify: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    minifyJS: true,
    minifyCSS: true,
    getKeptComment: function (content, filePath) {
        var m = content.match(/\/\*![\s\S]*?\*\//img);
        return m && m.join('\n') + '\n' || '';
    }
  })).pipe(gulp.dest('build/assets/css-min'));

  gulp.src('src/assets/js/*').pipe(minify({
    minify: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    minifyJS: false,
    minifyCSS: true,
    getKeptComment: function (content, filePath) {
        var m = content.match(/\/\*![\s\S]*?\*\//img);
        return m && m.join('\n') + '\n' || '';
    }
  })).pipe(gulp.dest('build/assest/js-min'));

});

gulp.task('html-replace', function() {
  return gulp.src('index.html')
    .pipe(htmlreplace({
        'js': ['assest/js-min/app.js', 'assest/js-min/commonLib.js'],
        'css': 'assest/css-min/style.css'
    }))
    .pipe(gulp.dest('build/'));
});

gulp.task('build', function() {
  return gulp.src(['*', '*/**', '!.gitignore',
            '!*.json', '!*.lock', '!gulpfile.js', '!index.html', '!src/.env']).pipe(gulp.dest('build/'));
});

gulp.task('del', ['build'], function () {
	return gulp.src(['build/tests/', 'build/assets/css', 'build/assets/js', 'build/node_modules',
                  'build/vendor'], {read: false})
		  .pipe(clean());
});

gulp.task('default', ['build', 'minify', 'html-replace', 'del']);
