module.exports = function(grunt) {


  // Setting grunt base as sigma's root directory
  grunt.file.setBase('../../');

  // Registering needed files
  var files = ['supervisor.js', 'worker.js'].map(function(p) {
    return __dirname + '/' + p;
  });

  // Project configuration:
  grunt.initConfig({
    forceAtlas2: {
      prod: {
        files: {
          'build/plugins/sigma.layout.forceAtlas2.min.js': files
        }
      }
    }
  });

  // Loading tasks
  grunt.loadTasks(__dirname + '/tasks');

  // By default, we will crush and then minify
  grunt.registerTask('default', ['forceAtlas2:prod']);
};
