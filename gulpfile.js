// Подключаем модули gulp-a
const gulp = require('gulp');
const browserSync = require('browser-sync').create();

// Общее для всех типов файлов
const clean = require('gulp-clean'); // удаление файлов и папок
const cleanBuild = require('gulp-dest-clean'); // удаление файлов в папке назначения если их нет в исходниках
const cache = require('gulp-cached'); // кэширование файлов
const rename = require('gulp-rename'); // переименование файла
const sourcemaps = require('gulp-sourcemaps');
const dependents = require('gulp-dependents'); // для отслеживания связных scss-файлов
const filter = require('gulp-filter'); // фильтрация потока файлов по заданному фильтру
const include = require('gulp-include'); // import
const changed = require('gulp-changed'); // только измененные файлы
const logger = require('gulp-logger'); // логирование действий
const touch = require('gulp-touch-cmd'); // используется для обновления времени изменения фалйа
const del = require('del'); // удаление файла
const path = require('path'); // получение пути файла
const plumber = require('gulp-plumber');
const flatten = require('gulp-flatten'); // для управления структурой папок
const size = require('gulp-size');
const notify = require('gulp-notify');
const concat = require('gulp-concat'); // объединение файлов в 1
const mode = require('gulp-mode')({
  modes: ['production', 'development'],
  default: 'production',
  verbose: false,
}); // установки ключа --production/--development для сборки

// Для SCSS / CSS
const sass = require('gulp-sass'); // scss -> css
const autoprefixer = require('gulp-autoprefixer'); // добавление css-префиксов
const cleanCSS = require('gulp-clean-css'); // минификация css-файлов
const uncss = require('gulp-uncss'); // Удаление неиспользуемых стилей

// Для js
const babel = require('gulp-babel'); // es6 -> es5
const minify = require('gulp-minify'); // минификация js (удаление только лишних пробелов)

// Images
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');

// Tests
const complexity = require('gulp-complexity'); // проверка на качество кода
const jscpd = require('gulp-jscpd'); // для поиска дубликатов в коде
const plato = require('gulp-plato'); // статистика по js-коду

const images_types = {
  old: [
    'black_logo.png',
    'no-avatar.png',
    'no-image-landscape.png',
    'white.jpg',
    'article_without_photo.png',
    'white_point.png',
    'new_logo.png',
    'instagram.png',
    'telegram.png',
    'ttsoc.jpg',
    'icons.png',
    'article_without_photo_80x60.png',
    'kr1.png',
    'kr2.png',
    'ser1.png',
    'ser2.png',
    'subscribe.png',

    'menu-arrow.png',
    'bg-white-70-perc.png',
    'foot-h3-bg.png',
    'vip-shadow.jpg',
  ],
  new: [
    'black_logo.webp',
    'no-avatar.webp',
    'no-image-landscape.webp',
    'white.webp',
    'article_without_photo.webp',
    'new_logo.webp',
    'instagram.webp',
    'telegram.webp',
    'ttsoc.webp',
    'icons.webp',
    'article_without_photo_80x60.webp',
    'kr1.webp',
    'kr2.webp',
    'ser1.webp',
    'ser2.webp',
    'subscribe.webp',

    'menu-arrow.webp',
    'bg-white-70-perc.webp',
    'foot-h3-bg.webp',
    'vip-shadow.webp',
  ],
};


const gulpStylelint = require('gulp-stylelint');

//------------------------------------------------------------------------------


// Переменные
const entry = ''; // точка входа
const source_dir = `${entry}app/`; // папка с исходниками
const src_static = `${source_dir}src/`; // исходники скриптов и стилей
const dest_static = `${source_dir}build/`; // папка выхлопа скриптов и стилей
const tmp_dir = `${source_dir}tmp`; // временная папка

const ftempl_dir = `${entry}frontend/templates`;
const ptempl_dir = `${entry}pdfarchive/templates`;
const stempl_dir = `${entry}subscription/templates`;
const tpls_from = [ // шаблоны для сравнения и тестов
  `${ftempl_dir}/**/*.html`,
  `${ptempl_dir}/**/*.html`,
  `${stempl_dir}/**/*.html`,
];

const config = {
  server: {
    baseDir: dest_static,
  },
  // tunnel: true,
  // host: 'localhost',
  // port: 9000,
  // logPrefix: "Frontend",
};

const watchInBrowser = true;

const routes = {
  build: {
    scripts: `${dest_static}js/`,
    scripts_tmp: `${tmp_dir}/js/`,
    styles:	`${dest_static}css/`,
    images: `${dest_static}images/`,
  },
  src: {
    styles: [`${src_static}**/*.scss`, `${src_static}**/*.sass`],
    scripts: [`${src_static}**/*.js`, `${tmp_dir}/**/*.js`],
    // scripts:     `${ src_static }js/**/*.js`,
    scripts_tmp: `${tmp_dir}/js/**/*.js`,
    images: `${src_static}images/**/*`,
  },
  cssFilter: [
    `${src_static}**/*.scss`, 
    `${src_static}**/*.sass`, 
    `!${src_static}components/**`,
    `!${src_static}modules/**`
  ],
  plugins: {
    src: [
      `${src_static}plugins`,
    ],
    build: `${src_static}plugins/`,
  },
  libs: `${src_static}libs`,
  components: {
    src: `${src_static}components/**/*`,
    build: `${src_static}components/`,
  },
  tpl: {
    frontend: `${entry}frontend/templates/`,
    pdfarchive: `${entry}pdfarchive/templates/`,
    subscription: `${entry}subscription/templates/`,
  },
  fonts: src_static,
  testJS: [
    `${src_static}components/**/*`,
    `${src_static}js/**/*`,
    `${src_static}plugins/**/*`,
    '!*.min.js',
  ],
};

const unsedStyles = {
  home: {
    html: ['https://www.oblgazeta.ru/', `${routes.build.scripts}/page_home.js`],
    styles: [`${dest_static}css/page_home.css`, `${dest_static}css/page_home.min.css`],
  },
  news: {
    html: ['https://www.oblgazeta.ru/news/', `${routes.build.scripts}/page_news*.js`],
    styles: [`${dest_static}css/page_news.css`, `${dest_static}css/page_news.min.css`],
  },
  authors: {
    html: ['https://www.oblgazeta.ru/authors/', `${routes.build.scripts}/page_authors-list.js`],
    styles: [`${dest_static}css/page_authors-list.css`, `${dest_static}css/page_authors-list.min.css`],
  },
  author: {
    html: ['https://www.oblgazeta.ru/authors/57/', `${routes.build.scripts}/page_authors-author.js`],
    styles: [`${dest_static}css/page_authors-author.css`, `${dest_static}css/page_authors-author.min.css`],
  },
  header: {
    html: [
      tpls_from,
      'https://www.oblgazeta.ru/',
      `${routes.build.scripts}/base_with_left_news.js`, `${routes.build.scripts}/base.js`],
    styles: [`${dest_static}css/header.css`, `${dest_static}css/header.min.css`],
  },
  base: {
    html: [
      tpls_from,
      'https://www.oblgazeta.ru/',
      `${routes.build.scripts}/base.js`],
    styles: [`${dest_static}css/base.css`, `${dest_static}css/base.min.css`],
  },
  base_left: {
    html: [
      tpls_from,
      'https://www.oblgazeta.ru/',
      `${routes.build.scripts}/base_with_left_news.js`],
    styles: [`${dest_static}css/base_with_left_news.css`, `${dest_static}css/base_with_left_news.min.css`],
  },
};

const options = {
  ignore: ['#.collapse.in', /test\-[0-9]+/],
};

const isProduction = mode.production();


//-------------------------------------------------------------------


// CSS ==============================================================


function buildStyles() {
  if (isProduction) {
    const filtered = filter(routes.cssFilter);
    return gulp.src(routes.src.styles, { allowEmpty: true })
      .pipe(cache('files_changes'))
      .pipe(dependents())
      .pipe(logger({
        showChange: true,
        before: '[production] Starting prod build css-files...',
        after: '[production] Building prod css-files complete.',
      })) // логируем изменяемые файлы
      .pipe(filtered)
      .pipe(sass())
      .pipe(autoprefixer({
        remove: false,
        cascade: false,
      }))
      .pipe(flatten())
      .pipe(gulp.dest(routes.build.styles))
      .pipe(cleanCSS({
        compatibility: 'ie8',
      })) // минификация css
      .pipe(rename((src_dir) => {
        src_dir.basename += '.min';
      }))
      .pipe(gulp.dest(routes.build.styles))
      .pipe(touch())
      .pipe(size())
      .pipe(browserSync.stream());
  }

  // let filtered = filter(routes.cssFilter);
  return gulp.src(routes.src.styles, { allowEmpty: true })
  // .pipe(stripDebug())
    .pipe(cache('files_changes')) // Кэшируем для определения только измененных файлов
    .pipe(dependents()) // если есть связанные файлы, то меняем и их
    .pipe(logger({
      showChange: true,
      before: '[development] Starting dev build css-files...',
      after: '[development] Building dev css-files complete.',
    })) // логируем изменяемые файлы
  // .pipe(filtered)
    .pipe(sourcemaps.init())
    .pipe(sass()) // переводим в css
    .pipe(autoprefixer({
      remove: false,
      cascade: false,
    })) // добавляем префиксы
    .pipe(flatten()) // пишем файлы без сохранения структуры папок
    .pipe(sourcemaps.write('./')) // sourcemap-ы для .css файлов
    .pipe(gulp.dest(routes.build.styles))
  // // .. далее минифицируем и добавляем sourcemap-ы для .min.css
    .pipe(filter('**/*.css'))
    .pipe(cleanCSS({
      compatibility: 'ie8', // default
    })) // минификация css
    .pipe(rename((src_dir) => {
      src_dir.basename += '.min'; // до расширения файла
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(routes.build.styles)) // выходная папка
    .pipe(touch())
    .pipe(browserSync.stream());
}

function watchCSS() {
	if (watchInBrowser) {
		browserSync.init(config);
	}
  const watcher = gulp.watch(routes.src.styles, buildStyles).on('change', browserSync.reload);
  const html_watcher = gulp.watch(source_dir  + '*.html').on('change', browserSync.reload);
  clearDeletedCSS(watcher);
}

function clearCSS() {
  return gulp.src(routes.build.styles, { read: false, allowEmpty: true })
    .pipe(logger({
      showChange: true,
      before: 'Clearing destination folder...',
      after: 'Destination folder cleared!',
    }))
    .pipe(clean({ force: true }));
}

function clearDeletedCSS(watcher) {
  watcher.on('unlink', (filepath) => {
    const filePathFromSrc = path.relative(path.resolve('src'), filepath);
    const file = filePathFromSrc.split('/scss/')[1]; // файл
    let [file_name, file_ext] = file.split('.');
    file_ext = 'css';

    const delfile = path.resolve(routes.build.styles, `${file_name}.${file_ext}`);
    const delfilemap = path.resolve(routes.build.styles, `${file_name}.${file_ext}.map`);
    const delfilemin = path.resolve(routes.build.styles, `${file_name}.min.${file_ext}`);
    const delfileminmap = path.resolve(routes.build.styles, `${file_name}.min.${file_ext}.map`);

    del.sync(delfile, { force: true });
    console.log('[File deleted] ', delfile);

    del.sync(delfilemap, { force: true });
    console.log('[File deleted] ', delfilemap);

    del.sync(delfilemin, { force: true });
    console.log('[File deleted] ', delfilemin);

    del.sync(delfileminmap, { force: true });
    console.log('[File deleted] ', delfileminmap);
  });
}

function styleLint() {
  return gulp.src(routes.src.styles, { allowEmpty: true })
    .pipe(gulpStylelint({
      reporters: [
        {
          formatter: 'string',
          console: true,
        },
      ],
    }));
}


//------------------------------------------------------------------------------


// JavaScript =======================================================


// Таск на конкатенацию js файлов
function makeJSFiles() {
  const filtered = filter([`${src_static}js/**/*.js`]);
  return gulp.src([`${src_static}**/*.js`], { allowEmpty: true })
    .pipe(filtered)
    .pipe(logger({
      showChange: true,
      before: `${mode.production() ? '[production] ' : '[development] '}Starting collect js-files...`,
      after: `${mode.production() ? '[production] ' : '[development] '}Collecting js-files complete.`,
    }))
    .pipe(include())
    .pipe(flatten())
    .pipe(gulp.dest(routes.build.scripts_tmp));
}

// Таск на дальнейшую обработку js-файлов
function buildScripts() {
  const filtered = filter([`${tmp_dir}/**/*.js`, `!${tmp_dir}/**/_*.js`]);
  if (isProduction) {
    return gulp.src(`${tmp_dir}/**/*.js`, { allowEmpty: true, read: true })
      .pipe(filtered)
      .pipe(cache('files_changes'))
      .pipe(plumber())
      .pipe(logger({
        showChange: true,
        before: '[production] Starting build js-files...',
        after: '[production] Building js-files complete',
      }))
      .pipe(cleanBuild(routes.build.scripts, '**'))
      .pipe(babel({
        presets: [
          ['@babel/env', { modules: false }],
        ],
      }))
      .pipe(flatten())
      .pipe(gulp.dest(routes.build.scripts))
      .pipe(minify({
        ext: {
          src: '.js',
          min: '.min.js',
        },
      })) // минификация js
      // .pipe(uglify({
      //  // toplevel: true, // максимальный уровень минификации
      // })) // минификация js
      // .pipe(rename(function (path) {
      //  path.basename += ".min";//до расширения файла
      // }))
      .pipe(gulp.dest(routes.build.scripts)) // выходная папка
      .pipe(touch())
      .pipe(size())
      .pipe(browserSync.stream());
  }

  return gulp.src([routes.src.scripts_tmp], { allowEmpty: true, read: true })
    .pipe(cache('files_changes'))
    .pipe(plumber())
    .pipe(logger({
      showChange: true,
      before: '[development] Starting build js-files...',
      after: '[development] Building js-files complete',
    }))
    .pipe(filtered)
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(babel({
      presets: [
        ['@babel/env', { modules: false }],
      ],
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(routes.build.scripts))
    .pipe(filter('**/*.js'))
    .pipe(rename((path) => {
      path.basename += '.min';// до расширения файла
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(routes.build.scripts)) // выходная папка
    .pipe(touch())
    .pipe(size())
    .pipe(browserSync.stream());
}

// function buildJSForUncss() {
//  let filtered = filter(['**/*.js', '!**/_*.js']);
//
//  return gulp.src([routes.src.scripts_tmp], { allowEmpty: true, read: true })
//    .pipe(cache('files_changes'))
//    .pipe(plumber())
//    .pipe(logger({
//      showChange: true,
//      before: '[production] Starting build js-files...',
//    after:  '[production] Building js-files complete',
//    }))
//    .pipe(filtered)
//    .pipe(sourcemaps.init({ loadMaps: true }))
//    .pipe(sourcemaps.write('.'))
//    .pipe(gulp.dest(routes.build.scripts))
//    .pipe(filter('**/*.js'))
//    .pipe(rename(function (path) {
//      path.basename += ".min";//до расширения файла
//    }))
//    .pipe(sourcemaps.write('.'))
//    .pipe(gulp.dest(routes.build.scripts)) // выходная папка
//    .pipe(touch())
//    .pipe(size());
// }

// Отслеживание измененных js-файлов
function watchJS() {
	if (watchInBrowser) {
		browserSync.init(config);
	}
  const watcher = gulp.watch(routes.src.scripts, gulp.series(makeJSFiles, buildScripts)).on('change', browserSync.reload);
  const html_watcher = gulp.watch(source_dir  + '*.html').on('change', browserSync.reload);
  clearDeletedJS(watcher);
}

function clearJS() {
  return gulp.src([routes.build.scripts, routes.build.scripts_tmp], { read: false, allowEmpty: true })
    .pipe(logger({
      showChange: true,
      before: '[Action: delete] Clearing destination folder...',
      after: '[Action: delete] Destination folder cleared!',
    }))
    .pipe(clean({ force: true }));
}

function clearDeletedJS(watcher) {
  watcher.on('unlink', (filepath) => {
    const filePathFromSrc = path.relative(path.resolve('src'), filepath);

    const file = filePathFromSrc.split('/js/')[1]; // файл
    const [file_name, file_ext] = file.split('.');

    const delfile = path.resolve(routes.build.scripts, file);
    const tmpfile = path.resolve(routes.build.scripts_tmp, file);
    const delfilemap = path.resolve(routes.build.scripts, `${file}.map`);
    const delfilemin = path.resolve(routes.build.scripts, `${file_name}.min.${file_ext}`);
    const delfileminmap = path.resolve(routes.build.scripts, `${file_name}.min.${file_ext}.map`);


    del.sync(delfile, { force: true });
    console.log('[File deleted] ', delfile);

    del.sync(tmpfile, { force: true });
    console.log('[File deleted] ', tmpfile);

    del.sync(delfilemap, { force: true });
    console.log('[File deleted] ', delfilemap);

    del.sync(delfilemin, { force: true });
    console.log('[File deleted] ', delfilemin);

    del.sync(delfileminmap, { force: true });
    console.log('[File deleted] ', delfileminmap);
  });
}

function checkJS() {
  return gulp.src(routes.testJS, { allowEmpty: true, read: true })
    .pipe(plato('report', {
      jshint: {
        options: {
          strict: true,
        },
      },
      complexity: {
        trycatch: true,
      },
    }));
}

function qualityJS() {
  return gulp.src(`${routes.build.scripts}*.js`, { allowEmpty: true, read: true })
    .pipe(complexity());
}

function searchDuplicates() {
  return gulp.src(routes.testJS, { allowEmpty: true, read: true })
    .pipe(jscpd({
      'min-lines': 10,
      verbose: true,
    }));
}


//------------------------------------------------------------------------------


// All ==============================================================


// Отслеживание измененных файлов
function watchChanges() {
	if (watchInBrowser) {
		browserSync.init(config);
	}
  const css_watcher = gulp.watch(routes.src.styles, buildStyles).on('change', browserSync.reload);
  // const img_watcher = gulp.watch(routes.src.images, optimizeImages);
  const js_watcher_1 = gulp.watch(routes.src.scripts, makeJSFiles).on('change', browserSync.reload);
  // const js_watcher_2 = gulp.watch(routes.src.scripts_tmp, buildScripts);
  const html_watcher = gulp.watch(source_dir  + '*.html').on('change', browserSync.reload);

  clearDeletedCSS(css_watcher);
  clearDeletedJS(js_watcher_1);
}

function watchOnly() {
	if (watchInBrowser) {
		browserSync.init(config);
	}
  const css_watcher = gulp.watch(routes.src.styles).on('change', browserSync.reload);
  // const img_watcher = gulp.watch(routes.src.images, optimizeImages);
  const js_watcher_1 = gulp.watch(routes.src.scripts).on('change', browserSync.reload);
  // const js_watcher_2 = gulp.watch(routes.src.scripts_tmp, buildScripts);
  const html_watcher = gulp.watch(source_dir  + '*.html').on('change', browserSync.reload);

  // clearDeletedCSS(css_watcher);
  // clearDeletedJS(js_watcher_1);
}

// Удаление временной папки со скриптами
function clearTmp() {
  return gulp.src(`${tmp_dir}`, { read: false, allowEmpty: true })
    .pipe(logger({
      showChange: true,
      before: 'Starting delete "tmp" folder...',
      after: '"Tmp" folder deleted.',
    }))
    .pipe(clean({ force: true }));
}

// очистка дирректории с css-файлами от sourcemap-ов
function clearSourceMaps() {
  return gulp.src([`${dest_static}**/*.map`], { read: false, allowEmpty: true })
    .pipe(logger({
      showChange: true,
      before: 'Starting delete sourcemaps...',
      after: 'Sourcemaps deleted.',
    }))
    .pipe(clean({ force: true }));
}

function saveCache() {
  const css = `${routes.build.styles}**/*.css`;
  const maps = `${routes.build.styles}**/*.map`;
  // const maps = `${ src_static }css/**/*.map`;
  const js = `${routes.build.scripts}**/*.js`;
  const files_for_cache = [css, js].concat(routes.src.styles).concat(routes.src.scripts);

  return gulp.src(files_for_cache)
    .pipe(cache('files_changes'));
}

function clearCache() {
  return new Promise(((resolve, reject) => {
    delete cache.caches.files_changes;
    console.log('Cache cleared');
    resolve();
  }));
}

function watchOnly() {
	if (watchInBrowser) {
		browserSync.init(config);
  }
  const files = [`${dest_static}**/*`]
  const watcher = gulp.watch(files).on('change', browserSync.reload);

  // return new Promise(((resolve, reject) => {
  //   browserSync.reload;
  //   console.log('Cache cleared');
  //   resolve();
  // }));
}


//------------------------------------------------------------------------------


// Images


function optimizeImages() {
  return gulp.src(routes.src.images, { allowEmpty: true })
    .pipe(cache('files_changes'))
    .pipe(changed(routes.build.images))
    .pipe(logger({
      showChange: true,
      before: `[${mode.production() ? '[production] ' : '[development] '}]Starting optimize images...`,
      after: `${mode.production() ? '[production] ' : '[development] '}Images optimized.`,
    }))
    .pipe(imagemin())
    .pipe(flatten())
    .pipe(gulp.dest(routes.build.images)) // выходная папка
    .pipe(touch())
    .pipe(size())
    .pipe(browserSync.stream());
}

function convertToWEBP() {
  return gulp.src(routes.src.images, { allowEmpty: true })
    .pipe(cache('files_changes'))
    .pipe(changed(routes.build.images))
    .pipe(logger({
      showChange: true,
      before: 'Starting convert images...',
      after: 'Images converted.',
    }))
    .pipe(webp())
    .pipe(flatten())
    .pipe(gulp.dest(routes.build.images)) // выходная папка
    .pipe(touch())
    .pipe(size());
}

function watchImages() {
	if (watchInBrowser) {
		browserSync.init(config);
	}
  const img_watcher = gulp.watch(routes.src.images, optimizeImages).on('change', browserSync.reload);
}

function clearImages() {
  return gulp.src(routes.build.images, { read: false, allowEmpty: true })
    .pipe(logger({
      showChange: true,
      before: '[Action: delete] Starting delete images from build folder...',
      after: '[Action: delete] Images deleted.',
    }))
    .pipe(clean({ force: true }));
}


//------------------------------------------------------------------------------


// Plugins ==========================================================


function buildPlugins() {
  const css_filter = filter(['**/*.css', '!**/*.min.css'], { restore: true });
  const js_filter = filter(['**/*.js', '!**/*.min.js', '!**/orphus.js']);

  return gulp.src(`${routes.plugins.src}/**/*`, { allowEmpty: true })
    .pipe(cache('files_changes')) // Кэшируем для определения только измененных файлов
    .pipe(logger({
      showChange: true,
      before: 'Starting build plugins...',
      after: 'Building plugins complete.',
    }))
    .pipe(css_filter)
    .pipe(sass()) // переводим в css
    .pipe(autoprefixer({ // добавляем префиксы
      remove: false,
      cascade: false,
    }))
    .pipe(cleanCSS({ // минификация css
      compatibility: 'ie8', // default
    }))
    .pipe(rename((path) => { // до расширения файла
      path.basename += '.min';
    }))
    .pipe(gulp.dest((file) => // выходная папка
      file.base))
    .pipe(css_filter.restore)
    .pipe(js_filter)
    .pipe(babel({
      presets: [
        ['@babel/env', {
          modules: false,
        }],
      ],
    }))
    .pipe(minify({ // минификация js
      ext: {
        src: '.js',
        min: '.min.js',
      },
    }))
    .pipe(gulp.dest((file) => // выходная папка
      file.base))
    .pipe(touch())
    .pipe(size());
}
// временный костыль, выпилить как только настрою адекватную сборку
function copyPlugins() {
  const css_filter = filter(['**/*.css'], { restore: true });
  const js_filter = filter(['**/*.js',
    // `!${ routes.plugins.src }/fixed_on_scroll/**`,
    `!${routes.plugins.src}/load_images/**`,
    `!${routes.plugins.src}/orphus/**`,
  ]);

  return gulp.src([`${routes.plugins.src}/**/*`], { allowEmpty: true })
    .pipe(logger({
      showChange: true,
      before: '[Action: copy] Starting to copy plugins...',
      after: '[Action: copy] Plugins copied.',
    }))
  // .pipe(flatten())
    .pipe(css_filter)
    .pipe(gulp.dest(`${dest_static}css/`)) // выходная папка
    .pipe(css_filter.restore)
    .pipe(js_filter)
    .pipe(gulp.dest(`${dest_static}js/`)); // выходная папка
}

function copyLibs() {
  return gulp.src([`${routes.libs}/**/*`], { allowEmpty: true })
    .pipe(logger({
      showChange: true,
      before: '[Action: copy] Starting to copy libraries...',
      after: '[Action: copy] Libraries copied.',
    }))
    .pipe(gulp.dest(`${dest_static}/libs/`)); // выходная папка
}

function copyFonts() {
  const fonts = filter(['**/*', `!${src_static}font_styles/**`], { restore: true });
  const styles = filter(`${src_static}font_styles/**`);
  return gulp.src([`${src_static}fonts/**/*`, `${src_static}font_styles/**/*.css`], { allowEmpty: true })
    .pipe(logger({
      showChange: true,
      before: '[Action: copy] Starting to copy fonts...',
      after: '[Action: copy] Fonts copied.',
    }))
    .pipe(fonts)
    .pipe(gulp.dest(`${dest_static}/fonts`)) // выходная папка
    .pipe(fonts.restore)
    .pipe(styles)
    .pipe(gulp.dest(`${dest_static}/css`)); // выходная папка
}

function copyRootFolder() {
  return gulp.src([`${source_dir}*.*`], { allowEmpty: true })
    .pipe(logger({
      showChange: true,
      before: '[Action: copy] Starting to copy root files...',
      after: '[Action: copy] Root files copied.',
    }))
    .pipe(gulp.dest(`${dest_static}`)); // выходная папка
}

function clearCompres() {
  const sources = [
    `${dest_static}**/*.br`,
    `${dest_static}**/*.gz`,
    `${routes.libs}/**/*.br`,
    `${routes.libs}/**/*.gz`,
    `${routes.plugins.build}**/*.br`,
    `${routes.plugins.build}**/*.gz`,
  ];

  return gulp.src(sources, { read: false, allowEmpty: true })
  // .pipe(filtered)
    .pipe(logger({
      showChange: true,
      before: 'Starting delete compressed files...',
      after: 'Compressed files deleted!',
    }))
    .pipe(clean({ force: true }));
}

function removeCSSLib() {
  const templates = [`${routes.tpl.frontend}**/*.html`];
  const urls = ['https://www.oblgazeta.ru/', 'https://www.oblgazeta.ru/news'];
  const sources = templates.concat(urls);
  // let js = [`${routes.libs}**/*.js`]
  return gulp.src([`${routes.libs}/**/*.css`, `!${routes.libs}/**/light-*.css`], { allowEmpty: true })
    .pipe(logger({
      showChange: true,
      before: 'Starting remove unused styles from css-files...',
      after: 'Unused styles removed.',
    }))
    .pipe(uncss({
      html: sources,
      ignore: [
        /.*?\.collapsing.*?/gm,
        /.*?\.collapse.*?/gm,
        /(?<!(\,)).*?collapse\.in.*?/gm,
      ],
    }))
    .pipe(rename({
      prefix: 'light-',
    }))
    .pipe(gulp.dest((file) => file.base))
    // .pipe(gulp.dest(`${routes.libs}/cleared/`)) // выходная папка
    .pipe(touch())
    .pipe(size());
}

function minFonts() {
  const filtered = filter([`${src_static}font_styles/**/*.css`, `!${src_static}font_styles/**/*.min.css`]);
  return gulp.src(`${src_static}font_styles/**/*.css`, { allowEmpty: true })
    .pipe(cache('files_changes')) // Кэшируем для определения только измененных файлов
    .pipe(dependents()) // если есть связанные файлы, то меняем и их
    .pipe(logger({
      showChange: true,
      before: 'Starting minification font styles...',
      after: 'Font styles minificatied.',
    }))
    .pipe(autoprefixer({
      remove: false,
      cascade: false,
    })) // добавляем префиксы
    .pipe(filtered)
    .pipe(cleanCSS({
      compatibility: 'ie8', // default
    })) // минификация css
    .pipe(rename((src_dir) => {
      src_dir.basename += '.min'; // до расширения файла
    }))
    .pipe(gulp.dest((file) => file.base))
    .pipe(touch())
    .pipe(size());
}

function removeCSSFonts() {
  const templates = [`${routes.tpl.frontend}**/*.html`];
  const urls = [
    'https://www.oblgazeta.ru/society/99020/', // Ссылка на любой материал
    // 'https://www.oblgazeta.ru/', // Ссылка на главную
    // '', // Ссылка на страницу новостей
  ];
  const sources = templates.concat(urls).concat(unsedStyles.header.html);
  return gulp.src(`${src_static}styles/**/*.css`, { allowEmpty: true })
    .pipe(logger({
      showChange: true,
      before: 'Starting remove unused styles from font css-files...',
      after: 'Unused fonts styles removed.',
    }))
    .pipe(uncss({
      html: sources,
      ignore: ['.fa-chevron-up', '.fa-instagram', '.fa-twitter', '.fa-telegram-plane', '.fa-odnoklassniki'],
    }))
    .pipe(gulp.dest(routes.build.styles))
    .pipe(touch())
    .pipe(size());
}

function unusedBootstrap() {
  const templates = tpls_from;
  const urls = ['https://www.oblgazeta.ru/', 'https://www.oblgazeta.ru/news'];
  const sources = templates.concat(urls);
  return gulp.src([`${routes.libs}/bootstrap/css/*.css`, `!${routes.libs}/**/light-*.css`], { allowEmpty: true })
    .pipe(logger({
      showChange: true,
      before: 'Starting remove unused styles for bootstrap...',
      after: 'Unused bootstrap styles removed.',
    }))
    .pipe(uncss({
      html: sources,
      ignore: [
        /.*?\.collapsing.*?/gm,
        /.*?\.collapse.*?/gm,
        /(?<!(\,)).*?\.collapse\.in.*?/gm,
        /.*?\.glyphicon-chevron-left.*?/gm,
      ],
    }))
    .pipe(rename({
      prefix: 'light-',
    }))
    .pipe(gulp.dest((file) => file.base))
  // .pipe(gulp.dest(`${ dest_static }css/bootstrap/`)) // выходная папка
    .pipe(touch())
    .pipe(size());
}


function unusedHeader() {
  return gulp.src(unsedStyles.header.styles, { allowEmpty: true })
    .pipe(logger({
      showChange: true,
      before: 'Starting remove unused styles for header...',
      after: 'Unused styles removed.',
    }))
    .pipe(uncss({
      html: unsedStyles.header.html,
      ignore: [
        /.*?\.active.*?/gm,
        /.*?\.sp-active.*?/gm,
        /.*?\.-search-.*?/gm,
        /.*?\.opened.*?/gm,
        /(?<!(\,)).*?\.opened.*?/gm,
      ],
    }))
    .pipe(gulp.dest((file) => file.base))
    .pipe(touch())
    .pipe(size());
}
function unusedBase() {
  return gulp.src(unsedStyles.base.styles, { allowEmpty: true })
    .pipe(logger({
      showChange: true,
      before: 'Starting remove unused styles for base...',
      after: 'Unused styles removed.',
    }))
    .pipe(uncss({
      html: unsedStyles.base.html,
    }))
    .pipe(gulp.dest((file) => file.base))
    .pipe(touch())
    .pipe(size());
}
function unusedBaseLeft() {
  return gulp.src(unsedStyles.base_left.styles, { allowEmpty: true })
    .pipe(logger({
      showChange: true,
      before: 'Starting remove unused styles for base_left...',
      after: 'Unused styles removed.',
    }))
    .pipe(uncss({
      html: unsedStyles.base_left.html,
    }))
    .pipe(gulp.dest((file) => file.base))
    .pipe(touch())
    .pipe(size());
}
function unusedHome() {
  return gulp.src(unsedStyles.home.styles, { allowEmpty: true })
    .pipe(logger({
      showChange: true,
      before: 'Starting remove unused styles for home_page...',
      after: 'Unused styles removed.',
    }))
    .pipe(uncss({
      html: unsedStyles.home.html,
    }))
    .pipe(gulp.dest((file) => file.base))
    .pipe(touch())
    .pipe(size());
}
function unusedNews() {
  return gulp.src(unsedStyles.news.styles, { allowEmpty: true })
    .pipe(logger({
      showChange: true,
      before: 'Starting remove unused styles for news_page...',
      after: 'Unused styles removed.',
    }))
    .pipe(uncss({
      html: unsedStyles.news.html,
    }))
    .pipe(gulp.dest((file) => file.base))
    .pipe(touch())
    .pipe(size());
}
function unusedAuthor() {
  return gulp.src(unsedStyles.author.styles, { allowEmpty: true })
    .pipe(logger({
      showChange: true,
      before: 'Starting remove unused styles for author_page...',
      after: 'Unused styles removed.',
    }))
    .pipe(uncss({
      html: unsedStyles.author.html,
    }))
    .pipe(gulp.dest((file) => file.base))
    .pipe(touch())
    .pipe(size());
}
function unusedAuthors() {
  return gulp.src(unsedStyles.authors.styles, { allowEmpty: true })
    .pipe(logger({
      showChange: true,
      before: 'Starting remove unused styles for authors_page...',
      after: 'Unused styles removed.',
    }))
    .pipe(uncss({
      html: unsedStyles.authors.html,
    }))
    .pipe(gulp.dest((file) => file.base))
    .pipe(touch())
    .pipe(size());
}
function homeBase() {
  const files = [
    `${routes.build.styles}base_with_left_news.min.css`,
    // `${routes.build.styles}fontawesome-all.css`,
  ];
  return gulp.src(files, { allowEmpty: true })
    .pipe(logger({
      showChange: true,
      before: 'Starting build home_base...',
      after: 'Home_base built.',
    }))
    .pipe(concat('home_base.min.css'))
    .pipe(uncss({
      html: unsedStyles.home.html,
      // ignore: ['.fa-chevron-up']
    }))
    .pipe(rename('home_base.min.css'))
    .pipe(gulp.dest(routes.build.styles))
    .pipe(touch())
    .pipe(size());
}


//------------------------------------------------------------------------------


// JS
//  - main
exports.makeJSFiles = makeJSFiles;
exports.buildScripts = buildScripts;
exports.watchJS = watchJS;
exports.clearJS = clearJS;
// additional
// exports.buildJSForUncss = buildJSForUncss;
exports.checkJS = checkJS;
exports.qualityJS = qualityJS;
exports.searchDuplicates = searchDuplicates;


// CSS
//  - main
exports.buildStyles = buildStyles;
exports.watchCSS = watchCSS;
exports.clearCSS = clearCSS;
exports.styleLint = styleLint;

// additional
exports.unusedHome = unusedHome;
exports.unusedNews = unusedNews;
exports.unusedAuthor = unusedAuthor;
exports.unusedAuthors = unusedAuthors;
exports.unusedBase = unusedBase;
exports.unusedBaseLeft = unusedBaseLeft;
exports.unusedHeader = unusedHeader;
exports.unusedBootstrap = unusedBootstrap;

exports.homeBase = homeBase;


// Images
exports.optimizeImages = optimizeImages;
exports.watchImages = watchImages;
exports.clearImages = clearImages;


// All
exports.watchChanges = watchChanges;
exports.clearSourceMaps = clearSourceMaps;
exports.saveCache = saveCache;
exports.clearCache = clearCache;
exports.clearTmp = clearTmp;
exports.watchOnly = watchOnly;

// Fonts
exports.minFonts = minFonts;
exports.removeCSSFonts = removeCSSFonts;
exports.removeCSSLib = removeCSSLib;
exports.copyFonts = copyFonts;


// Plugins
exports.buildPlugins = buildPlugins;
exports.copyPlugins = copyPlugins;
exports.copyLibs = copyLibs;

exports.clearCompres = clearCompres;
exports.copyRootFolder = copyRootFolder;


//------------------------------------------------------------------------------


// Main tasks
// CSS
gulp.task('css', gulp.series(buildStyles, saveCache));
gulp.task('watch-css', gulp.series(buildStyles, saveCache, watchCSS));
gulp.task('build-css', gulp.series(buildStyles, gulp.parallel(clearSourceMaps, clearCache, clearTmp)));
gulp.task('clear-css', clearCSS);

// JS
gulp.task('js', gulp.series(clearTmp, makeJSFiles, buildScripts, saveCache));
gulp.task('watch-js', gulp.series(clearTmp, ['js'], watchJS));
gulp.task('build-js', gulp.series(makeJSFiles, buildScripts, gulp.parallel(clearSourceMaps, clearCache, clearTmp)));
gulp.task('clear-js', clearJS);

// Images
gulp.task('images', optimizeImages);
gulp.task('watch-images', optimizeImages, watchImages);
gulp.task('clear-images', clearImages);

// Clear
gulp.task('clear-cache', clearCache);
gulp.task('clear-tmp', clearTmp);

// Additional tasks
// Fonts
gulp.task('fonts', gulp.series(minFonts, removeCSSFonts));
// Plugins
gulp.task('build_plugins', buildPlugins);
gulp.task('copy_plug', copyPlugins);
gulp.task('get_plugs', gulp.series(buildPlugins, copyPlugins));
// libs
gulp.task('copy_libs', copyLibs);
gulp.task('unused', gulp.parallel(unusedBootstrap));

gulp.task('root', copyRootFolder);
gulp.task('cutcss', gulp.parallel(unusedBootstrap, ['fonts'], ['root']));
gulp.task('dep', gulp.series(['get_plugs'], copyLibs, ['cutcss']));

gulp.task('removeCSSLib', removeCSSLib);
gulp.task('clearCompres', clearCompres);


gulp.task('default', gulp.series(
  clearTmp, gulp.parallel(buildStyles, ['js']), saveCache,
  // clearTmp, gulp.parallel(buildStyles, optimizeImages, ['js']), saveCache
));
gulp.task('watch', gulp.series(
  clearTmp, gulp.parallel(buildStyles, ['js']),
  // clearTmp, gulp.parallel(buildStyles, optimizeImages, ['js']),
  saveCache, watchChanges,
));


gulp.task('watchonly', gulp.series(watchOnly));

gulp.task('build', gulp.series(
  clearTmp, gulp.parallel(buildStyles, ['js']),
  // clearTmp, gulp.parallel(buildStyles, optimizeImages, ['js']),
  // gulp.parallel(['root'], ['get_plugs'], copyLibs),
  gulp.parallel(clearSourceMaps, clearCache, clearTmp),
));


// Tests
// JS tests
gulp.task('js-check', checkJS);
gulp.task('js-quality', qualityJS);
gulp.task('js-searchDuplicates', searchDuplicates);


// gulp.task('pre-build', gulp.series(
//  gulp.parallel(stylesProd, optimizeImages, makeJSFiles),
//  buildJSForUncss));
//
// gulp.task('build-min', gulp.series(
//  // unusedHome, homeBase, unusedHeader, unusedBase, unusedBaseLeft,/*removeCSSLib, /*  /*unusedAuthor, unusedAuthors,*/
//  gulp.parallel(unusedHome, unusedHeader, unusedBase, unusedBaseLeft),
//  makeJSFiles, buildJSFilesProd,
//  gulp.parallel(clearSourceMaps, clearCache, clearTmp)));
