/**
 * Created by vivek on 13/08/16.
 */
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                reporter: require('jshint-stylish')
            },
            build: ['Gruntfile.js', 'app/lib/**/*.js', 'app/ng/**/*.js']
        },
        uglify: {
            options: {
                banner: '/*\n <%= pkg.name %> - <%= grunt.template.today("yyyy-mm-dd") %> \n*/'
            },
            build: {
                files: {
                    'dist/js/main.js': ['app/lib/**/*.js', 'app/ng/**/*.js']
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
        }
    });

    grunt.registerTask('default', ['jshint', 'uglify', 'cssmin']);

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

};