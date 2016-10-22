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
        onPathInjected: function(fileObject) {
          console.log('Run: cp bower_components/'+fileObject.path+' ./lib');
        },
        // defaults:
        fileTypes: {
          html: {
            replace: {
              js: '<script src="/lib/{{filePath}}"></script>',
              css: '<link rel="stylesheet" href="/lib/{{filePath}}" />'
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
  });

  // Default task(s).
  grunt.registerTask('default', [
  		'sass:dev',
      'wiredep',
  		'watch']);
};
