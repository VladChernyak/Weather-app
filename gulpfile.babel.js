import { src, pipe, dest, task, watch } from 'gulp';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import uglify from 'gulp-uglify';
import buffer from 'vinyl-buffer';
import less  from 'gulp-less';
import concat from 'gulp-concat';
import cleanCss from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';


function processJs() {
    return browserify({
        entries: ['./js/index.js', './js/carousel.js']
    })
    .transform(babelify.configure({
        presets: ["@babel/preset-env"]
    }))
    .bundle()
    .pipe(source('index.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(dest('./build/js'))
}

function processLess() {
    return src('./less/*.less')
    .pipe(less())
    .pipe(dest('./css/'))

}

function processCss() {
    return src('./css/*.css')
    .pipe(concat('styles.css'))
    .pipe(autoprefixer({
        cascade: true
    }))
    .pipe(cleanCss({
        level: 2
    }))
    .pipe(dest('./build/css'))
}

function processLibs() {
    return src(['./node_modules/jquery/dist/jquery.min.js', './js/owl.carousel.min.js'])
    .pipe(concat('libs.js'))
    .pipe(dest('./build/js'))
}



function watchDev() {
    watch('./js/*.js', processJs);
    watch('./less/*.less', processLess);
    watch('./css/*.css', processCss);
}

task('watch', watchDev);
task('libs', processLibs)
// export default processJs;