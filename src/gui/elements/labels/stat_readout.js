/**
 * @file StatReadout Gui Element
 * An icon followed by a line of dynamic text.
 */
class StatReadout extends DynamicTextLabel {

  #icon;

  /**
   *
   * @param {number[]} rect The rectangle to align elements in.
   * @param {object} params The parameters.
   * @param {Icon} params.icon The pixel art icon to display.
   * @param {string} params.labelFunc The funciton who's string return value will be displayed.
   */
  constructor(rect, params = {}) {

    super(rect, {
      center: false, scale: 0.5,

      ...params,

      // make room for icon by displaying
      // 2 blank spaces to the left of the label
      labelFunc: () => `  ${params.labelFunc()}`,
    });

    this.#icon = params.icon;
  }

  /**
   *
   */
  get icon() {
    return this.#icon;
  }

  /**
   * allow assigning icon with equals sign
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
