/*
 * grunt-customShapes
 *
 * This task minifies Custom Shapes code.
 */
var uglify = require('uglify-js');

// Shorteners
function minify(string) {
  return uglify.minify(string, {fromString: true}).code;
}


module.exports = function(grunt) {

  // Custom shapes grunt multitask
  function multitask() {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({});

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read file source.
        return grunt.file.read(filepath);
      }).join('\n');

      // minifying
      src = minify(src);

      // Write the destination file.
      grunt.file.write(f.dest, src);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  }

  // Registering the task
  grunt.registerMultiTask(
    'customShapes',
    'A grunt task to minify customShapes.',
    multitask
  );
};
