var gulp       = require('gulp'),
  browserSync  = require('browser-sync'),
  sass         = require('gulp-sass'),
  csso         = require('gulp-csso'),
  rename       = require('gulp-rename'),
  jade         = require('gulp-jade'),
  autoprefixer = require('gulp-autoprefixer'),
  concat       = require('gulp-concat'),
  uglify       = require('gulp-uglifyjs'),
  notify       = require('gulp-notify'),
  del          = require('del'),
  imagemin     = require('gulp-imagemin'),
  pngquant     = require('imagemin-pngquant');

gulp.task('clean', function() {
    return del.sync('dist'); // Удаляем папку dist перед сборкой
});

gulp.task('img', function() {
    return gulp.src('app/img/**/*') // Берем все изображения из app
        .pipe(imagemin({ // Сжимаем их с наилучшими настройками
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});

gulp.task('build', ['clean', 'sass', 'scripts', 'csso', 'img'], function() {

    var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
    .pipe(gulp.dest('dist/fonts'))

    var buildFonts = gulp.src('app/js/sass-font-awesome/fonts/*') // Переносим шрифты в продакшен
    .pipe(gulp.dest('dist/fonts'))

    var buildJs = gulp.src('app/js/main.min.js') // Переносим скрипты в продакшен
    .pipe(gulp.dest('dist/js'))

    var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
    .pipe(gulp.dest('dist'));

});

gulp.task('scripts', function() {
  return gulp.src([ // Берем все необходимые библиотеки
    'app/js/jquery/dist/jquery.js', 
    'app/js/jquery1.12/dist/jquery.js', 
    'app/js/slick/slick.js', 
    'app/js/main.js'
    ])
    
    .pipe(concat('main.min.js')) // Собираем их в кучу в новом файле
    // .pipe(uglify()) // Сжимаем JS файл
    .on('error', notify.onError({
      message: "<%= error.message %>",
      title: "JS Error!"
    }))
    .pipe(gulp.dest('app/js')) // Выгружаем в папку app/js
   .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('sass', function() {
  return gulp.src('app/sass/*.sass')
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

gulp.task('jade', function() {
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

gulp.task('csso', function() { //Создание сжатого css
  return gulp.src('app/css/*.css')
    .pipe(csso())
    .pipe(gulp.dest('dist/css/'))
});

gulp.task('browser-sync', function() { // Создаем таск browser-sync
  browserSync({ // Выполняем browser Sync
    server: { // Определяем параметры сервера
      baseDir: 'app' // Директория для сервера - app
    },
    notify: false // Отключаем уведомления
  });
});

gulp.task('default', ['browser-sync', 'scripts'], function() {
  gulp.watch('app/sass/*.sass', ['sass']); // Наблюдение за SASS файлами
  gulp.watch('app/*.jade', ['jade']); // Наблюдение за JADE файлами в корне проекта
  gulp.watch('app/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
  gulp.watch(['app/js/*.js', '!app/js/main.min.js'], ['scripts']); // Наблюдение за JS файлами в папке js
});