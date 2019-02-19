QUnit.module("sigma.classes.configurable");

QUnit.test("Basic manipulation", function(assert) {
  let settings = new sigma.classes.configurable();
  settings("mySetting", 42);
  assert.deepEqual(
    settings("mySetting"),
    42,
    "First attribution works. (single key)"
  );
  settings("mySetting", 123);
  assert.deepEqual(
    settings("mySetting"),
    123,
    "Overriding works. (single key)"
  );
  settings({ mySetting: 456 });
  assert.deepEqual(
    settings("mySetting"),
    456,
    "Overriding works. (multi keys)"
  );

  settings({ mySetting: "abc" }, "mySetting"),
    "abc",
    "Filtering works. (when key is present)";
  settings({ hisSetting: "abc" }, "mySetting"),
    456,
    "Filtering works. (when key is present)";

  settings = new sigma.classes.configurable({ mySetting: 42 });
  assert.deepEqual(
    settings("mySetting"),
    42,
    "Attribution works. (from the constructor)"
  );
});

QUnit.test("Embed objects", function(assert) {
  const data = { key1: "data", key2: "data" };

  const object = { key1: "object" };

  const settings = new sigma.classes.configurable(data);

  const embedSettings = settings.embedObjects(object);

  assert.deepEqual(
    embedSettings("key2"),
    "data",
    "Embedded overriding works 1."
  );
  assert.deepEqual(
    embedSettings("key1"),
    "object",
    "Embedded overriding works 2."
  );
  assert.deepEqual(
    embedSettings({ key1: "onthefly" }, "key1"),
    "onthefly",
    "Embedded overriding works 3."
  );
});

QUnit.test("Deeply embed objects", function(assert) {
  const data = { key1: "data", key2: "data", key3: "data" };

  const object1 = { key1: "object1", key2: "object1" };

  const object2 = { key1: "object2" };

  const settings = new sigma.classes.configurable(data);

  const embedSettings1 = settings.embedObjects(object1);

  const embedSettings2 = embedSettings1.embedObjects(object2);

  assert.deepEqual(
    embedSettings2("key3"),
    "data",
    "Deeply embedded overriding works 1."
  );
  assert.deepEqual(
    embedSettings2("key2"),
    "object1",
    "Deeply embedded overriding works 2."
  );
  assert.deepEqual(
    embedSettings2("key1"),
    "object2",
    "Deeply embedded overriding works 3."
  );
  assert.deepEqual(
    embedSettings2({ key1: "onthefly" }, "key1"),
    "onthefly",
    "Deeply embedded overriding works 4."
  );
});
