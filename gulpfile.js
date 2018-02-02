var				gulp    	= require('gulp'),
				sass        = require('gulp-sass'),
				browserSync = require('browser-sync'),
				autoprefixer= require('gulp-autoprefixer');

				
gulp.task('sass', function() {
	return gulp.src('app/sass/main.sass')
	.pipe(sass().on( 'error', function( error )
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

gulp.task('watch', ['browser-sync', 'sass', 'reload'], function() {
	gulp.watch('app/sass/**/*.sass', ['sass']);
	gulp.watch([
		'app/index.html',
		'app/js/**/*.js'
		], ['reload']);
});

// Default Task
gulp.task('default', ['watch']);