module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['qunit'],
    files: [
        'src/sigma.core.js',
        'src/conrad.js',
        'src/utils/sigma.utils.js',
        'src/utils/sigma.polyfills.js',
        'src/sigma.settings.js',
        'src/classes/sigma.classes.dispatcher.js',
        'src/classes/sigma.classes.configurable.js',
        'src/classes/sigma.classes.graph.js',
        'src/classes/sigma.classes.camera.js',
        'src/classes/sigma.classes.quad.js',
        'src/classes/sigma.classes.edgequad.js',
        'src/captors/sigma.captors.mouse.js',
        'src/captors/sigma.captors.touch.js',
        'src/renderers/sigma.renderers.canvas.js',
        'src/renderers/sigma.renderers.webgl.js',
        'src/renderers/sigma.renderers.def.js',
        'src/renderers/webgl/sigma.webgl.nodes.def.js',
        'src/renderers/webgl/sigma.webgl.nodes.fast.js',
        'src/renderers/webgl/sigma.webgl.edges.def.js',
        'src/renderers/webgl/sigma.webgl.edges.fast.js',
        'src/renderers/canvas/sigma.canvas.labels.def.js',
        'src/renderers/canvas/sigma.canvas.hovers.def.js',
        'src/renderers/canvas/sigma.canvas.nodes.def.js',
        'src/renderers/canvas/sigma.canvas.edges.def.js',
        'src/middlewares/sigma.middlewares.rescale.js',
        'src/middlewares/sigma.middlewares.copy.js',
        'src/misc/sigma.misc.animation.js',
        'src/misc/sigma.misc.bindEvents.js',
        'src/misc/sigma.misc.drawHovers.js',
        'plugins/sigma.helpers.graph/sigma.helpers.graph.js',
        'plugins/sigma.plugins.activeState/sigma.plugins.activeState.js',
        'plugins/sigma.plugins.filter/sigma.plugins.filter.js',
        'plugins/sigma.plugins.edgeSiblings/sigma.plugins.edgeSiblings.js',
        'plugins/sigma.plugins.locate/sigma.plugins.locate.js',
        'plugins/sigma.statistics.HITS/sigma.statistics.HITS.js',

        'test/*.js'
    ],
    browsers: ['PhantomJS'],
    singleRun: true,
    reporters: ['progress', 'coverage'],
    preprocessors: {
      'src/*.js': ['coverage'],
      'plugins/sigma.helpers.graph/*.js': ['coverage'],
      'plugins/sigma.plugins.activeState/*.js': ['coverage'],
      'plugins/sigma.plugins.edgeSiblings/*.js': ['coverage'],
      'plugins/sigma.plugins.locate/*.js': ['coverage'],
      'plugins/sigma.statistics.HITS/*.js': ['coverage']
    },
    coverageReporter: {
      type : 'lcov',
      dir : 'coverage',
      subdir: '.'
    }
  });
};