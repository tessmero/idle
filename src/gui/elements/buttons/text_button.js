/**
 * @file TextButton gui element.
 * a button with some text.
 */
class TextButton extends Button {
  #label;
  #center;

  /**
   *
   * @param {number[]} rect The x,y,w,h of this button.
   * @param {object} params The parameters.
   * @param {string} params.label The text to display.
   * @param {Function} params.action The function to call when clicked.
   */
  constructor(rect, params = {}) {
    super(rect, params);
    const {
      label = '',
      center = true,
    } = params;

    if (params.text) {
      throw new Error('parameter \'text\' is invalid, should use \'label\'');
    }

    this.#label = label;
    this.#center = center;
  }

  /**
   *
   */
  get center() { return this.#center; }

  /**
   *
   */
  get label() { return this.#label; }

  /**
   *
   * @param {object} g The graphics context.
   */
  draw(g) {
    super.draw(g);
    drawText(g, ...rectCenter(...this.rect),
      this.#label, this.#center,
      new FontSpec(0, this.scale, false));
  }

}
