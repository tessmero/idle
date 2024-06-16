
/**
 * @file FontSpec object type.
 * Font specification for drawing a single layer
 * of text on screen.
 *
 * Extra-readable text is displayed by drawing the same
 * text twice with different fontspecs (text_label.js)
 */
class FontSpec {

  /**
   *
   * @param {number} pad The extra distance to dilate each pixel drawn.
   * @param {number} scale The font size.
   * @param {boolean} clear True to clear instead of fill. Used to draw
   *                        background-color text that can be inverted later
   */
  constructor(pad = 0, scale = 1, clear = false) {
    this.pad = pad;
    this.scale = scale;
    this.clear = clear;
  }

  /**
   * Return true to skip drawing a pixel. Used in dissolving_font_spec.js
   * @returns {boolean} False so all pixels are drawn by default.
   */
  skipPixel() {
    return false;
  }
}
