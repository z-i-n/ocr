'use strict';
    var runSequence = require('run-sequence');
    var express = require('express');
    var gulp = require('gulp');
    var gulpif = require('gulp-if');
    var clean = require("gulp-clean");
    var concat = require("gulp-concat");
    var gutil = require("gulp-util");
    var uglify = require("gulp-uglify");
    var eslint = require("gulp-eslint");
    var inject = require("gulp-inject");
    var sass = require('gulp-sass');
    var sassLint =  require('gulp-sass-lint');
    var sourcemaps = require('gulp-sourcemaps');
    var nodemon = require("gulp-nodemon");
    var source = require('vinyl-source-stream');
    var browserify = require('browserify');
    var watchify = require('watchify');
    var buffer = require('vinyl-buffer');
    var babelify = require("babelify");
    var watchify = require('watchify');
    var envify = require('loose-envify');
    var path = require("path");


    /* config object */
    var config = {
        dev: !gutil.env.production
    };

    var error = function () {
        bundler.close()
    };

    //nodemon : server 시작 및 소스 파일 변경시 자동 재시작
    gulp.task('server-dev', function () {
      nodemon({
        script: './server/index.js',
        watch: './server/'
      , ext: 'js html'
      , env: { 'NODE_ENV': 'development' }
      })
    });

    /* JSHint */
    gulp.task('lint-js', function(cb) {
        var thresholdWarnings = 0;
      return gulp.src(['./src/js/**/*.js', '!./src/js/plugins/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        // .pipe(eslintThreshold.afterWarnings(thresholdWarnings, function (numberOfWarnings) {
        //     throw new Error('ESLint warnings (' + numberOfWarnings + ') equal to or greater than the threshold (' + thresholdWarnings + ')');
        // }))
        .pipe(eslint.failAfterError()).on('error', function(err){
            console.log(err);
            process.exit();
        });
        // .pipe(eslint.format('checkstyle'))
        // .pipe(eslint.result(result => {
        //     // Called for each ESLint result.
        //     console.log(`ESLint result: ${result.filePath}`);
        //     console.log(`# Messages: ${result.messages.length}`);
        //     console.log(`# Warnings: ${result.warningCount}`);
        //     console.log(`# Errors: ${result.errorCount}`);
        //}));
    });

    gulp.task('del-file', function() {
        return gulp.src('./dist/*', {read: false}) 
                .pipe(clean()); 
    });

    gulp.task('copy-resource', ['del-file'], function() {
        return gulp.src('./resource/**.*') 
            .pipe(gulp.dest('./dist/resource/')); 
        ;
    });

    gulp.task('copy-font', ['del-file'], function() {
        gulp.src('./node_modules/bootstrap-sass/assets/fonts/bootstrap/**.*') 
            .pipe(gulp.dest('./dist/fonts/bootstrap/')); 
        gulp.src('./node_modules/font-awesome/fonts/**.*') 
            .pipe(gulp.dest('./dist/fonts/'));
        return;
    });

    gulp.task('copy-css', ['del-file'], function() {
        return gulp.src([
                './node_modules/font-awesome/css/font-awesome.css',
                './node_modules/nouislider/distribute/nouislider.min.css'
            ]) 
            .pipe(gulp.dest('./dist/css/')); 
    });

    gulp.task('copy-js', ['del-file'], function() {
        return gulp.src([
                './node_modules/jquery/dist/jquery.js',
                './node_modules/metismenu/dist/metisMenu.js'
            ]) 
            .pipe(concat('_vender.js'))
            .pipe(gulp.dest('./dist/js/'));
    });

    /* sass lint */
    gulp.task('lint-sass', ['del-file'], function () {
      return gulp.src('src/sass/**/*.s+(a|c)ss')
        .pipe(sassLint( { options: {
            formatter: 'stylish',
            'merge-default-rules': false
          }}))
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError()).on('error', function(err){
            //console.log(err);
        });
    });

    // Compiles SASS > CSS
    gulp.task('build-sass', ['lint-sass'],  function () {
    return gulp.src('src/sass/**/*.scss')
        .pipe( gulpif(config.dev, sourcemaps.init({loadMaps: true})) )
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: ['node_modules/bootstrap-sass/assets/stylesheets']
        }).on('error', sass.logError))
        .pipe(  gulpif(config.dev, sourcemaps.write('./')) )
        .pipe(gulp.dest('dist/css'));
    });

    /* bundler object */
    var watcherSass,
        bundler =  browserify({
            basedir: 'src/js',
            insertGlobals: true,
            entries: 'index.js',
            debug: config.dev,
            cache: {}, // required for watchify
            packageCache: {}, // required for watchify
            extensions: ['.js'],
            fullPaths: config.dev // required to be true only for watchify
        })
        .transform(
            babelify/*, {presets: ["es2015","react"], ignore: /\/node_modules\//}*/
        )
        .transform(envify, {
              "global": true,
              "NODE_ENV": config.dev ? "development" : "production",
              "_": "purge"
         });

    if (config.dev) {
        //bundler = watchify(bundler, {ignoreWatch: ['package.json','**/node_modules/**']});
        bundler = bundler.plugin(watchify, {ignoreWatch: ['**/package.json','**/node_modules/**']});
        watcherSass = gulp.watch('src/sass/**/*.scss', ['build']);
        watcherSass.on('change', function(event) {
            console.log('Sass File ' + event.path + ' was ' + event.type + ', running tasks...');
            runSequence('build-sass');
        });
    }
    /* build
     1. browerify
     2. watchify
     3. bundle
     4. sourcemap
     5. uglify
     6. copy dist
    */
    gulp.task('build-js', ['lint-js'], function() {
        return bundler.bundle().on('error', function(err) {
                gutil.log(
                    gutil.colors.red("Browserify compile error:"),
                    err.message
                );
                bundler.close();
                process.exit();
            })
            .pipe(source('bundle.js'))
            .pipe(buffer())
            .pipe( gulpif(config.dev, sourcemaps.init({loadMaps: true})) )
            .pipe( gulpif(!config.dev, uglify()) )
            .pipe( gulpif(config.dev, sourcemaps.write('./')) )
            .pipe(gulp.dest('dist/js'));
    });

    /* watch task */
    gulp.task('watch', ['build'], function() {
        bundler.on('update', function(ids) {
            console.log(ids);
            console.log('-> detect file changes...');
            runSequence('build-js');
        });
    });

    /* HTML */
    gulp.task('process-html', ['build-js'], function() {
        return gulp.src('./src/**/*.html')
            .pipe(inject(gulp.src('./dist/js/*.js', {read: false}), {
                addRootSlash : false,
                //ignorePath : 'src/main/webapp',
                transform : function ( filePath, file, i, length ) {
                    var newPath = filePath.replace( 'dist/', '/' );
                    return '<script src="' + newPath  + '?t=' + new Date().getTime() + '"></script>';
                }
            } ))
            .pipe(inject(gulp.src('./dist/css/*.css', {read: false}), {
                addRootSlash : false,
                //ignorePath : 'src/main/webapp',
                transform : function ( filePath, file, i, length ) {
                    var newPath = filePath.replace( 'dist/', '/' );
                    return '<link rel="stylesheet" href="' + newPath  + '"/>';
                }
            } ))
            .pipe(gulp.dest('./dist'));
    });


    /* build (for production), dev (for development) */
    gulp.task('build', ['del-file', 'copy-resource', 'copy-font', 'copy-css', 'copy-js', 'lint-sass', 'build-sass', 'lint-js', 'build-js', 'process-html']);
    gulp.task('dev', ['build', 'watch', 'server-dev']);

    /*
    production : gulp --production
    development: gulp
    */
    gulp.task('default', config.dev ? ['dev'] : ['build']);
