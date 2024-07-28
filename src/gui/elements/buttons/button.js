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
    if (this.borderless) {
      return;
    }
    this.constructor._draw(g, this.rect, this.hovered);
  }

  /**
   * Draw standard button rectangle.
   * @param {object} g The graphics context.
   * @param {number[]} rect The x,y,w,h of the rectangle.
   * @param {boolean} hovered True if the user is hovering over the button.
   * @param {boolean} fill True if the interior of the button should be filled.
   */
  static _draw(g, rect, hovered = false, fill = true) {
    let lineCol = global.colorScheme.fg;

    if (hovered) {
      lineCol = global.colorScheme.hl;
    }
    if (global.debugUiRects) {
      lineCol = 'red';
    }

    // g.fillStyle = global.colorScheme.bg
    g.strokeStyle = lineCol;
    g.lineWidth = global.lineWidth;
    if (fill) { g.clearRect(...rect); }
    g.strokeRect(...rect);
    g.strokeStyle = global.colorScheme.fg;
  }
}
