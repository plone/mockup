module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['Gruntfile.js', 'js/**/*.js', 'tests/*.js']
    },
    bower: {
      target: {
        rjsConfig: 'js/config.js'
      }
    },
    karma: {
      options: {
        configFile: 'tests/karma.conf.js',
        runnerPort: 9999,
        browsers: ['Chrome']
      },
      dev: {
        autoWatch: true,
        //singleRun: true
      }
    },
    requirejs: {
      options: {
        baseUrl: "./",
        mainConfigFile: "js/config.js"
      },
      widgets: {
        options: {
          name: "js/bundles/widgets.js",
          out: "build/widgets.min.js",
          excludeShallow: ['jquery']
        }
      },
      toolbar: {
        options: {
          name: "js/bundles/toolbar.js",
          out: "build/toolbar.min.js"
        }
      }
    },
    less: {
      widgets: {
        options: {
          paths: ["less"]
        },
        files: {
          "build/widgets.css": "less/widgets.less"
        }
      },
      toolbar: {
        options: {
          paths: ["less"]
        },
        files: {
          "build/toolbar.css": "less/toolbar.less"
        }
      }
    },
    cssmin: {
      minify: {
        expand: true,
        cwd: 'build/',
        src: ['*.css', '!*.min.css'],
        dest: 'build/',
        ext: '.min.css',
        report: 'min'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('test', ['karma:dev']);
  grunt.registerTask('test-ci', ['karma:dev', 'jshint']);
  grunt.registerTask('default', ['bower']);
  grunt.registerTask('compile-js', ['requirejs']);
  grunt.registerTask('compile-less', ['less']);
  grunt.registerTask('compile-css', ['cssmin']);

};
