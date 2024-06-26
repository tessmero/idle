/**
 * @file GridTrans black grid gradually covers/uncovers screen.
 */
class GridTrans extends ReversibleTransition {

  duration = 1000;

  /**
   *
   * @param {object} g The graphics context.
   * @param {number[]} rect The rectangle to cover.
   */
  draw(g, rect) {

    g.fillStyle = global.colorScheme.fg;

    const t = this.reversed ? (this.duration - this.t) : this.t;

    // draw grid lines
    const sr = rect;
    const d = 0.09 * sr[3];
    const [x0, y0] = [sr[0], sr[1]];
    const [x1, y1] = [sr[0] + sr[2], sr[1] + sr[3]];
    let maxoff = 0.5;
    const lw = (t / (this.duration * (1 - maxoff))) * d;
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
