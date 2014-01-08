module.exports = function(grunt) {
  var coreJsFiles = [
    // Core:
    'src/sigma.core.js',

    // Utils:
    'src/conrad.js',
    'src/utils/sigma.utils.js',
    'src/utils/sigma.polyfills.js',

    // Main classes:
    'src/sigma.settings.js',
    'src/classes/sigma.classes.dispatcher.js',
    'src/classes/sigma.classes.configurable.js',
    'src/classes/sigma.classes.graph.js',
    'src/classes/sigma.classes.camera.js',
    'src/classes/sigma.classes.quad.js',

    // Captors:
    'src/captors/sigma.captors.mouse.js',
    'src/captors/sigma.captors.touch.js',

    // Renderers:
    'src/renderers/sigma.renderers.canvas.js',
    'src/renderers/sigma.renderers.webgl.js',
    'src/renderers/sigma.renderers.def.js',

    // Sub functions per engine:
    'src/renderers/webgl/sigma.webgl.nodes.def.js',
    'src/renderers/webgl/sigma.webgl.nodes.fast.js',
    'src/renderers/webgl/sigma.webgl.edges.def.js',
    'src/renderers/webgl/sigma.webgl.edges.fast.js',
    'src/renderers/canvas/sigma.canvas.labels.def.js',
    'src/renderers/canvas/sigma.canvas.hovers.def.js',
    'src/renderers/canvas/sigma.canvas.nodes.def.js',
    'src/renderers/canvas/sigma.canvas.edges.def.js',

    // Middlewares:
    'src/middlewares/sigma.middlewares.rescale.js',
    'src/middlewares/sigma.middlewares.copy.js',

    // Miscellaneous:
    'src/misc/sigma.misc.animation.js',
    'src/misc/sigma.misc.bindEvents.js',
    'src/misc/sigma.misc.drawHovers.js'
  ];

  var pluginFiles = [
    'plugins/sigma.layout.forceAtlas2/*.js',
    'plugins/sigma.parsers.gexf/*.js'
  ];

  // Project configuration:
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    closureLint: {
      app:{
        closureLinterPath: '/usr/local/bin',
        src: coreJsFiles.concat(pluginFiles),
        options: {
          stdout: true,
          strict: true,
          opt: '--disable 6,13'
        }
      }
    },
    jshint: {
      all: coreJsFiles.concat(pluginFiles),
      options: {
        '-W055': true,
        '-W040': true,
        '-W064': true
      }
    },
    qunit: {
      all: {
        options: {
          urls: [
            './test/unit.html'
          ]
        }
      }
    },
    uglify: {
      prod: {
        files: {
          'build/sigma.min.js': coreJsFiles
        },
        options: {
          banner: '/* sigma.js - <%= pkg.description %> - Version: <%= pkg.version %> - Author: Alexis Jacomy, Sciences-Po Médialab - License: MIT */\n'
        }
      },
      plugins: {
        files: {
          'build/sigma.plugins.min.js': pluginFiles
        },
        options: {
          banner: '/* sigma.js plugins - Version: <%= pkg.version %> - Author: Alexis Jacomy, Sciences-Po Médialab - License: MIT */\n'
        }
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: coreJsFiles,
        dest: 'build/sigma.js'
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  // By default, will check lint, hint, test and minify:
  grunt.registerTask('default', ['closureLint', 'jshint', 'qunit', 'uglify']);
};
