module.exports = function(grunt) {


  // Setting grunt base as sigma's root directory
  grunt.file.setBase('../../');

  // Registering needed files
  var files = [
    'shape-library.js',
    'sigma.renderers.customShapes.canvas.js',
    'sigma.renderers.customShapes.webgl.js'
    ].map(function(p) {
    return __dirname + '/' + p;
  });

  // Project configuration:
  grunt.initConfig({
    customShapes: {
      prod: {
        files: {
          'build/plugins/sigma.renderers.customShapes.min.js': files
        }
      }
    }
  });

  // Loading tasks
  grunt.loadTasks(__dirname + '/tasks');

  // By default, we will minify
  grunt.registerTask('build', ['customShapes:prod']);
  grunt.registerTask('default', ['build']);
};
