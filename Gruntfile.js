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
    'src/renderers/webgl/sigma.webgl.edges.arrow.js',
    'src/renderers/canvas/sigma.canvas.labels.def.js',
    'src/renderers/canvas/sigma.canvas.hovers.def.js',
    'src/renderers/canvas/sigma.canvas.nodes.def.js',
    'src/renderers/canvas/sigma.canvas.edges.def.js',
    'src/renderers/canvas/sigma.canvas.edges.arrow.js',
    'src/renderers/canvas/sigma.canvas.edges.curve.js',

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
    'plugins/sigma.parsers.gexf/*.js',
    'plugins/sigma.parsers.json/*.js',
    'plugins/sigma.plugins.animate/*.js',
    'plugins/sigma.plugins.neighborhoods/*.js',
    'plugins/sigma.renderers.customShapes/*.js'
  ];

  // Project configuration:
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    closureLint: {
      app: {
        closureLinterPath: '/usr/local/bin',
        src: coreJsFiles,
        options: {
          stdout: true,
          strict: true,
          opt: '--disable 6,13'
        }
      }
    },
    jshint: {
      all: coreJsFiles,
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
        files: pluginFiles.reduce(function(res, path) {
          var dest = 'build/' + path.replace(/\/\*\.js$/, '.min.js');
          res[dest] = path;
          return res;
        }, {})
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
    },
    sed: {
      version: {
        recursive: true,
        path: 'examples/',
        pattern: /<!-- START SIGMA IMPORTS -->[\s\S]*<!-- END SIGMA IMPORTS -->/g,
        replacement: ['<!-- START SIGMA IMPORTS -->'].concat(coreJsFiles.map(function(path) {
          return '<script src="../' + path + '"></script>';
        }).concat('<!-- END SIGMA IMPORTS -->')).join('\n')
      }
    },
    zip: {
      release: {
        dest: 'build/release-v<%= pkg.version %>.zip',
        src: [
          'README.md',
          'build/sigma.min.js',
          'build/plugins/*.min.js'
        ],
        router: function(filepath) {
          return filepath.replace(/build\//, '');
        }
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  // By default, will check lint, hint, test and minify:
  grunt.registerTask('default', ['closureLint', 'jshint', 'qunit', 'sed', 'uglify']);
  grunt.registerTask('release', ['closureLint', 'jshint', 'qunit', 'sed', 'uglify', 'zip']);

  // For travis-ci.org, only launch tests:
  grunt.registerTask('travis', ['qunit']);
};
