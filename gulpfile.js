'use strict'

// help: https://www.npmjs.com/package/gulp-less
// help: https://github.com/floatdrop/gulp-watch
var gulp = require('gulp'),
	gulpFilter = require('gulp-filter'),
	less = require('gulp-less'),
	path = require('path'),
	watch = require('gulp-watch'),
	runSequence = require('run-sequence'),
	del = require('del'),
	typescript = require('gulp-tsc');

// build less 

gulp.task('build.less.clean', function () {
	return del('public/css');
});
	
gulp.task('build.less', ['build.less.clean'], function () {
	return gulp.src('stylesheets/less/**/*.less')
		.pipe(less({
			paths: [ path.join(__dirname, 'less')]
		}))
		.pipe(gulp.dest('public/css'));
});

gulp.task('build.watch-less', function () {
	return gulp.src('stylesheets/less/**/*.less')
		.pipe(watch('stylesheets/less/**/*.less'))
		.pipe(less())
		.pipe(gulp.dest('public/css'));
});

// build lib 

gulp.task('build.lib.clean', function () {
	return del('public/vendor/lib');
});

gulp.task('build.lib', ['build.lib.clean'], function () {
	return gulp.src([
			'app/vendor/bower_components/traceur-runtime/traceur-runtime.js',
			'app/vendor/bower_components/system.js/dist/system.js',
			'app/vendor/bower_components/es6-module-loader/dist/es6-module-loader.js',
			'node_modules/angular2/bundles/angular2.dev.js'
		])
		.pipe(gulp.dest('public/vendor/lib'));
});

// build app

gulp.task('build.app.clean', function () {
	return del(['public/components', 'public/images', 'public/javascripts', 'public/services', 'public/*.*']);
});

gulp.task('build.app', ['build.app.clean'], function () {
	var filter = gulpFilter(['*', '!app/vendor'], {restore: true});
	var tsFilter = gulpFilter('**/*.ts', {restore: true});
	var lessFilter = gulpFilter('**/*.less', {restore: true});
	
	return gulp.src(['app/*'])
		.pipe(filter)
		.pipe(tsFilter)
		.pipe(typescript({ 
			"emitDecoratorMetadata": true,
			"experimentalDecorators": true,
			"target": "ES5",
			"module": "commonjs",
			"outDir": "public",
			"removeComments": true
		}))
		.pipe(tsFilter.restore)
		.pipe(lessFilter)
		.pipe(less())
		.pipe(lessFilter.restore)
		.pipe(gulp.dest('public'));
});

// build all

gulp.task('build.clean', function () {
	runSequence('build.less.clean', 'build.lib.clean', 'build.app.clean');	
});

gulp.task('build', function () {
	runSequence('build.less', 'build.lib', 'build.app');
});
