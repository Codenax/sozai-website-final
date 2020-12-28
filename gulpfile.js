//const { task, src, dest, parallel } = require('gulp');
const gulp 			= require('gulp');
const sass 			= require('gulp-sass');
const babel 		= require('gulp-babel');
const minifyJs 		= require('gulp-uglify');
const rename 		= require('gulp-rename');
const autoprefixer	= require('gulp-autoprefixer'); 
const gulpif 		= require('gulp-if'); 
require('dotenv').config();
var browserSync = require('browser-sync').create();


// Environment Setup (production | development )
var env = process.env.NODE_ENV || 'development';

gulp.task('js', function (){
	return gulp.src('./src/js/**/*.js')
		.pipe(babel({
			presets: ["@babel/preset-env"],
			plugins: ["@babel/plugin-proposal-class-properties"]
		}))
		.pipe(gulpif(env === 'production' , minifyJs())) 
		.pipe(gulpif(env === 'production' , rename({ extname: '.min.js' })))
		.pipe(gulp.dest('./assets/js'));
});
//gulpif(env === 'production' , {outputStyle: 'compressed'})
gulp.task('sass', () => { 
	return gulp.src('./src/sass/**/*.scss')
		.pipe( gulpif(env === 'development' , sass({outputStyle: 'expanded'} ).on('error', sass.logError) ) )
		.pipe( gulpif(env === 'production' , sass({outputStyle: 'compressed'} ).on('error', sass.logError) ) )
		.pipe(autoprefixer())
		.pipe(gulpif(env === 'production' , rename({ extname: '.min.css' }) ))
		.pipe(gulp.dest('./assets/css'));
});


gulp.task('watch', () => {  
	browserSync.init({
        server: "./"
    });

	gulp.watch('./src/sass/**/*.scss', gulp.parallel('sass')).on('change', browserSync.reload);
	gulp.watch('./src/js/**/*.js', gulp.parallel('js')).on('change', browserSync.reload); 
	gulp.watch("./*.html").on('change', browserSync.reload);
}); 


gulp.task('default', gulp.parallel('js', 'sass')); 
