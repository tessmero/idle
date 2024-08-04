/**
 * @file TextLabel Gui Element.
 * Instances display some fixed text on screen.
 */
class TextLabel extends GuiElement {

  #label;

  #style;
  #pad;
  #letterPixelPad;
  #center;

  /**
   *
   * @param {number[]} rect
   * @param {object} params The parameters.
   * @param {string} params.label The text to display.
   * @param {Function} params.pad Padding around outside of text.
   * @param {Function} params.letterPixelPad Padding around each character pixel.
   * @param {Function} params.center True if text should be centered in rect.
   * @param {Function} params.style Special style flag like 'hud'
   */
  constructor(rect, params = {}) {
    super(rect, params);
    const {
      label = '',
      pad = 0.005,
      letterPixelPad = 0.005,
      center = true,
      style = null,
    } = params;

    this.#label = label;
    this.#pad = pad;
    this.#letterPixelPad = letterPixelPad;
    this.#center = center;
    this.#style = style;
  }

  /**
   * Set display text after construction. Used in dynamic_text_label.js.
   * @param {string} l The new text to display.
   */
  setLabel(l) {
    this.#label = l;
  }

  /**
   * Assigning label with equal sign is not allowed.
   */
  set label(_l) {
    throw new Error('should use constructor');
  }

  /**
   * Assigning center with equal sign is not allowed.
   */
  set center(_c) {
    throw new Error('should use constructor');
  }

  /**
   * Get actual padding for this label.
   * @returns {number} Padding for this instance.
   */
  get pad() { return this.#pad; }

  /**
   * Chainable helper to apply special drawing style 'hud' or 'tiny'.
   * @param {string} _s The new drawing style.
   */
  withStyle(_s) {
    throw new Error('should use constructor');
  }

  /**
   * Set whether the text in this label should be centered.
   * @param {boolean} _c True if the text should be centered.
   */
  setCenter(_c) {
    throw new Error('should use constructor');
  }

  /**
   * Chainable helper to set whether the text in this label should be centered.
   * @param {boolean} _c True if the text should be centered.
   */
  withCenter(_c) {
    throw new Error('should use constructor');
  }

  /**
   * Chainable helper to set character pixel padding for 'hud' style text.
   * Used to add extra padding for big text in start menu.
   * @param {number} _p The distance to clear around each pixel.
   */
  withLetterPixelPad(_p) {
    throw new Error('should use constructor');
  }

  /**
   * Chainable helper to set padding distance between the text
   * and this elements bounding rectangle.
   * @param {number} _p The new padding distance.
   */
  withPad(_p) {
    throw new Error('should use constructor');
  }

  /**
   * Draw this label.
   * @param {object} g The graphics context.
   */
  draw(g) {
    super.draw(g);
    const rect = this.rect;
    const scale = this.scale;

    const label = this.#label;
    const style = this.#style;
    const center = this.#center;
    const pad = this.#pad;

    let p;
    if (center) {
      p = rectCenter(...rect);
    }
    else {
      p = [rect[0] + pad, rect[1] + pad + scale * global.textPixelSize];
    }

    if (style === 'inverted') {

      // draw simple white text
      drawText(g, ...p, label, center, new FontSpec(0, scale, true));

    }
    else if (style === 'hud') {

      // draw extra readable for hud
      drawText(g, ...p, label, center, new FontSpec(this.#letterPixelPad, scale, true));
      drawText(g, ...p, label, center, new FontSpec(0, scale, false));

    }
    else if (style === 'tiny') {

      // should draw tiny 3x5 pixel font simple black text
      drawText(g, ...p, label, center, new FontSpec(0, scale, false));

    }
    else {

      // draw simple black text
      drawText(g, ...p, label, center, new FontSpec(0, scale, false));
    }
  }

  /**
   * Called when this label is clicked.
   * Normally text labels do nothing when clicked.
   */
  click() {
    // do nothing
  }
}
