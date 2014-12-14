'use strict';

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: {
            src: 'lib',
            dev: 'app',
            dist: 'dist',
            tmp: '.tmp',
            libs: [],
            node: 'node_modules'
        },
        banner: '/*!\n' +
        ' * <%= pkg.name %>-<%= pkg.version %>\n' +
        ' * <%= pkg.author %>\n' +
        ' * <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' */\n\n',
        browserify: {
            'dev': {
                'src': 'index.js',
                'dest': '<%= config.dev %>/main.js',
                'options': {
                    'debug': true,
                    'watch': true,
                    'verbose': true,
                    'open': true,
                    'browserifyOptions' : {'debug': true}
                }
            },
            'dist': {
                'src': 'index.js',
                'dest': '<%= config.dist %>/main.js',
                'options': {
                    'debug': false,
                    'verbose': false
                }
            }
        },
        less: {
            dev: {
                options: {
                    compress: true,
                    sourceMap: true,
                    sourceMapFilename: '<%= config.dev %>/main.css.map',
                    sourceMapBasepath: '<%= config.dev %>/'
                },
                files: {
                    '<%= config.dev %>/css/main.css': '<%= config.src %>/less/main.less'
                }
            },
            dist: {
                options: {
                    compress: true,
                    cleancss: true
                },
                files: {
                    '<%= config.dist %>/main.css': '<%= config.src %>/less/main.less'
                }
            }
        },
        handlebars: {
            compile: {
                options: {
                    namespace: 'JST',
                    commonjs: true,
                    processName: function(filename) {
                        var regex = /^(.+\/)*(.+)\.(.+)$/g;
                        var matches = regex.exec(filename);
                        return matches[2];
                    }
                },
                files: {
                    '<%= config.dev %>/js/templates.js': ['<%= config.dev %>/hbs/**/*.hbs']
                }
            }
        },
        texturepacker: {
            src: '<%= config.src %>/assets/tp',
            options: {
                multipack: true,
                stdout: true,
                texturepath: '../images/tp',
                model: '<%= config.src %>/model/desktopSprite'
            }
        },
        audio: {
            src: '<%= config.src %>/assets/audio/',
            options: {
                dest: '<%= config.dev %>/audio/',
                path: '/audio/',
                model: '<%= config.src %>/model/soundModel.js',
                types: ['mp3','m4a','ogg'],
                stdout: true
            }
        },
        pngmin: {
            dynamic: {
                options: {
                    force: true,
                    ext: '.png'
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.dist %>/assets/images/',
                    src: ['*.png','tp/*.png'],
                    dest: '<%= config.dist %>/assets/images/'
                }]
            }
        },
        copy: {
            json: {
                files: [{
                    expand: true,
                    cwd: '<%= config.dev %>/assets/json/',
                    src: '**',
                    dest: '<%= config.dist %>/assets/json/'
                }]
            },
            images: {
                files: [{
                    expand: true,
                    cwd: '<%= config.dev %>/assets/images/',
                    src: ['**'],
                    dest: '<%= config.dist %>/assets/images/'
                }]
            }
        },
        connect: {
            'dev': {
                'options': {
                    'base': '<%= config.dev %>/',
                    'keepalive': false,
                    'hostname': '0.0.0.0'
                }
            }
        },
        concat: {
            options: {
                separator: ';\n',
                sourceMap: false
            },
            dev: {
                src: '<%= config.libs %>',
                dest: '<%= config.dev %>/libs.js'
            },
            dist: {
                src: '<%= config.libs %>',
                dest: '<%= config.dist %>/libs.js'
            }
        },
        watch: {
            options: {
                livereload: true
            },
            less: {
                files: ['<%= config.src %>/less/**/*.less'],
                tasks: ['less:dev']
            },
            browserify: {
                files: ['<%= config.src %>/**/*.js'],
                tasks: ['browserify:dev']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-pngmin');
    grunt.loadTasks('tasks');

    grunt.registerTask('tp', ['texturepacker']);
    grunt.registerTask('images', ['copy:images']);
    //grunt.registerTask('images', ['copy:images','pngmin']);
    grunt.registerTask('default', [
        //'handlebars',
        'tp',
        'audio',
        'concat:dev',
        'browserify:dev',
        'less:dev',
        'connect',
        'watch'
    ]);
    grunt.registerTask('release', [
        //'tp',
        'browserify:dist',
        'concat:dist',
        'images',
        'copy:json',
        'copy:html',
        'less:dist',
        'pngmin'
    ]);
};