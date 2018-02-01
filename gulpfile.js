var				gulp    	= require('gulp'),
				scss        = require('gulp-sass'),
				browserSync = require('browser-sync'),
				autoprefixer= require('gulp-autoprefixer');

				
gulp.task('scss', function() {
	return gulp.src('app/scss/main.scss')
	.pipe(scss().on( 'error', function( error )
      {console.log( error );} )
	)
	.pipe(autoprefixer(['last 4 versions'], {cascade:true}))
	.pipe(gulp.dest('app'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('reload', function() {
	return gulp.src([
		'app/index.html',
		'app/js/**/*.js'
		])
	.pipe(browserSync.reload({stream: true}));
});


gulp.task('browser-sync', function(){
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});

gulp.task('watch', ['browser-sync', 'scss', 'reload'], function() {
	gulp.watch('app/scss/**/*.scss', ['scss']);
	gulp.watch([
		'app/index.html',
		'app/js/**/*.js'
		], ['reload']);
});

// Default Task
gulp.task('default', ['watch']);