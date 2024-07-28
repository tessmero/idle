/**
 * @file Button gui element.
 * Base class for typical rectangular buttons
 */
class Button extends GuiElement {
  #action;

  /**
   *
   * @param {number[]} rect The x,y,w,h of this button.
   * @param {Function} action The function to call when clicked.
   */
  constructor(rect, action) {
    super(rect);

    this.#action = action;
    this.setBorder(Border.default);
  }

  /**
   *
   */
  click() {
    const result = !this.#action();
    return result;
  }

  /**
   *
   * @param {object} g The graphics context.
   */
  draw(g) {
    Border._draw(g, this.rect, {
      hovered: this.hovered,
      fill: true,
      border: this.border,
    });
  }
}
