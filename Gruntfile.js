'use strict';

module.exports = function(grunt) {

  var pkgConfig = grunt.file.readJSON('package.json');

  require('jit-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({
    'pkg': pkgConfig,

    watch: {
      sass: {
        files: ['_scss/*.{scss,sass}'],
        tasks: ['sass:dev']
      },
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
    },

    sass: {
      options: {
        outputStyle: 'nested',
        includePaths: ['./bower_components'],
      },
      dev: {
        files: {
          'lib/main.css': '_scss/main.scss'
        }
      },
    },

    // Inject bower dependencies into the HTML page.
    wiredep: {
      app: {
        src: [
          '_layouts/default.html'
        ],
        ignorePath: '../bower_components/',
        exclude: [
          'bootstrap.js',
        ],
        onPathInjected: function(fileObject) {
          var folder = fileObject.path.match(/\.js$/) ? 'scripts' : 'styles';
          console.log();
          console.log('# RUN:');
          console.log('mkdir -p '+folder+'/'+fileObject.path.replace(/\/[^\/]+$/, ''));
          console.log('cp bower_components/'+fileObject.path+' '+folder+'/'+fileObject.path);
        },
        // defaults:
        fileTypes: {
          html: {
            replace: {
              js: '<script src="/scripts/{{filePath}}"></script>',
              css: '<link rel="stylesheet" href="/styles/{{filePath}}" />'
            }
          },
        },
      },
      sass: {
        src: ['./_scss/*.{scss,sass}'],
        ignorePath: '../bower_components/',
        exclude: [
          // '_bootstrap.scss',
        ],
      },
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

  
  grunt.registerTask('serve', [
  		'sass:dev',
      'wiredep',
      'concurrent:serve',
    ]);
};
