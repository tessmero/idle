/**
 * gui element that displays a GameScreen instance
 */
class GuiScreenPanel extends GuiElement {
  /**
   *
   * @param rect
   * @param innerScreen
   */
  constructor(rect, innerScreen) {
    super(rect);
    this.innerScreen = innerScreen;
    const r = this.rect;

    innerScreen.drawOffset = [r[0], r[1]];

    this.innerScreen.loop = true;
  }

  /**
   *
   */
  reset() {
    this.innerScreen.reset();
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
      this.innerScreen.update(dt);
    }

    return hovered;
  }

  /**
   *
   * @param g
   */
  draw(g) {
    this.innerScreen.draw(g);

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
    g.strokeRect(...this.rect);
  }

  /**
   *
   */
  click() {}
}
