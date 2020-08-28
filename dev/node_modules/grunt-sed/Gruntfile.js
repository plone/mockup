module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      }
    , gruntfile: ['Gruntfile.js']
    , tasks: ['tasks/*.js']
    , tests: ['test/*.js']
    },

    exec: {
      test: {
        command: 'node test/test.js'
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('lint', 'jshint');
  grunt.registerTask('test', ['jshint', 'exec']);
  grunt.registerTask('default', 'test');
};
