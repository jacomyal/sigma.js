const loadGruntTasks = require("load-grunt-tasks");

module.exports = grunt => {
  // Project configuration:
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    qunit: {
      all: {
        options: {
          urls: ["./test/unit.html"]
        }
      }
    }
  });

  loadGruntTasks(grunt);

  // By default, will check lint, hint, test and minify:
  grunt.registerTask("test", ["qunit"]);
};
