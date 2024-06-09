
/**
 * @file CircleGrabber grabs particles in circular region.
 */
class CircleGrabber extends Grabber {
  /**
   *
   * @param pos
   * @param rad
   * @param f
   * @param edgeOffset
   */
  constructor(pos, rad, f, edgeOffset) {
    super(f);
    this.pos = pos;
    this.rad = rad;
    this.r2 = rad * rad;
    this.edgeOffset = edgeOffset;
  }

  /**
   *
   * @param subgroup
   * @param i
   * @param x
   * @param y
   */
  contains(subgroup, i, x, y) {
    const dx = x - this.pos.x;
    const dy = y - this.pos.y;
    const hit = (dx * dx + dy * dy) < this.r2;

    if (!hit) { return false; }

    let eo = 0;
    if (this.edgeOffset) { eo = this.edgeOffset; }

    // return arc length
    let a = Math.atan2(dy, dx);
    if (this.edgeReversed) { a = a * -1; }
    return eo + nnmod(a, twopi) * this.rad;
  }
}
