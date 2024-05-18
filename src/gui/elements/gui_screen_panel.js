// gui element that displays a GameScreen instance
class GuiScreenPanel extends GuiElement {
  constructor(rect, screen) {
    super(rect);
    this.screen = screen;
    const r = this.rect;

    screen.drawOffset = [r[0], r[1]];

    this.screen.loop = true;
  }

  reset() {
    this.screen.reset();
  }

  update(dt, disableHover) {
    const hovered = super.update(dt, disableHover);

    this.screen.update(dt);

    return hovered;
  }

  draw(g) {
    this.screen.draw(g);

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

  click() {}
}
