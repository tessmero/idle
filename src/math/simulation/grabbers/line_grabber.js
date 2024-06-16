
/**
 * @file LineGrabber object type.
 *
 * Grab points within a certain distance from a line segment.
 */
class LineGrabber extends Grabber {

  /**
   *
   * @param {Vector} a
   * @param {Vector} b
   * @param {number} rad
   * @param {Function} f
   * @param {number} edgeOffsetA
   * @param {number} edgeOffsetB
   */
  constructor(a, b, rad, f, edgeOffsetA, edgeOffsetB) {
    super(f);
    this.a = a;
    this.b = b;
    this.rad = rad;
    this.rad2 = rad * rad;

    this.edgeOffsetA = edgeOffsetA;
    this.edgeOffsetB = edgeOffsetB;
  }

  /**
   *
   * @param {object} g The graphics context.
   */
  drawDebug(g) {
    g.strokeStyle = 'yellow';
    g.lineWidth = this.rad * 2;
    g.beginPath();
    g.moveTo(...this.a.xy());
    g.lineTo(...this.b.xy());
    g.stroke();
  }

  /**
   *
   * @param {object} _subgroup
   * @param {number} _i
   * @param {number} x
   * @param {number} y
   */
  contains(_subgroup, _i, x, y) {
    const a = this.a;
    const b = this.b;
    const d = b.sub(a);

    let dx = x - a.x;
    let dy = y - a.y;
    let r = (dx * d.x + dy * d.y) / d.getD2();
    if ((r < 0) || (r > 1)) { return false; }

    // nearest point on line
    const px = a.x + d.x * r;
    const py = a.y + d.y * r;

    dx = px - x;
    dy = py - y;

    const hit = dx * dx + dy * dy < this.rad2;
    if (!hit) { return null; }

    // return 1D edge location
    const cw = clockwise(a, b, v(x, y)); // which side (boolean)
    const len = a.sub(b).getMagnitude();
    r = r * len;
    return cw ? this.edgeOffsetA + r : this.edgeOffsetB + (len - r);
  }
}
