/**
 * Sigma.js Canvas Renderer Label Component
 * =========================================
 *
 * Function used by the canvas renderer to display a single node's label.
 */
export default function LabelComponent(context, data) {
  context.fillStyle = '#000';
  context.font = '14px arial';

  context.fillText(
    data.label,
    data.x + data.size + 3,
    data.y + 14 / 3
  );
}
