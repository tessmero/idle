
/**
 * @file LineGrabber object type.
 *
 * Grab points within a certain distance from a line segment.
 */
class LineGrabber extends Grabber {
  /**
   *
   * @param a
   * @param b
   * @param rad
   * @param f
   * @param edgeOffsetA
   * @param edgeOffsetB
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
   * @param subgroup
   * @param i
   * @param x
   * @param y
   */
  contains(subgroup, i, x, y) {
    let dx = x - this.a.x;
    let dy = y - this.a.y;
    const d = this.b.sub(this.a);
    let r = (dx * d.x + dy * d.y) / d.getD2();
    if ((r < 0) || (r > 1)) { return false; }

    // nearest point on line
    const px = this.a.x + d.x * r;
    const py = this.a.y + d.y * r;

    dx = px - x;
    dy = py - y;

    const hit = dx * dx + dy * dy < this.rad2;
    if (!hit) { return null; }

    // return 1D edge location
    const cw = clockwise(this.a, this.b, v(x, y)); // which side (boolean)
    const len = this.a.sub(this.b).getMagnitude();
    r = r * len;
    return cw ? this.edgeOffsetA + r : this.edgeOffsetB + (len - r);
  }
}
