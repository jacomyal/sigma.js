import Configurable from "../Configurable";

describe("The Configurable class", () => {
  it("Basic manipulation", () => {
    let settings = new Configurable();
    settings("mySetting", 42);
    expect(settings("mySetting")).toEqual(
      42,
      "First attribution works. (single key)"
    );
    settings("mySetting", 123);
    expect(settings("mySetting")).toEqual(
      123,
      "Overriding works. (single key)"
    );
    settings({ mySetting: 456 });
    expect(settings("mySetting")).toEqual(
      456,
      "Overriding works. (multi keys)"
    );

    expect(settings({ mySetting: "abc" }, "mySetting")).toEqual(
      "abc",
      "Filtering works. (when key is present)"
    );
    expect(settings({ hisSetting: "abc" }, "mySetting")).toEqual(
      456,
      "Filtering works. (when key is present)"
    );

    settings = new Configurable({ mySetting: 42 });
    expect(settings("mySetting")).toEqual(
      42,
      "Attribution works. (from the constructor)"
    );
  });

  it("Embed objects", () => {
    const data = { key1: "data", key2: "data" };

    const object = { key1: "object" };

    const settings = new Configurable(data);

    const embedSettings = settings.embedObjects(object);

    expect(embedSettings("key2")).toEqual(
      "data",
      "Embedded overriding works 1."
    );
    expect(embedSettings("key1")).toEqual(
      "object",
      "Embedded overriding works 2."
    );
    expect(embedSettings({ key1: "onthefly" }, "key1")).toEqual(
      "onthefly",
      "Embedded overriding works 3."
    );
  });

  it("Deeply embed objects", () => {
    const data = { key1: "data", key2: "data", key3: "data" };
    const object1 = { key1: "object1", key2: "object1" };
    const object2 = { key1: "object2" };
    const settings = new Configurable(data);
    const embedSettings1 = settings.embedObjects(object1);
    const embedSettings2 = embedSettings1.embedObjects(object2);

    expect(embedSettings2("key3")).toEqual(
      "data",
      "Deeply embedded overriding works 1."
    );
    expect(embedSettings2("key2")).toEqual(
      "object1",
      "Deeply embedded overriding works 2."
    );
    expect(embedSettings2("key1")).toEqual(
      "object2",
      "Deeply embedded overriding works 3."
    );
    expect(embedSettings2({ key1: "onthefly" }, "key1")).toEqual(
      "onthefly",
      "Deeply embedded overriding works 4."
    );
  });
});
