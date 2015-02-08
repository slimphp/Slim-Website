module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Watch
        watch: {
            js: {
                files: ['scripts/src/**/*.js'],
                tasks: ['concat', 'uglify']
            },
            less: {
                files: ['less/**/*.less'],
                tasks: ['less']
            }
        },

        // Compile LESS
        less: {
            production: {
                options: {
                    compress: true,
                    cleancss: true,
                    ieCompat: true
                },
                files: {
                    "css/all.css": "less/all.less"
                }
            }
        },

        // Concat scripts
        concat: {
            production: {
                files : {
                    "scripts/build/production.js": "scripts/src/**/*.js"
                }
            }
        },

        // Minify scripts
        uglify: {
            production: {
                options: {
                    compress: true,
                    preserveComments: false,
                    drop_console: true
                },
                files: {
                    "scripts/build/production.min.js": "scripts/build/production.js"
                }
            }
        }
    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['less','concat','uglify']);
};
