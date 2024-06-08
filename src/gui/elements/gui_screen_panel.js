/**
 * @file GuiScreenPanel gui element.
 * displays a GameScreen instance.
 */
class GuiScreenPanel extends GuiElement {

  #innerScreen;
  #allowScaling;
  hideInnerGui = false;

  /**
   * Normally we assume rect and innerScreen have the same size.
   * If allowScaling is set to true, then they only
   * need to have the same aspect ratio.
   * @param {number[]} rect The rectangle for this gui element.
   * @param {GameScreen} innerScreen The inner screen to display.
   * @param {boolean} allowScaling False by default.
   */
  constructor(rect, innerScreen, allowScaling = false) {
    super(rect);
    this.#allowScaling = allowScaling;
    this.setInnerScreen(innerScreen);
    innerScreen.loop = true;
    this.hoverable = false;
  }

  /**
   *
   */
  set innerScreen(_s) { throw new Error('should use setInnerScreen'); }

  /**
   *
   */
  get innerScreen() { return this.#innerScreen; }

  /**
   *
   * @param s
   */
  setInnerScreen(s) {
    const oldScreen = this.#innerScreen;

    if (oldScreen) { s.mousePos = oldScreen.mousePos; }
    s.gsp = this;
    const r = this.rect;
    s.drawOffset = this.#allowScaling ? [0, 0] : [r[0], r[1]];
    this.#innerScreen = s;
  }

  /**
   *
   */
  reset() {
    this.#innerScreen.reset();
  }

  /**
   * Extend regular gui element update
   * by updating the inner screen.
   * @param dt
   * @param disableHover
   */
  update(dt, disableHover) {
    const hovered = super.update(dt, disableHover);

    if (!this.disableScreenUpdate) {
      this.#innerScreen.update(dt);
    }

    return hovered;
  }

  /**
   *
   */
  getScale() {
    return this.rect[2] / this.#innerScreen.rect[2];
  }

  /**
   *
   * @param g
   */
  draw(g) {
    if (this.#allowScaling) {
      const scale = this.getScale();
      const gct = global.canvasTransform;

      const mx = gct[0] * scale;
      const my = gct[3] * scale;

      const bx = gct[4] + this.rect[0] * gct[0];
      const by = gct[5] + this.rect[1] * gct[3];

      // transform a,b,c,d,e,f
      g.setTransform(mx, 0, 0, my, bx, by);
    }

    this.#innerScreen.draw(g, this.hideInnerGui);

    if (this.#allowScaling) {
      global.ctx.setTransform(...global.canvasTransform);
    }

    // trim sides
    const [rx, ry, rw, rh] = this.rect;
    const m = rw * 0.1;
    const h = rh + 0.002;
    const y = ry - 0.001;
    g.clearRect(rx - m, y, m, h);
    g.clearRect(rx + rw, y, m, h);
    g.clearRect(rx - m / 2, y - m, rw + m, m);
    g.clearRect(rx - m / 2, y + h, rw + m, m);

    g.strokeStyle = global.colorScheme.fg;
    g.lineWidth = global.lineWidth;

    Button._draw(g, this.rect, this.hovered, false);
  }

  /**
   *
   */
  click() {}
}
