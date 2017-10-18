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
            },
            pdf: {
                options: {
                    compress: true,
                    cleancss: true,
                    ieCompat: true
                },
                files: {
                    "assets/css/pdf.css": [
                        "assets/bootstrap/less/bootstrap.less",
                        "assets/less/pdf.less"
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
        },

        // Documentation PDF
        html_pdf: {
            docs: {
                options: {
                    format: 'Letter',
                    orientation: 'portrait',
                    quality: '75',
                    border: {
                        top: '.1in',
                        right: '.25in',
                        left: '.25in',
                        bottom: '.1in'
                    }
                },
                files: {
                    'docs/docs.pdf': ['_site/docs.pdf.html']
                }
            }
        }
    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-html-pdf-2');

    // Default task(s).
    grunt.registerTask('default', ['less','concat','uglify']);
};
