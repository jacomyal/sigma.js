export default function configure(sigma) {
  /**
   * This helper will bind any DOM renderer (for instance svg)
   * to its captors, to properly dispatch the good events to the sigma instance
   * to manage clicking, hovering etc...
   *
   * It has to be called in the scope of the related renderer.
   */
  sigma.register("sigma.misc.bindDOMEvents", function bindDOMEvents(container) {
    const self = this;

    const { graph } = this;

    // DOMElement abstraction
    function Element(domElement) {
      // Helpers
      this.attr = attrName => domElement.getAttributeNS(null, attrName);

      // Properties
      this.tag = domElement.tagName;
      this.class = this.attr("class");
      this.id = this.attr("id");

      // Methods
      this.isNode = function isNode() {
        return !!~this.class.indexOf(`${self.settings("classPrefix")}-node`);
      };

      this.isEdge = function isEdge() {
        return !!~this.class.indexOf(`${self.settings("classPrefix")}-edge`);
      };

      this.isHover = function isHover() {
        return !!~this.class.indexOf(`${self.settings("classPrefix")}-hover`);
      };
    }

    // Click
    function click(e) {
      if (!self.settings("eventsEnabled")) return;

      // Generic event
      self.dispatchEvent("click", e);

      // Are we on a node?
      const element = new Element(e.target);

      if (element.isNode())
        self.dispatchEvent("clickNode", {
          node: graph.nodes(element.attr("data-node-id"))
        });
      else self.dispatchEvent("clickStage");

      e.preventDefault();
      e.stopPropagation();
    }

    // Double click
    function doubleClick(e) {
      if (!self.settings("eventsEnabled")) return;

      // Generic event
      self.dispatchEvent("doubleClick", e);

      // Are we on a node?
      const element = new Element(e.target);

      if (element.isNode())
        self.dispatchEvent("doubleClickNode", {
          node: graph.nodes(element.attr("data-node-id"))
        });
      else self.dispatchEvent("doubleClickStage");

      e.preventDefault();
      e.stopPropagation();
    }

    // On over
    function onOver(e) {
      const target = e.toElement || e.target;

      if (!self.settings("eventsEnabled") || !target) return;

      const el = new Element(target);

      if (el.isNode()) {
        self.dispatchEvent("overNode", {
          node: graph.nodes(el.attr("data-node-id"))
        });
      } else if (el.isEdge()) {
        const edge = graph.edges(el.attr("data-edge-id"));
        self.dispatchEvent("overEdge", {
          edge,
          source: graph.nodes(edge.source),
          target: graph.nodes(edge.target)
        });
      }
    }

    // On out
    function onOut(e) {
      const target = e.fromElement || e.originalTarget;

      if (!self.settings("eventsEnabled")) return;

      const el = new Element(target);

      if (el.isNode()) {
        self.dispatchEvent("outNode", {
          node: graph.nodes(el.attr("data-node-id"))
        });
      } else if (el.isEdge()) {
        const edge = graph.edges(el.attr("data-edge-id"));
        self.dispatchEvent("outEdge", {
          edge,
          source: graph.nodes(edge.source),
          target: graph.nodes(edge.target)
        });
      }
    }

    // Registering Events:

    // Click
    container.addEventListener("click", click, false);
    sigma.utils.doubleClick(container, "click", doubleClick);

    // Touch counterparts
    container.addEventListener("touchstart", click, false);
    sigma.utils.doubleClick(container, "touchstart", doubleClick);

    // Mouseover
    container.addEventListener("mouseover", onOver, true);

    // Mouseout
    container.addEventListener("mouseout", onOut, true);
  });
}
