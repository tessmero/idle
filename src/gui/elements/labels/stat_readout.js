/**
 * @file StatReadout Gui Element
 * An icon followed by a line of dynamic text.
 */
class StatReadout extends DynamicTextLabel {

  #icon;

  /**
   *
   * @param rect
   * @param icon
   * @param labelFunc
   */
  constructor(rect, icon, labelFunc) {

    // make room for icon by displaying
    // 2 blank spaces to the left of the label
    super(rect, () => `  ${labelFunc()}`);

    this.#icon = icon;
    this.setScale(this.constructor.scale());
    this.setCenter(false);
  }

  /**
   *
   */
  get icon() {
    return this.#icon;
  }

  /**
   * Allow assigning icon with equal sign.
   * @param  {Icon} i The icon to display.
   */
  set icon(i) {
    this.#icon = i;
  }

  /**
   * Stat readout icon is animated by default.
   * @returns {boolean} true to make the icon animated.
   */
  isAnimated() {
    return true;
  }

  /**
   * Default scale (font size) for stat readouts.
   */
  static scale() { return 0.5; }

  /**
   * Draw this stat readout.
   * @param {object} g The graphics context.
   */
  draw(g) {
    super.draw(g);

    const rect = this.rect;
    const pad = this.pad;
    const scale = this.scale;

    const icon = this.#icon;

    // draw icon
    const tps = global.textPixelSize;
    const xy = [rect[0] + pad, rect[1] + pad + scale * tps];

    if (!icon) { return; }
    const layout = this.isAnimated() ?
      icon.getCurrentAnimatedLayout() : icon.frames[0]; // icon.js

    drawLayout(g, xy[0], xy[1], layout, false, new FontSpec(pad, scale, true)); // character.js
    drawLayout(g, xy[0], xy[1], layout, false, new FontSpec(0, scale, false)); // character.js
  }
}
