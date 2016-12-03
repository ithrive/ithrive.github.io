'use strict';

module.exports = function(grunt) {

  var pkgConfig = grunt.file.readJSON('package.json');

  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin',
  });

  // Project configuration.
  grunt.initConfig({
    'pkg': pkgConfig,

    watch: {
      sass: {
        files: ['_scss/*.{scss,sass}'],
        tasks: ['build:css']
      },
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep', 'build:js']
      },
      js: {
        files: ['scripts/*'],
        tasks: ['build:js']
      },
    },

    sass: {
      options: {
        outputStyle: 'nested',
        includePaths: ['./bower_components'],
      },
      dev: {
        files: {
          'dist/main.css': '_scss/main.scss'
        }
      },
    },

    // Inject bower dependencies into the HTML page.
    wiredep: {
      app: {
        src: [
          '_layouts/default.html'
        ],
        ignorePath: '..',
        // exclude: [],
        // onPathInjected: function(fileObject) {
        //   var folder = fileObject.path.match(/\.js$/) ? 'scripts' s';
        //   console.log();
        //   console.log('# RUN:');
        //   console.log('mkdir -p '+folder+'/'+fileObject.path.replace(/\/[^\/]+$/, ''));
        //   console.log('cp bower_components/'+fileObject.path+' '+folder+'/'+fileObject.path);
        // },
        // defaults:
        // fileTypes: {
        //   html: {
        //     replace: {
        //       js: '<script src="/scripts/{>',
        //       css: '<link rel="stylesheet" href="/styles/{{filePath}}" />'
        //     }
        //   },
        // },
      },
      sass: {
        src: ['./_scss/*.{scss,sass}'],
        ignorePath: '../bower_components/',
        exclude: [
          '_bootstrap.scss',
        ],
      },
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/build/',
          src: '*.js',
          dest: '.tmp/concat/build/'
        }]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '_layouts/default.html',
      options: {
        dest: '.',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglify'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    // usemin: {
    //   // html: ['build/{,*/}*.html'],
    //   // css: ['build/styles/{,*/}*.css'],
    //   js: ['build/{,*/}*.js'],
    //   options: {
    //     assetsDirs: [
    //       'build',
    //       'build/images',
    //       'build/styles'
    //     ],
    //     patterns: {
    //       js: [[/(images\/[^''""]*\.(png|jpg|jpeg|gif|webp|svg))/g, 'Replacing references to images']]
    //     }
    //   }
    // },
    
    // Add vendor prefixed styles
    postcss: {
      options: {
        processors: [
          require('autoprefixer-core')({browsers: ['last 1 version']})
        ]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    jekyll: {
      options: {
        bundleExec: true,
        src : '.'
      },
      dist: {
        options: {
          dest: '_site',
          config: '_config.yml,_config.build.yml'
        }
      },
      serve: {
        options: {
          serve: true,
          dest: '_site',
          drafts: true,
          future: true
        }
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      serve: [
        'jekyll:serve',
        'watch',
      ],
    },
  });

  grunt.registerTask('build:js', [
      'wiredep',
      'useminPrepare',
      'concat',
      'ngAnnotate',
      'uglify',
    ]);

  grunt.registerTask('build:css', [
      'sass:dev',
      'useminPrepare',
      'postcss',
      'cssmin',
    ]);

  grunt.registerTask('build', [
      'wiredep',
      'sass:dev',
      'useminPrepare',
      'concat',
      'ngAnnotate',
      'uglify',
      'postcss',
      'cssmin',
    ]);
  
  grunt.registerTask('serve', [
  		'build',
      'concurrent:serve',
    ]);
};
