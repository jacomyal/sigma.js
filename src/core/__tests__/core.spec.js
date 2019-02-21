import sigma from "../index";

describe("The Sigma Library", () => {
  it("Constructor polymorphism", () => {
    let s;

    const tmp = sigma.renderers.def;

    const dom = document.createElement("DIV");

    // Let's add a temporary container:
    dom.id = "abc";
    document.body.appendChild(dom);

    // Custom renderer:
    // We just need the options here.
    sigma.renderers.def = function defRenderer(_1, _2, _3, options) {
      this.options = options;
    };

    s = new sigma();
    expect(Object.keys(s.renderers).length).toEqual(
      0,
      '"new sigma()" instantiate sigma without any renderer.'
    );

    s = new sigma("abc");
    expect(s.renderers[0].options).toEqual(
      {
        container: dom
      },
      '"new sigma("abc")" instantiate the default renderer in the div #abc.'
    );

    s = new sigma(["abc"]);
    expect(s.renderers[0].options).toEqual(
      {
        container: dom
      },
      '"new sigma(["abc"])" instantiate the default renderer in the div #abc.'
    );

    s = new sigma(document.getElementById("abc"));
    expect(s.renderers[0].options).toEqual(
      {
        container: dom
      },
      '"new sigma(document.getElementById("abc"))" instantiate the default renderer in the div #abc.'
    );

    s = new sigma({
      container: "abc"
    });
    expect(s.renderers[0].options).toEqual(
      {
        container: dom
      },
      '"new sigma({ container: "abc" })" instantiate the default renderer in the div #abc.'
    );

    s = new sigma({
      container: document.getElementById("abc")
    });
    expect(s.renderers[0].options).toEqual(
      {
        container: dom
      },
      '"new sigma({ container: document.getElementById("abc") })" instantiate the default renderer in the div #abc.'
    );

    s = new sigma(["abc", "abc"]);
    expect([s.renderers[0].options, s.renderers[1].options]).toEqual(
      [{ container: dom }, { container: dom }],
      '"new sigma(["abc", "abc"])" instantiate the default renderer in the div #abc twice.'
    );

    s = new sigma({
      renderers: [
        {
          container: document.getElementById("abc")
        }
      ]
    });
    expect(s.renderers[0].options).toEqual(
      {
        container: dom
      },
      '"new sigma({ renderers: [{ container: document.getElementById("abc") }] })" instantiate the default renderer in the div #abc.'
    );

    // Restore previous state:
    sigma.renderers.def = tmp;
    document.body.removeChild(dom);

    expect(() => {
      s = new sigma("abcd");
    }).toThrow(
      /Container not found./,
      "Trying to instantiate sigma with a string that is not the ID of an HTMLElement will throw an error."
    );
  });

  it("Public methods", () => {
    const s = new sigma();

    const dom = document.createElement("DIV");

    // Let's add a temporary container:
    dom.id = "abc";
    document.body.appendChild(dom);

    expect([Object.keys(s.renderers), Object.keys(s.cameras)]).toEqual(
      [[], []],
      "A sigma instance created without configuration has no camera nor renderer."
    );

    // Adding and killing cameras and renderers:
    const c1 = s.addCamera("0");
    const c2 = s.addCamera("1");
    s.addRenderer({ container: dom, camera: c1, id: "0" });
    s.addRenderer({ container: dom, camera: c2, id: "1" });
    s.addRenderer({ container: dom, camera: c2, id: "2" });

    expect([Object.keys(s.renderers), Object.keys(s.cameras)]).toEqual(
      [["0", "1", "2"], ["0", "1"]],
      "The cameras/renderers indexes are updated when adding cameras/renderers."
    );

    s.killRenderer("2");
    expect(Object.keys(s.renderers)).toEqual(
      ["0", "1"],
      "The renderers indexes are updated when killing renderers."
    );

    s.killCamera("1");
    expect([Object.keys(s.renderers), Object.keys(s.cameras)]).toEqual(
      [["0"], ["0"]],
      "The cameras/renderers indexes are updated when killing cameras."
    );

    expect(() => s.killCamera("42")).toThrow(
      /The camera is undefined./,
      "Killing a camera that does not exist throws an error."
    );

    expect(() => s.killRenderer("42")).toThrow(
      /The renderer is undefined./,
      "Killing a renderer that does not exist throws an error."
    );

    s.killCamera("0");

    // Checking a bit more deeply adding methods:
    let c = s.addCamera("myCamera");

    s.addRenderer({ camera: c, container: dom, id: "myRenderer" });
    expect([Object.keys(s.renderers), Object.keys(s.cameras)]).toEqual(
      [["myRenderer"], ["myCamera"]],
      "The cameras/renderers adders work well with custom IDs."
    );

    expect(() => s.addCamera("myCamera")).toThrow(
      /The camera "myCamera" already exists./,
      "Adding a camera with an already existing ID throws an error."
    );

    expect(() =>
      s.addRenderer({ camera: c, container: dom, id: "myRenderer" })
    ).toThrow(
      /The renderer "myRenderer" already exists./,
      "Adding a renderer with an already existing ID throws an error."
    );

    // And check also some crazy side cases:
    c = s.addCamera();

    const { id } = c;

    s.killCamera(id);

    expect(() => s.addRenderer({ camera: c, container: dom })).toThrow(
      /The camera is not properly referenced./,
      "Adding a renderer with camera that is not referenced anymore throws an error."
    );

    // Restore previous state:
    document.body.removeChild(dom);
  });
});
