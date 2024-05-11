// black grid gradually covers start menu
class GridFadeOut extends FadeOut {
  constructor() {
    super();
    this.duration = 1000;
  }

  // implement FadeOut
  draw(g) {

    g.fillStyle = global.colorScheme.fg;

    // draw grid lines
    const sc = global.screenCorners;
    const sr = global.screenRect;
    const d = 0.1;
    const [x0, y0] = sc[0].xy();
    const [x1, y1] = sc[2].xy();
    let maxoff = 0.5;
    const lw = (this.t / (this.duration * (1 - maxoff))) * d;
    maxoff = maxoff * d;
    for (let x = x0; x < x1; x = x + d) {
      const mylw = Math.max(0, lw - maxoff * (x1 - x) / (x1 - x0));
      g.fillRect(x - mylw / 2, sr[1], mylw, sr[3]);
    }
    for (let y = y0; y < y1; y = y + d) {
      const mylw = Math.max(0, lw - maxoff * (y1 - y) / (y1 - y0));
      g.fillRect(sr[0], y - mylw / 2, sr[2], mylw);
    }
  }
}
