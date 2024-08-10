/**
 * @file IconButton gui element.
 * a button with a pixel art icon
 */
class IconButton extends Button {

  #icon;

  /**
   *
   * @param {number[]} rect
   * @param {object} params The parameters.
   * @param {Icon} params.icon The text to display.
   * @param {Function} params.action The function to call when clicked.
   */
  constructor(rect, params = {}) {
    super(rect, params);
    const { icon } = params;
    this.#icon = icon;
  }

  /**
   *
   */
  get icon() {
    return this.#icon;
  }

  /**
   * Allow assigning icon after construction.
   * @param {Icon} i The icon to display.
   */
  set icon(i) {
    this.#icon = i;
  }

  /**
   * Extend standard button appearance by drawing icon.
   * @param {object} g The graphics context.
   */
  draw(g) {
    super.draw(g);

    g.fillStyle = global.colorScheme.fg;
    const icon = this.#icon;
    const layout = this.isAnimated() ?
      icon.getCurrentAnimatedLayout() : icon.frames[0];
    drawLayout(g, ...rectCenter(...this.rect), layout, true, new FontSpec(0, this.scale)); // character.js
  }

  /**
   * Show icon as animated if this button is being hovered.
   * @returns {boolean} True if hovered.
   */
  isAnimated() {
    return this.hovered;
  }
}
