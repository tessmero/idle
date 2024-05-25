
// An edge is a boundary that particles interact with
//
// the shape of the edge is stored in constant set of polar coords
// where the origin is the center of a rotating body outlined by this edge
//
// the edge object is agnostic of the body's state
// so we don't care about the specific position/orientation/momentum
// here we only consider one arbitrary orientation
/**
 *
 */
class Edge {

  // compute shape lookup tables
  // see pathspec_edge.js or radspec_edge.js
  /**
   *
   */
  computeEdgeShape() {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }

  // settings for particles sliding on edge
  /**
   *
   */
  getFriction() { return 2e-3; }

  /**
   *
   */
  getG() { return 6e-6; }

  // get precomputed [rad,r2,circ dist] at given angle
  /**
   *
   * @param a
   */
  lookupAngle(a) {
    let i = Math.round(a * this.angleLutN / twopi);
    i = nnmod(i, this.angleLutN);
    i = i * this.angleLutNDims;
    const s = this.angleLut;
    return [s[i], s[i + 1], s[i + 2]];
  }

  // get precomputed [angle,radius,normal angle,r2]
  // at given distance along circumerence
  /**
   *
   * @param d
   */
  lookupDist(d) {
    let i = Math.round(d * this.distLutN / this.circ);
    i = nnmod(i, this.distLutN);
    i = i * this.distLutNDims;
    const s = this.distLut;
    return [s[i], s[i + 1], s[i + 2], s[i + 3]];
  }

  // helper to draw edge
  // with given pos,angle offsets onscreen
  /**
   *
   * @param g
   * @param pos
   * @param angle
   */
  trace(g, pos, angle) {
    g.beginPath();
    for (let a = 0; a < twopi; a = a + 1e-2) {
      const [r, _r2, _dist] = this.lookupAngle(a);
      const p = pos.add(vp(a + angle, r));
      g.lineTo(...p.xy());
    }
    g.closePath();
  }

}
