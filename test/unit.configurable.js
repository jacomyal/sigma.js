module('sigma.classes.configurable');

test('Basic manipulation', function() {
  var settings = new sigma.classes.configurable();
  settings('mySetting', 42);
  deepEqual(settings('mySetting'), 42, 'First attribution works. (single key)');
  settings('mySetting', 123);
  deepEqual(settings('mySetting'), 123, 'Overriding works. (single key)');
  settings({mySetting: 456});
  deepEqual(settings('mySetting'), 456, 'Overriding works. (multi keys)');

  (settings({mySetting: 'abc'}, 'mySetting'), 'abc', 'Filtering works. (when key is present)');
  (settings({hisSetting: 'abc'}, 'mySetting'), 456, 'Filtering works. (when key is present)');

  settings = new sigma.classes.configurable({mySetting: 42});
  deepEqual(settings('mySetting'), 42, 'Attribution works. (from the constructor)');
});

test('Embed objects', function() {
  var data = { key1: 'data', key2: 'data' },
      object = { key1: 'object' },
      settings = new sigma.classes.configurable(data),
      embedSettings = settings.embedObjects(object);

  deepEqual(embedSettings('key2'), 'data', 'Embedded overriding works 1.');
  deepEqual(embedSettings('key1'), 'object', 'Embedded overriding works 2.');
  deepEqual(embedSettings({ key1: 'onthefly' }, 'key1'), 'onthefly', 'Embedded overriding works 3.');
});

test('Deeply embed objects', function() {
  var data = { key1: 'data', key2: 'data', key3: 'data' },
      object1 = { key1: 'object1', key2: 'object1' },
      object2 = { key1: 'object2' },
      settings = new sigma.classes.configurable(data),
      embedSettings1 = settings.embedObjects(object1),
      embedSettings2 = embedSettings1.embedObjects(object2);

  deepEqual(embedSettings2('key3'), 'data', 'Deeply embedded overriding works 1.');
  deepEqual(embedSettings2('key2'), 'object1', 'Deeply embedded overriding works 2.');
  deepEqual(embedSettings2('key1'), 'object2', 'Deeply embedded overriding works 3.');
  deepEqual(embedSettings2({ key1: 'onthefly' }, 'key1'), 'onthefly', 'Deeply embedded overriding works 4.');
});
