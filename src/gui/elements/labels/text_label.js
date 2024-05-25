// a line of unchanging on-screen text
/**
 *
 */
class TextLabel extends GuiElement {
  /**
   *
   * @param rect
   * @param label
   */
  constructor(rect, label) {
    super(rect);

    this.rect = rect;
    this.label = label;
    this.pad = this.constructor.pad();
    this.letterPixelPad = this.constructor.letterPixelPad();
    this.center = true;
  }

  // default vals
  /**
   *
   */
  static pad() { return 0.005; }

  /**
   *
   */
  static letterPixelPad() { return 0.005; }

  // set optional style 'tooltip', 'hud', 'tiny'
  /**
   *
   * @param s
   */
  withStyle(s) {
    this.style = s;
    return this;
  }

  /**
   *
   * @param c
   */
  withCenter(c) {
    this.center = c;
    return this;
  }

  /**
   *
   * @param p
   */
  withLetterPixelPad(p) {
    this.letterPixelPad = p;
    return this;
  }

  /**
   *
   * @param p
   */
  withPad(p) {
    this.pad = p;
    return this;
  }

  // implement GuiElement
  /**
   *
   * @param g
   */
  draw(g) {
    const rect = this.rect;
    const label = this.label;
    const scale = this.scale;

    let p;
    if (this.center) {
      p = rectCenter(...rect);
    }
    else {
      p = [rect[0] + this.pad, rect[1] + this.pad + scale * global.textPixelSize];
    }

    if (this.style === 'inverted') {

      // draw simple white text
      drawText(g, ...p, label, this.center, new FontSpec(0, scale, true));

    }
    else if (this.style === 'hud') {

      // draw extra readable for hud
      drawText(g, ...p, label, this.center, new FontSpec(this.letterPixelPad, scale, true));
      drawText(g, ...p, label, this.center, new FontSpec(0, scale, false));

    }
    else if (this.style === 'tiny') {

      // should draw tiny 3x5 pixel font simple black text
      drawText(g, ...p, label, this.center, new FontSpec(0, scale, false));

    }
    else {

      // draw simple black text
      drawText(g, ...p, label, this.center, new FontSpec(0, scale, false));
    }

    if (global.debugUiRects) {

      // draw debug rectangle
      g.strokeStyle = global.colorScheme.fg;
      g.lineWidth = global.lineWidth;
      g.strokeRect(...rect);
    }
  }

  // implement GuiElement
  /**
   *
   */
  click() {
    // do nothing
  }
}
