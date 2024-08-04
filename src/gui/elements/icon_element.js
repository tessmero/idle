/**
 * @file IconButton gui element, a pixel art icon
 */
class IconElement extends GuiElement {

  #icon;

  /**
   *
   * @param {number[]} rect
   * @param {object} params The parameters.
   * @param {Icon} params.icon
   */
  constructor(rect, params = {}) {
    super(rect, params);
    this.#icon = params.icon;
  }

  /**
   *
   */
  get icon() {
    return this.#icon;
  }

  /**
   * Allow assigning icon with equal sign.
   * @param {Icon} i The icon to display.
   */
  set icon(i) {
    throw new Error('should use constructor');
  }

  /**
   * @param {object} g The graphics context.
   */
  draw(g) {
    const icon = this.#icon;
    const layout = this.isAnimated() ?
      icon.getCurrentAnimatedLayout() : icon.frames[0];
    drawLayout(g, ...rectCenter(...this.rect), layout, true, new FontSpec(0, this.scale));
  }

  /**
   */
  isAnimated() {
    return true;
  }
}
