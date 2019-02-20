/**
 * The default label renderer. It renders the label as a simple text.
 */
export default {
  /**
   * SVG Element creation.
   *
   * @param  {object}                   node       The node object.
   * @param  {configurable}             settings   The settings function.
   */
  create(node, settings) {
    const prefix = settings("prefix") || "";

    const size = node[`${prefix}size`];

    const text = document.createElementNS(settings("xmlns"), "text");

    const fontSize =
      settings("labelSize") === "fixed"
        ? settings("defaultLabelSize")
        : settings("labelSizeRatio") * size;

    const fontColor =
      settings("labelColor") === "node"
        ? node.color || settings("defaultNodeColor")
        : settings("defaultLabelColor");

    text.setAttributeNS(null, "data-label-target", node.id);
    text.setAttributeNS(null, "class", `${settings("classPrefix")}-label`);
    text.setAttributeNS(null, "font-size", fontSize);
    text.setAttributeNS(null, "font-family", settings("font"));
    text.setAttributeNS(null, "fill", fontColor);

    text.innerHTML = node.label;
    text.textContent = node.label;

    return text;
  },

  /**
   * SVG Element update.
   *
   * @param  {object}                   node     The node object.
   * @param  {DOMElement}               text     The label DOM element.
   * @param  {configurable}             settings The settings function.
   */
  update(node, text, settings) {
    const prefix = settings("prefix") || "";

    const size = node[`${prefix}size`];

    const fontSize =
      settings("labelSize") === "fixed"
        ? settings("defaultLabelSize")
        : settings("labelSizeRatio") * size;

    // Case when we don't want to display the label
    if (!settings("forceLabels") && size < settings("labelThreshold")) return;

    if (typeof node.label !== "string") return;

    // Updating
    text.setAttributeNS(null, "x", Math.round(node[`${prefix}x`] + size + 3));
    text.setAttributeNS(
      null,
      "y",
      Math.round(node[`${prefix}y`] + fontSize / 3)
    );

    // Showing
    text.style.display = "";

    return this;
  }
};
