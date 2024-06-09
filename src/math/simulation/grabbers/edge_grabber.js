
/**
 * @file EdgeGrabber particle grabber object.
 *
 * similar to a circle grabber,
 * but checks precomputed shape angle->radius
 * instead of having one radius
 */
class EdgeGrabber extends Grabber {

  /**
   *
   * @param {Vector} pos
   * @param {number} angle
   * @param {object} edge
   * @param {Function} f The grab event callback function.
   */
  constructor(pos, angle, edge, f) {
    super(f);
    this.pos = pos;
    this.angle = angle;
    this.edge = edge;
  }

  /**
   *
   * @param _subgroup
   * @param _i
   * @param x
   * @param y
   */
  contains(_subgroup, _i, x, y) {
    const dx = x - this.pos.x;
    const dy = y - this.pos.y;
    const a = Math.atan2(dy, dx) - this.angle;
    const [_r, r2, dist] = this.edge.lookupAngle(a);
    const hit = (dx * dx + dy * dy) < r2;

    if (!hit) { return false; }

    let eo = 0;
    if (this.edgeOffset) { eo = this.edgeOffset; }

    // return arc length
    return eo + dist;
  }
}
