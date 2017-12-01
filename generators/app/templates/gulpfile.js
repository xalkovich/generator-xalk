var gulp = require('gulp'),
	browserSync = require('browser-sync'),
	sass = require('gulp-sass'),
	csso = require('gulp-csso'),
	rename = require('gulp-rename'),
	jade = require('gulp-jade'),
	autoprefixer = require('gulp-autoprefixer'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglifyjs'),
	notify = require('gulp-notify'),
	del = require('del'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	gulpif = require('gulp-if'),
	wiredep = require('gulp-wiredep'),
	useref = require('gulp-useref');


gulp.task('build', ['clean', 'img', 'jadebuild'], function () {
	var buildFonts = gulp.src('app/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'))
	var buildFonts = gulp.src('app/js/sass-font-awesome/fonts/*')
		.pipe(gulp.dest('dist/fonts/'))
});

gulp.task('jadebuild', function () {
	return gulp.src('app/*.jade')
		.pipe(jade({
			pretty: true
		}))
		.on('error', notify.onError({
			message: "<%= error.message %>",
			title: "Jade Error!"
		}))
		.pipe(useref())
		.pipe(gulpif('*.js', uglify()))
		.pipe(gulpif('*.css', csso()))
		.pipe(gulp.dest('dist'))
});

gulp.task('clean', function () {
	return del.sync('dist');
});

gulp.task('img', function () {
	return gulp.src('app/img/**/*')
		.pipe(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{
				removeViewBox: false
			}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest('dist/img'));
});

gulp.task('sass', function () {
	return gulp.src('app/sass/**/*.sass')
		.pipe(sass.sync())
		.on('error', notify.onError({
			message: "<%= error.message %>",
			title: "Sass Error!"
		}))
		.pipe(autoprefixer(['last 2 versions', '> 1%', 'ie 8'], {
			cascade: true
		}))
		.pipe(gulp.dest('app/css/'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('jade', function () {
	gulp.src('app/*.jade')
		.pipe(jade({
			pretty: true
		}))
		.on('error', notify.onError({
			message: "<%= error.message %>",
			title: "Jade Error!"
		}))
		.pipe(gulp.dest('app'))
});

gulp.task('browser-sync', function () {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});

gulp.task('bower', function () {
	gulp.src('app/index.jade')
		.pipe(wiredep({
			diewctory: 'app/js'
		}))
		.pipe(gulp.dest('app'))
		.pipe(browserSync.reload({
			stream: true
		}))
})

gulp.task('default', ['browser-sync', 'jade','bower'], function () {
	gulp.watch('app/sass/*.sass', ['sass']);
	gulp.watch('app/*.jade', ['jade']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
	gulp.watch('bower.json', ['bower']);
});