// specification for drawing single layer
// of   some specific text on screen
/**
 *
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

  // by default we draw all pixels
  // overridden in dissolving_font_spec.js
  /**
   *
   */
  skipPixel() {
    return false;
  }
}
