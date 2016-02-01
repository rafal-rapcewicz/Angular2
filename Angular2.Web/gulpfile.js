var
    gulp = require('gulp'),
    $ = require('gulp-load-plugins')({ lazy: true }),
    config = require('./gulp.config')(),
    tsProject = $.typescript.createProject('tsconfig.json', { typescript: require('typescript') }),    
    del = require('del');

/**
 * Compiling Typescript --> Javascript
 * @return {Stream}
 */
gulp.task('compile-ts', function () {
    log('Compiling TypeScript --> js');
    var tsResult = gulp
        .src([config.typescript.allts, config.typescript.libraryTypeScriptDefinitions])
        .pipe($.sourcemaps.init())
        .pipe($.typescript(tsProject));

    tsResult.dts.pipe(gulp.dest('.'));

    return tsResult.js.pipe($.sourcemaps.write('.'))
                      .pipe(gulp.dest(config.typescript.output));
});

/**
 * vet the code and create coverage report
 * @return {Stream}
 */
gulp.task('vet', function () {
    log('Analyzing source with JSHint and JSCS');

    return gulp
        .src(config.alljs)
        .pipe($.plumber())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', { verbose: true }))
        .pipe($.jshint.reporter('fail'))
        .pipe($.jscs());
});

/**
 * Wire-up the bower dependencies and custom js files
 * @return {Stream}
 */
gulp.task('inject-js', ['ts'], function () {
    log('Wiring the bower dependencies into the html');

    var wiredep = require('wiredep').stream;
    var options = config.getWiredepDefaultOptions();

    // Only include stubs if flag is enabled
    // var js = args.stubs ? [].concat(config.js, config.stubsjs) : config.js;
    var js = config.js;

    return gulp
        .src(config.index)
        .pipe($.plumber())
        .pipe(wiredep(options))
        .pipe(inject(js, '', config.jsOrder))
        .pipe(gulp.dest(config.root));
});

gulp.task('inject-styles', ['sass'], function () {
    log('Wire up css into the html, after files are ready');

    return gulp
        .src(config.index)
        .pipe(inject(config.styles.css))
        .pipe(gulp.dest(config.root));
});

/**
 * Compress images
 * @return {Stream}
 */
gulp.task('build-images', ['clean-images'], function () {
    log('Compressing and copying images to build folder');

    return gulp
        .src(config.images)
        .pipe($.imagemin({ optimizationLevel: 4 }))
        .pipe(gulp.dest(config.build + 'media/images'));
});

/**
 * Copy fonts
 * @return {Stream}
 */
gulp.task('build-fonts', ['clean-fonts'], function () {
    log('Copying fonts to build folder');

    return gulp
        .src(config.fonts)
        .pipe(gulp.dest(config.build + config.bower.directory + 'font-awesome/fonts/'));
});

 
gulp.task('build-templatecache', ['clean-code'], function () {
    log('Creating templates caches in build folder');

    return gulp
        .src(config.htmltemplates)
        .pipe($.plumber())
        .pipe($.minifyHtml({ empty: true }))
        .pipe($.angularTemplatecache(
            config.templateCache.file,
            config.templateCache.options
        ))
        .pipe(gulp.dest(config.temp));
});

gulp.task('optimize', ['inject-js', 'build-templatecache'], function () {
    log('Optimizing javascript, css and html files and saving these in build folder');

    var templateCache = config.temp + config.templateCache.file;

    return gulp
        .src(config.index)
        .pipe($.plumber())
        .pipe(inject(templateCache, 'templates'))
        .pipe($.useref())
        .pipe(gulp.dest(config.build));
})

gulp.task('build', ['optimize', 'build-images', 'build-fonts'], function () {
    log('Building everything');
    del(config.temp);

    log('Deployed to build folder');
});

gulp.task('test', function (done) {
    startTests(true /*singleRun*/, done);
});

/**
 * Inject all the spec files into the specRunner.html
 * @return {Stream}
 */
gulp.task('build-specs', function (done) {
    log('building the spec runner');

    var wiredep = require('wiredep').stream;
    var options = config.getWiredepDefaultOptions();

    options.devDependencies = true;

    return gulp
        .src(config.specRunner)
        .pipe(wiredep(options))
        .pipe(inject(config.jsTest, '', config.jsOrder))
        .pipe(inject(config.specsAndMocks, 'specs', ['**/*']))
        .pipe(gulp.dest(config.root));
});

/**
 * Compiling Sass --> CSS
 * @return {Stream}
 */
gulp.task('sass', function () {
    log('Compiling Sass --> CSS');

    return gulp
        .src(config.styles.sass)
        .pipe($.sass().on('error', $.sass.logError))
        .pipe(gulp.dest(config.styles.folder));
});

/**
 * Lint all typescript files
 * @return {Stream}
 */
gulp.task('ts-lint', function () {
    return gulp
        .src(config.typescript.allts)
        .pipe($.tslint())
        .pipe($.tslint.report('prose'));
});

/**
* Removes all js.map files
* @return {Stream}
*/
gulp.task('clean-ts', function () {
    clean(config.typescript.outputMap);
});

/**
 * Remove all js and html from the build and temp folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-code', function () {
    var files = [].concat(
        config.temp + '**/*.js',
        config.build + 'js/**/*.js',
        config.build + '**/*.html'
    );

    clean(files);
});

/**
 * Remove all js and html from the build and temp folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-images', function () {
    clean(config.build + 'images/**/*.*');
});


/**
 * Remove all fonts from the build folder
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-fonts', function () {
    clean(config.build + 'fonts/**/*.*');
});

/**
*  Lints and compiles typescript files
*  @return {Stream}
*/
gulp.task('ts', ['ts-lint', 'compile-ts']);

/**
 * Watching changes in typescript files
 */
gulp.task('ts-watch', function () {
    gulp.watch([config.typescript.allts], ['ts']);
});

/**
 * Watching changes in sass files
 */
gulp.task('sass-watch', function () {
    gulp.watch([config.styles.sass], ['sass']);
});

/**
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 */
function log(msg) {
    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}

/**
 * Inject files in a sorted sequence at a specified inject label
 * @param   {Array} src   glob pattern for source files
 * @param   {String} label   The label name
 * @param   {Array} order   glob pattern for sort order of the files
 * @returns {Stream}   The stream
 */
function inject(src, label, order) {
    var options = { read: false };
    if (label) {
        options.name = 'inject:' + label;
    }

    return $.inject(orderSrc(src, order), options);
}

/**
 * Order a stream
 * @param   {Stream} src   The gulp.src stream
 * @param   {Array} order Glob array pattern
 * @returns {Stream} The ordered stream
 */
function orderSrc(src, order) {
    //order = order || ['**/*'];
    return gulp
        .src(src)
        .pipe($.if(order, $.order(order)));
}

/**
 * Delete all files in a given path
 * @param  {Array}   path - array of paths to delete
 * @param  {Function} done - callback when complete
 */
function clean(path) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path);
}

/**
 * Start the tests using karma.
 * @param  {boolean} singleRun - True means run once and end (CI), or keep running (dev)
 * @param  {Function} done - Callback to fire when karma is done
 * @return {undefined}
 */
function startTests(singleRun, done) {
    var excludeFiles = [];
    var karma = require('karma').server;
    var serverSpecs = config.serverIntegrationSpecs;

    if (serverSpecs && serverSpecs.length) {
        excludeFiles = serverSpecs;
    }

    karma.start({
        configFile: __dirname + '/karma.conf.js',
        exclude: excludeFiles,
        singleRun: !!singleRun
    }, karmaCompleted);

    ////////////////

    function karmaCompleted(karmaResult) {
        log('Karma completed');

        if (karmaResult === 1) {
            done('karma: tests failed with code ' + karmaResult);
        } else {
            done();
        }
    }
}
