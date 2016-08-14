/**
 * Created by vivek on 13/08/16.
 */
module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                reporter: require('jshint-stylish')
            },
            build: ['Gruntfile.js', 'app/lib/**/*.js', 'app/ng/**/*.js']
        },
        clean: {
            dist: ['.tmp', 'dist'],
            tmp: ['.tmp']
        },
        wiredep: {
            task: {
                src: ['app/index.html']
            }
        },
        useminPrepare: {
            html: 'app/index.html',
            options: {
                dest: 'dist/app'
            }
        },
        usemin: {
            html: 'dist/app/index.html',
            css: 'dist/app/css/style.css',
            options: {
                assetsDir: ['dist/app']
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: 'app',
                    dest: 'dist/app',
                    src: [
                        '*.{ico, png, txt}',
                        '*.html',
                        'ng/**/*.html'
                    ]
                }]
            },
            fonts: {
                files: [{
                    expand: true,
                    cwd: 'app/bower_components/roboto-fontface/fonts/roboto',
                    dest: 'dist/fonts/roboto',
                    src: ['**/*.woff2']
                },
                {
                    expand: true,
                    cwd: 'app/bower_components/components-font-awesome/fonts',
                    dest: 'dist/app/fonts',
                    src: ['**']
                }]
            },
            electron: {
                files: [{
                    expand:true,
                    dest: 'dist',
                    src: [
                        'main.js'
                    ]
                },{
                    expand:true,
                    dest: 'dist/app/',
                    cwd: 'app',
                    src: [
                        'lib/**'
                    ]
                }, {
                    expand:true,
                    dest: 'dist',
                    dot: true,
                    src: [
                        'package.json'
                    ]
                }]
            }
        }
    });

    grunt.registerTask('default', ['jshint:build', 'uglify:build', 'cssmin:build']);
    grunt.registerTask('buildbower', ['clean:build', 'bower_concat', 'uglify:bower', 'clean:tmp']);

    grunt.registerTask('build', [
        'jshint',
        'clean',
        'wiredep',
        'useminPrepare',
        'concat:generated',
        'cssmin:generated',
        'uglify:generated',
        'copy:dist',
        'usemin',
        'copy:fonts',
        'copy:electron',
        'clean:tmp'
    ]);

};