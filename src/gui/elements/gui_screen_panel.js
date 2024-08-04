/**
 * @file GuiScreenPanel gui element.
 * displays a GameScreen instance.
 */
class GuiScreenPanel extends GuiElement {

  #innerScreen;
  #allowScaling;
  #hideInnerGui;

  /**
   * Normally we assume rect and innerScreen have the same size.
   * If allowScaling is set to true, then they only
   * need to have the same aspect ratio.
   * @param {number[]} rect The rectangle for this gui element.
   * @param {object} params The parameters.
   * @param {GameScreen} params.innerScreen The inner screen to display.
   * @param {boolean} params.allowScaling False by default, so assume screen
   *                                      and rect have matching dims.
   * @param {boolean} params.hideInnerGui False by default, set to true to
   *                                      skip drawing inner screen's gui
   */
  constructor(rect, params) {
    super(rect, { border: new RoundedBorder(), ...params });

    const {
      allowScaling = false,
      hideInnerGui = false,
    } = params;

    this.#allowScaling = allowScaling;
    this.#hideInnerGui = hideInnerGui;
    this._setInnerScreen(params.innerScreen);
    params.innerScreen.loop = true;
    this.hoverable = false;
  }

  /**
   * Prevent assigning inner screen with equals sign.
   */
  set innerScreen(_s) { throw new Error('should use constructor'); }

  /**
   * Allow setting inner screen after construction.
   * Used for box transition.
   * @param {GameScreen} s
   */
  setInnerScreen(s) { this._setInnerScreen(s); }

  /**
   * Get the screen being displayed.
   * @returns {GameScreen} The inner screen.
   */
  get innerScreen() { return this.#innerScreen; }

  /**
   * Set the screen to display. Used to enter and exit boxes.
   * @param {GameScreen} s The screen to display.
   */
  _setInnerScreen(s) {
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
   * @param {number} dt The time elapsed in millseconds.
   * @param {boolean} disableHover True if mouse hovering should be disabled.
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
   * @param {object} g The graphics context.
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

    // draw inner screen
    this.#innerScreen.draw(g, this.#hideInnerGui);

    if (this.#allowScaling) {
      global.ctx.setTransform(...global.canvasTransform);
    }

    // trim a thick margin outside of rectangle
    const [rx, ry, rw, rh] = this.rect;
    const m = rw * 0.1;
    const h = rh + 0.002;
    const y = ry - 0.001;
    g.clearRect(rx - m, y, m, h);
    g.clearRect(rx + rw, y, m, h);
    g.clearRect(rx - m / 2, y - m, rw + m, m);
    g.clearRect(rx - m / 2, y + h, rw + m, m);

    // trim inner screen within rectangle as necessary
    if (this.border) {
      this.border.cleanup(g, this.rect);
    }

    // draw border
    g.strokeStyle = global.colorScheme.fg;
    g.lineWidth = global.lineWidth;
    Border.draw(g, this.rect, { border: this.border, hovered: this.hovered, fill: false });
  }

  /**
   *
   */
  click() {}
}
