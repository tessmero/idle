
/**
 * @file SausageEdge thick line segment with circular terminals.
 */
class SausageEdge extends PathspecEdge {

  /**
   *
   * @param {number} length
   * @param {number} rad
   */
  constructor(length, rad) {
    super();

    this.length = length;
    this.rad = rad;
  }

  /**
   *
   */
  getCircumference() {

    // wrap around sausage
    // twice length + 2 semicircle caps
    return 2 * this.length + twopi * this.rad;
  }

  /**
   * Compute edge data at given point along cirumference.
   * @param {number} d The one-dimensionsional coordinate along this edge.
   * @returns {number[]} The computed angle, radius, and normal angle
   */
  computePoint(d) {

    const circ = this.getCircumference(); // complete edge length
    const len = this.length; // length of straight segment
    const rad = this.rad; // radius of end caps
    const cap = pi * rad; // length of semicircle cap

    let p; let norm;

    // compute sausage laying along x-axis

    // start on upper straight segment -->
    if (d < len) {
      p = v(d - len / 2, -rad);
      norm = -pio2;
    }

    // down first semicircle cap )
    else if (d < (len + cap)) {
      const angle = pi * (d - len) / cap - pio2;
      p = v(len / 2, 0).add(vp(angle, rad));
      norm = angle;
    }

    // return on the lower straight segment <--
    else if (d < (len + cap + len)) {
      p = v(-((d - len - cap) - len / 2), rad);
      norm = pio2;
    }

    // up final semicircle cap (
    else {
      const angle = pi * (cap - (circ - d)) / cap + pio2;
      p = v(-len / 2, 0).add(vp(angle, rad));
      norm = angle;
    }

    return [p.getAngle(), p.getMagnitude(), norm];
  }
}
