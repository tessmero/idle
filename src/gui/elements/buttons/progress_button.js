/**
 * @file ProgressButton button with progress indicator
 */
class ProgressButton extends Button {
  #valueFunc;

  /**
   * Extend Button and add valueFunc like ProgressIndicator.
   * @param {number[]} rect The x,y,w,h of this button.
   * @param {object} params The parameters.
   * @param {Function} params.action The function to call when clicked.
   * @param {Function} params.valueFunc The function to pick progress, 0 is empty, 1 is full.
   */
  constructor(rect, params = {}) {
    super(rect, { border: new DefaultBorder(), ...params });
    const { valueFunc } = params;
    this.#valueFunc = valueFunc;
  }

  /**
   * Override draw to layer text, indicator, border.
   * @param {object} g The graphics context.
   */
  draw(g) {
    this._drawIconText(g);

    ProgressIndicator.draw(
      g, this.rect, this.#valueFunc());

    // trim progress indicator
    this.border.cleanup(g, this.rect);

    this._drawBorder(g);
  }
}
