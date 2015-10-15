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

/**
 * build lib
 */

gulp.task('build.lib.clean', function () {
	return del('public/vendor/lib');
});

gulp.task('build.lib.bootstrap', function () {
	return gulp.src([
			'app/vendor/bower_components/bootstrap/dist/**/*'
		])
		.pipe(gulp.dest('public/vendor/lib/bootstrap'));
});

gulp.task('build.lib.jquery', function () {
	return gulp.src([
			'app/vendor/bower_components/jquery/dist/*'
		])
		.pipe(gulp.dest('public/vendor/lib/jquery/'));
});

gulp.task('build.lib.angular2', function () {
	return gulp.src([
			'node_modules/traceur/bin/traceur-runtime.js',
			'node_modules/systemjs/dist/system.src.js',
			'node_modules/angular2/bundles/angular2.dev.js',
			'node_modules/angular2/bundles/router.dev.js',
			'node_modules/angular2/bundles/http.dev.js'
		])
		.pipe(gulp.dest('public/vendor/lib'));
});

gulp.task('build.lib', ['build.lib.clean'], function () {
	return runSequence('build.lib.bootstrap', 'build.lib.angular2', 'build.lib.jquery');
});

// build app

gulp.task('build.app.clean', function () {
	return del(['public/components', 'public/images', 'public/javascripts', 'public/services', 'public/*.*']);
});

gulp.task('build.app.ts', function () {
	return gulp.src(['app/**/*.ts'])
		.pipe(typescript({
			"emitDecoratorMetadata": true,
			"experimentalDecorators": true,
			"target": "ES5",
			"module": "commonjs",
			"outDir": "public",
			"removeComments": true,
			"sourceMap": false
		}))
		.pipe(gulp.dest('public'));
});

gulp.task('build.app.less', function () {
	return gulp.src(['app/**/*.less', '!app/vendor/**/*.less'])
		.pipe(less())
		.pipe(gulp.dest('public'));
});

gulp.task('build.app.js', function () {	
	return gulp.src(['app/javascripts/*.js'])
		.pipe(gulp.dest('public/javascripts'));
});

gulp.task('build.app.html', function () {	
	return gulp.src(['app/**/*.html', '!app/vendor/**/*.html'])
		.pipe(gulp.dest('public'));
});

gulp.task('build.app.image', function () {	
	return gulp.src(['app/images/*'])
		.pipe(gulp.dest('public/images'));
});

gulp.task('build.app.others', function () {
	return gulp.src(['app/*.*', '!app/*.less', '!app/*.html', '!app/*.ts'])
		.pipe(gulp.dest('public'));
});

gulp.task('build.app', ['build.app.clean'], function () {
	return runSequence('build.app.ts', 'build.app.less', 'build.app.js', 'build.app.html', 'build.app.image', 'build.app.others');
});

// build all

gulp.task('build.clean', function () {
	return runSequence('build.less.clean', 'build.lib.clean', 'build.app.clean');	
});

gulp.task('build', function () {
	return runSequence('build.less', 'build.lib', 'build.app');
});

// watch

gulp.task('build.watch.less', function () {
	return gulp.src('stylesheets/less/**/*.less')
		.pipe(watch('stylesheets/less/**/*.less'))
		.pipe(less())
		.pipe(gulp.dest('public/css'));
});

gulp.task('build.watch.app.html', function () {
	return gulp.src(['app/**/*.html', '!app/vendor/**', 'app/*.html'])
		.pipe(watch(['app/**/*.html', '!app/vendor/**', 'app/*.html']))
		.pipe(gulp.dest('public'));
});

gulp.task('build.watch.app.less', function () {
	return gulp.src(['app/**/*.less', '!app/vendor/**', 'app/*.less'])
		.pipe(watch(['app/**/*.less', '!app/vendor/**', 'app/*.less']))
		.pipe(less())
		.pipe(gulp.dest('public'));
});

gulp.task('build.watch.app.ts', function () {
	gulp.watch(['app/**/*.ts'], ['build.app.ts']);
});