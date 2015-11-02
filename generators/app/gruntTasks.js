module.exports = {
  config: {
    assets: 'raw-assets',
    src: 'lib',
    dev: '.tmp',
    dist: 'release',
    libs: '',
    devPath: './assets/',
    livePath: './assets/'
  },
  licensechecker: {
    options: {
      warn: true,
      outFile: null,
      acceptable: ['MIT', 'MIT/X11', 'BSD', 'ISC', 'WTFPL', 'BSD-2', 'BSD-3', 'Apache2', 'Apache-2.0'],
      include: ['dependencies', 'devDependencies', 'peerDependencies']
    }
  },
  browserify: {
    'dev': {
      'src': 'index.js',
      'dest': '<%= config.dev %>/bundle.js',
      'options': {
        'debug': true,
        'watch': true,
        'verbose': true,
        'open': true,
        'browserifyOptions': {
          'debug': true
        },
        'transform': [['envify',{NODE_ENV: 'dev', PATH: '<%= config.devPath %>'}], "BABEL_OPTIONS"]
      }
    },
    'dist': {
      'src': 'index.js',
      'dest': '<%= config.dist %>/bundle.js',
      'options': {
        'debug': false,
        'verbose': false,
        'transform': [['envify',{NODE_ENV: 'prod', PATH: '<%= config.livePath %>'}], "BABEL_OPTIONS"]
      }
    }
  },
  sass: {
    dev: {
      options: {
        outputStyle: 'compressed',
        sourceMap: '<%= config.dev %>/main.css.map'
      },
      files: {
        '<%= config.dev %>/main.css': '<%= config.src %>/styles/main.scss'
      }
    },
    dist: {
      options: {
        outputStyle: 'compressed',
      },
      files: {
        '<%= config.dist %>/main.css': '<%= config.src %>/styles/main.scss'
      }
    }
  },
  postcss: {
    options: {
        map: true,
        processors: "SASS_PREFIX"
    },
    dev: {
        src: '<%= config.dev %>/*.css'
    },
    dist: {
        src: '<%= config.dist %>/*.css'
    }
  },
  texturepacker: {
    src: '<%= config.assets %>/tp',
    options: {
      multipack: true,
      stdout: true,
      texturepath: '../raw-assets/images/tp',
      model: '<%= config.src %>/model/desktopSprite'
    }
  },
  audio: {
    src: '<%= config.dev %>/assets/sounds/',
    options: {
      dest: '<%= config.dev %>/assets/',
      path: '/sounds/',
      model: '<%= config.src %>/model/soundModel.js',
      types: ['mp3', 'm4a', 'ogg'],
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
        cwd: '<%= config.dev %>/assets/images/',
        src: ['*.png', 'tp/*.png'],
        dest: '<%= config.dist %>/assets/images/'
      }]
    }
  },
  copy: {
    dev: {
      files: [{
        expand: true,
        cwd: '<%= config.assets %>/json/',
        src: '**',
        dest: '<%= config.dev %>/assets/json/'
      }, {
        expand: true,
        cwd: '<%= config.assets %>/images/',
        src: ['**'],
        dest: '<%= config.dev %>/assets/images/'
      }, {
        expand: true,
        cwd: '<%= config.assets %>/sounds/',
        src: ['**'],
        dest: '<%= config.dev %>/assets/sounds/'
      }, {
        expand: true,
        cwd: '<%= config.assets %>/videos/',
        src: ['**'],
        dest: '<%= config.dev %>/assets/videos/'
      }, {
        expand: true,
        cwd: '<%= config.assets %>/fonts/',
        src: ['**'],
        dest: '<%= config.dev %>/assets/fonts/'
      }]
    },
    dist: {
      files: [{
        expand: true,
        cwd: '<%= config.dev %>/assets/json/',
        src: ['**'],
        dest: '<%= config.dist %>/assets/json/'
      }, {
        expand: true,
        cwd: '<%= config.dev %>/assets/images/',
        src: ['**'],
        dest: '<%= config.dist %>/assets/images/'
      }, {
        expand: true,
        cwd: '<%= config.dev %>/assets/sounds/',
        src: ['**'],
        dest: '<%= config.dist %>/assets/sounds/'
      }, {
        expand: true,
        cwd: '<%= config.dev %>/assets/videos/',
        src: ['**'],
        dest: '<%= config.dist %>/assets/videos/'
      }, {
        expand: true,
        cwd: '<%= config.dev %>/assets/fonts/',
        src: ['**'],
        dest: '<%= config.dist %>/assets/fonts/'
      },
      {
        dot: true,
        expand: true,
        cwd: 'app/',
        src: ['**'],
        dest: '<%= config.dist %>'
      }]
    }
  },
  connect: {
    dev: {
      'options': {
        'base': ['<%= config.dev %>/','app/','*'],
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
    sass: {
      files: ['<%= config.src %>/styles/**/*.scss', '<%= config.src %>/**/*style.*'],
      tasks: ['sass:dev', 'postcss:dev']
    },
    browserify: {
      files: ['<%= config.src %>/**/*.js', '*.js', '<%= config.src %>/**/*template.*'],
      tasks: ['browserify:dev']
    },
    assets: {
      files: ['<%= config.assets %>/**/*'],
      tasks: ['copy:dev']
    }
  },
  uglify: {
    options: {
      preserveComments: 'some'
    },
    release: {
      files: {
          '<%= config.dist %>/bundle.js': ['<%= config.dist %>/bundle.js'],
      }
    }
  },
  compress: {
    main: {
      options: {
        mode: 'gzip'
      },
      files: [
        {expand: true, cwd: '<%= config.dist %>/', src: '*.js', dest: '<%= config.dist %>/', ext: '.js.gz'},
        {expand: true, cwd: '<%= config.dist %>/', src: '*.css', dest: '<%= config.dist %>/', ext: '.css.gz'}
      ]
    }
  }
};
