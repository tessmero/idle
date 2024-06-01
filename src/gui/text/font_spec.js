
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
   * @param pad
   * @param scale
   * @param clear
   */
  constructor(pad = 0, scale = 1, clear = false) {
    this.pad = pad;
    this.scale = scale;
    this.clear = clear;
  }

  /**
   * by default we draw all pixels
   * overridden in dissolving_font_spec.js
   * @returns {boolean} False to draw all pixels.
   */
  skipPixel() {
    return false;
  }
}
