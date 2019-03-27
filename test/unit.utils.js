module('sigma.utils');
test('Float color', function() {
  var floatColor = sigma.utils.floatColor;

  var inputs = [
    '#FF0',
    '#D1D1D1',
    '#d1d1d1',
    'rgb(234, 245, 298)',
    'rgba(234, 245, 298, 0.1)',
    'rgba(234, 245, 298, .1)'
  ];

  var outputs = [
    16776960,
    13750737,
    13750737,
    15398442,
    15398442,
    15398442
  ];

  inputs.forEach(function(input, i) {
    strictEqual(floatColor(input), outputs[i]);
  });
});
test('Int color', function() {
  var intColor = sigma.utils.intColor;

  var inputs = [
    '#FF0',
    '#D1D1D1',
    '#d1d1d1',
    'rgb(234, 245, 218)',// EA F5 DA
    'rgba(234, 245, 218, 25)' // ... 19
    
  ];

  var outputs = [
    4294967040,
    4291940817,
    4291940817,
    4293588442,
    434828762
  ];

  inputs.forEach(function(input, i) {
    strictEqual(intColor(input), outputs[i]);
  });
});
