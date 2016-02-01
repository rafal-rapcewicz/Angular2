module.exports = function () {
    var root = './';
    var clientApp = root + 'app/';
    var report = './report/';
    var wiredep = require('wiredep');
    var bowerFiles = wiredep({ devDependencies: true })['js'];
    var specRunnerFile = 'specRunner.html';
    var styles = root + 'styles/';
    var bower = {
        json: require('./bower.json'),
        directory: './libs/',
        ignorePath: ''
    };

    var config = {
        // all javascript that we want to vet
        alljs: [
			'./app/**/*.js'
        ],
        bower: bower,
        build: './build/',
        js: [
            clientApp + '**/*.module.js',
            clientApp + '**/*.js',
            '!' + clientApp + '**/*.spec.js',
            '!' + clientApp + '**/*.mock.js'
        ],
        jsTest: [
            clientApp + '**/*.module.js',
            clientApp + '**/*.js',
            '!' + clientApp + '**/*.spec.js',
            '!' + clientApp + '**/*.mock.js',
            '!' + clientApp + '**/*.route.js'
        ],
        jsOrder: [
            '**/app.module.js',
            '**/*.module.js',
            '**/*.js'
        ],
        htmltemplates: clientApp + '**/*.html',
        styles: {
            folder: styles,
            sass: styles + '*.scss',
            css: styles + '*.css'
        },
        fonts: bower.directory + 'font-awesome/fonts/**/*.*',
        images: root + 'media/images/**/*.*',
        index: 'index.html',
        specRunner: root + specRunnerFile,
        specRunnerFile: specRunnerFile,
        root: root,
        specs: [clientApp + '**/*.spec.js'],
        specsAndMocks: [clientApp + '**/*.spec.js', clientApp + '**/*.mock.js'],
        serverIntegrationSpecs: [],
        temp: './.tmp/',
        templateCache: {
            file: 'templates.js',
            options: {
                module: 'app',
                standAlone: false,
                root: 'app/'
            }
        },
        typescript: {
            allts: clientApp + '**/*.ts',
            typings: root + 'tools/typings/',
            output: root + 'app/',              
            outputMap: root + 'app/**/*.js.map',            
            libraryTypeScriptDefinitions: root + 'libs/typings/**/*.ts'
        }
    }

    /**
     * wiredep and bower settings
     */
    config.getWiredepDefaultOptions = function () {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };

        return options;
    };

    /**
     * karma settings
     */
    config.karma = getKarmaOptions();

    return config;

    ////////////////////////////////////////////////

    function getKarmaOptions() {
        var options = {
            files: [].concat(
                bowerFiles,
                clientApp + '**/*.module.js',
                clientApp + '**/*.js',
                config.serverIntegrationSpecs
            ),
            exclude: [],
            coverage: {
                dir: report + 'coverage',
                reporters: [
                    // reporters not supporting the `file` property
                    { type: 'html', subdir: 'report-html' },
                    { type: 'lcov', subdir: 'report-lcov' },
                    { type: 'text-summary' } //, subdir: '.', file: 'text-summary.txt'}
                ]
            },
            preprocessors: {}
        };
        options.preprocessors[clientApp + '**/!(*.spec|*.mock)+(.js)'] = ['coverage'];
        return options;
    }
}