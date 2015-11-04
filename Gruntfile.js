module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Watch
        watch: {
            js: {
                files: ['assets/scripts/src/**/*.js'],
                tasks: ['concat', 'uglify']
            },
            less: {
                files: [
                    'assets/less/**/*.less',
                    'assets/bootstrap/less/**/*.less'
                ],
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
                    "assets/css/all.css": [
                        "assets/bootstrap/less/bootstrap.less",
                        "assets/less/all.less"
                    ]
                }
            }
        },

        // Concat scripts
        concat: {
            production: {
                files : {
                    "assets/scripts/build/production.js": [
                        "assets/scripts/src/**/*.js",
                        "assets/bootstrap/js/**/*.js"
                    ]
                }
            }
        },

        // Minify scripts
        uglify: {
            production: {
                options: {
                    compress: {},
                    preserveComments: false,
                    drop_console: true
                },
                files: {
                    "assets/scripts/build/production.min.js": "assets/scripts/build/production.js"
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
