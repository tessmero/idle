/**
 * @file Button gui element.
 * Base class for typical rectangular buttons
 */
class Button extends GuiElement {

  #action;

  /**
   *
   * @param rect
   * @param action
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
   * @param g
   */
  draw(g) {
    this.constructor._draw(g, this.rect, this.hovered);
  }

  /**
   *
   * @param g
   * @param rect
   * @param hovered
   * @param fill
   */
  static _draw(g, rect, hovered = false, fill = true) {
    let lineCol = global.colorScheme.fg;

    if (hovered) {
      lineCol = global.colorScheme.hl;
    }

    // g.fillStyle = global.colorScheme.bg
    g.strokeStyle = lineCol;
    g.lineWidth = global.lineWidth;
    if (fill) { g.clearRect(...rect); }
    g.strokeRect(...rect);
    g.strokeStyle = global.colorScheme.fg;
  }
}
