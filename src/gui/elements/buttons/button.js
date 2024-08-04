/**
 * @file Button gui element.
 * Base class for typical rectangular buttons
 */
class Button extends GuiElement {
  #action;

  /**
   *
   * @param {number[]} rect The x,y,w,h of this button.
   * @param {object} params The parameters.
   * @param {Function} params.action The function to call when clicked.
   */
  constructor(rect, params = {}) {
    super(rect, params);

    const {
      action = () => {}, // default action is to do nothing
    } = params;

    this.#action = action;
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
    Border.draw(g, this.rect, {
      hovered: this.hovered,
      fill: true,
      border: this.border,
    });
  }
}
