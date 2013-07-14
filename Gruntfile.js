module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['Gruntfile.js', 'js/**/*.js', 'test/*.js']
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
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('test', ['karma']);
  grunt.registerTask('test-all', ['karma', 'jshint']);
  grunt.registerTask('default', ['bower']);

};
