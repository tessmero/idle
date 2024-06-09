/**
 * @file DissolveTrans screen dissolves like floaters.
 */
class DissolveTrans extends ReversibleTransition {

  #rngSeed = randomSeed();
  duration = 1000;

  /**
   *
   * @param {object} g The graphics context.
   * @param {number[]} rect The screen rectangle to cover.
   */
  draw(g, rect) {
    const t = this.reversed ? this.t : this.duration - this.t;
    const solidity = t / this.duration;

    resetRand(this.#rngSeed);

    const tr = rect;
    const ts = 0.045 * avg(tr[2], tr[3]);
    const w = Math.ceil(tr[2] / ts);
    const h = Math.ceil(tr[3] / ts);
    g.fillStyle = global.colorScheme.fg;
    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        if (rand() > solidity) {
          g.fillRect(tr[0] + x * ts, tr[1] + y * ts, ts * 1.03, ts * 1.03);
        }
      }
    }
  }
}
