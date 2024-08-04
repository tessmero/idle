/**
 * @file ProgressButton button with progress indicator
 */
class ProgressButton extends TextButton {
  #valueFunc;

  /**
   * Extend TextButton and add valueFunc like ProgressIndicator.
   * @param {number[]} rect The x,y,w,h of this button.
   * @param {object} params The parameters.
   * @param {string} params.label The text to display.
   * @param {Function} params.action The function to call when clicked.
   * @param {Function} params.valueFunc The function to pick progress, 0 is empty, 1 is full.
   */
  constructor(rect, params = {}) {
    super(rect, { border: new DefaultBorder(), ...params });
    this.#valueFunc = params.valueFunc;
  }

  /**
   * Override draw to layer text, indicator, border.
   * @param {object} g The graphics context.
   */
  draw(g) {

    drawText(g, ...rectCenter(...this.rect),
      this.label, this.center,
      new FontSpec(0, this.scale, false));

    ProgressIndicator.draw(
      g, this.rect, this.#valueFunc());

    // trim progress indicator
    g.strokeStyle = global.colorScheme.bg;
    g.fillStyle = global.colorScheme.bg;
    this.border.cleanup(g, this.rect);

    // draw border
    g.fillStyle = global.colorScheme.fg;
    Border.draw(g, this.rect, {
      hovered: this.hovered,
      fill: false,
      border: this.border,
    });
  }
}
