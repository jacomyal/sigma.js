;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.svg.labels');

  sigma.svg.labels.def = {
    create: function(node, settings) {
      var prefix = settings('prefix') || '',
          size = node[prefix + 'size'],
          text = document.createElementNS(settings('xmlns'), 'text');

      var fontSize = (settings('labelSize') === 'fixed') ?
        settings('defaultLabelSize') :
        settings('labelSizeRatio') * size;

      var fontColor = (settings('labelColor') === 'node') ?
        (node.color || settings('defaultNodeColor')) :
        settings('defaultLabelColor');

      text.setAttributeNS(null, 'id', 'l' + node.id);
      text.setAttributeNS(null, 'class', 'label');
      text.setAttributeNS(null, 'font-size', fontSize);
      text.setAttributeNS(null, 'font-family', settings('fontStyle') || '');
      text.setAttributeNS(null, 'fill', fontColor);

      text.innerHTML = node.label;

      return text;
    },
    update: function(node, text, settings) {
      var prefix = settings('prefix') || '',
          size = node[prefix + 'size'];

      var fontSize = (settings('labelSize') === 'fixed') ?
        settings('defaultLabelSize') :
        settings('labelSizeRatio') * size;

      // Case when we don't want to display the label
      if (size < settings('labelThreshold'))
        return;

      if (typeof node.label !== 'string')
        return;

      // Updating
      text.setAttributeNS(null, 'x',
        Math.round(node[prefix + 'x'] + size + 3));
      text.setAttributeNS(null, 'y',
        Math.round(node[prefix + 'y'] + fontSize / 3));

      // Showing
      text.style.display = '';

      return this;
    },
    hide: function(text) {
      text.style.display = 'none';
      return this;
    }
  };
}).call(this);
