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
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-bower-requirejs');

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('default', ['bower']);

};
