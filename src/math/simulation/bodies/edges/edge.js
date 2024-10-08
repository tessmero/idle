
/**
 * @file Edge object type.
 * An edge is a distinct solid shape that particles interact with
 *
 * the shape of the edge is stored in polar coords
 * where the origin is the center of mass of a rotating body
 *
 * Otherwise the edge object is agnostic of the body's state
 * and doesn't care about the specific position/orientation/momentum
 */
class Edge {
  #titleKey;

  /**
   *
   * @param {string} titleKey readable unique title to submit to EdgeManager
   */
  constructor(titleKey) {
    this.#titleKey = titleKey;
    EdgeManager().submitNewEdge(this);
  }

  /**
   *
   */
  get titleKey() {
    return this.#titleKey;
  }

  /**
   * Compute lookup table members.
   * see pathspec_edge.js or radspec_edge.js
   */
  computeEdgeShape() {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }

  /**
   * settings for particles sliding on edge
   */
  getFriction() { return 2e-3; }

  /**
   *
   */
  getG() { return 6e-6; }

  /**
   * get precomputed [rad,r2,circ dist] at given angle
   * @param {number} a The angle in radians.
   */
  lookupAngle(a) {
    let i = Math.round(a * this.angleLutN / twopi);
    i = nnmod(i, this.angleLutN);
    i = i * this.angleLutNDims;
    const s = this.angleLut;
    return [s[i], s[i + 1], s[i + 2]];
  }

  /**
   * get precomputed [angle,radius,normal angle,r2]
   * at given distance along circumference
   * @param {number} d The 1D position along this edge.
   */
  lookupDist(d) {
    let i = Math.round(d * this.distLutN / this.circ);
    i = nnmod(i, this.distLutN);
    i = i * this.distLutNDims;
    const s = this.distLut;
    return [s[i], s[i + 1], s[i + 2], s[i + 3]];
  }

  /**
   * Trace the shape of the edge with the given pos,angle offsets.
   * @param {object} g The graphics context.
   * @param {Vector} pos The position to draw at.
   * @param {number} angle The orientation to draw the edge with.
   * @param {?number} scale The scale factor used for BodyPreviewElement
   */
  trace(g, pos, angle, scale = 1) {
    g.beginPath();
    for (const p of this.vTrace(pos, angle, scale)) {
      g.lineTo(...p.xy());
    }
    g.closePath();
  }

  /**
   * Trace the shape of the edge with the given pos,angle offsets.
   * @param {Vector} pos The position to draw at.
   * @param {number} angle The orientation to draw the edge with.
   * @param {?number} scale The scale factor used for BodyPreviewElement
   * @param {?number} angleStep The angle increment
   */
  * vTrace(pos, angle, scale = 1, angleStep = 5e-2) {
    const a0 = 5 * pio4; // start from top-left
    for (let a = 0; a < twopi; a = a + angleStep) {
      const [r, _r2, _dist] = this.lookupAngle(a0 + a);
      const p = pos.add(vp(a0 + a + angle, r * scale));
      yield p;
    }
  }

}
