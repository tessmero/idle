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
   * @param {string} label
   */
  constructor(rect, label) {
    super(rect);

    this.#label = label;
    this.#pad = this.constructor.pad();
    this.#letterPixelPad = this.constructor.letterPixelPad();
    this.#center = true;
  }

  /**
   * Assigning label with equal sign is not allowed.
   */
  set label(_l) { throw new Error('should use setLabel'); }

  /**
   *
   * @param l
   */
  setLabel(l) {
    this.#label = l;
  }

  /**
   * Assigning center with equal sign is not allowed.
   */
  set center(_c) { throw new Error('should use setCenter or withCenter'); }

  /**
   * default padding space around text
   * @returns {number} Default padding distance.
   */
  static pad() { return 0.005; }

  /**
   * Get actual padding for this label.
   * @returns {number} Padding for this instance.
   */
  get pad() { return this.#pad; }

  /**
   * default padding around each pixel
   * for drawing with extra-readable 'hud' style
   */
  static letterPixelPad() { return 0.005; }

  /**
   * set optional drawing style 'tooltip', 'hud', 'tiny'
   * @param s
   */
  withStyle(s) {
    this.#style = s;
    return this;
  }

  /**
   *
   * @param c
   */
  setCenter(c) {
    this.#center = c;
  }

  /**
   *
   * @param c
   */
  withCenter(c) {
    this.setCenter(c);
    return this;
  }

  /**
   *
   * @param p
   */
  withLetterPixelPad(p) {
    this.#letterPixelPad = p;
    return this;
  }

  /**
   * Chainable
   * @param p
   */
  withPad(p) {
    this.#pad = p;
    return this;
  }

  /**
   * Draw this label.
   * @param {object} g The graphics context.
   */
  draw(g) {
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

    if (global.debugUiRects) {

      // draw debug rectangle
      g.strokeStyle = global.colorScheme.fg;
      g.lineWidth = global.lineWidth;
      g.strokeRect(...rect);
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
