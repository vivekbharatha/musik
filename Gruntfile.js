/**
 * Created by vivek on 13/08/16.
 */
module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        wiredep: {
            task: {
                src: ['app/index.html']
            }
        },
        jshint: {
            options: {
                reporter: require('jshint-stylish')
            },
            build: ['Gruntfile.js', 'app/lib/**/*.js', 'app/ng/**/*.js']
        },
        clean: {
            build: ['dist'],
            tmp: ['dist/tmp']
        },
        uglify: {
            options: {
                banner: '/*\n <%= pkg.name %> - <%= grunt.template.today("yyyy-mm-dd") %> \n*/'
            },
            build: {
                files: {
                    'dist/js/main.js': ['app/lib/**/*.js', 'app/ng/**/*.js']
                }
            },
            bower: {
                options: {
                    mangle: true,
                    compress: true
                },
                files: {
                    'dist/js/vendor.min.js': 'dist/tmp/bower.js'
                }
            }
        },
        cssmin: {
            options: {
                banner: '/*\n <%= pkg.name %> - <%= grunt.template.today("yyyy-mm-dd") %> \n*/'
            },
            build: {
                files:{
                    'dist/css/main.css': ['app/css/**/*.css']
                }
            }
        },
        bower_concat: {
            all: {
                dest: 'dist/tmp/bower.js'
            }
        }
    });

    grunt.registerTask('default', ['jshint:build', 'uglify:build', 'cssmin:build']);
    grunt.registerTask('buildbower', ['clean:build', 'bower_concat', 'uglify:bower', 'clean:tmp']);

    grunt.registerTask('build', ['buildbower', 'default', 'clean:tmp']);



};