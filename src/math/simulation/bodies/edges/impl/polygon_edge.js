/**
 * @file PolygonEdge defined by polygon vertices.
 */
class PolygonEdge extends PathspecEdge {
  #polyVerts;

  /**
   *
   * @param {string} titleKey readable unique title to submit to EdgeManager
   * @param {Vector[]} verts
   */
  constructor(titleKey, verts) {
    super(titleKey);

    // for convenience
    // arrange list so top-left most point is first
    let tlIndex = 0;
    const tl = v(-100, -100);
    let bestD2 = 1e10;
    verts.forEach((v, i) => {
      const d2 = tl.sub(v).getD2();
      if (d2 < bestD2) {
        bestD2 = d2;
        tlIndex = i;
      }
    });
    const tlVerts = [...verts.slice(tlIndex), ...verts.slice(0, tlIndex), verts[tlIndex]];
    this.#polyVerts = tlVerts;

    // compute total circumference
    // and cumulative side lengths
    const csl = [0];
    const n = tlVerts.length;
    let dist = 0;
    for (let i = 0; i < n; i++) {
      dist = dist + tlVerts[(i + 1) % n]
        .sub(tlVerts[i])
        .getMagnitude();
      csl.push(dist);
    }
    this.csl = csl;
  }

  /**
   *
   */
  getCircumference() {
    return this.csl[this.csl.length - 1];
  }

  /**
   * Compute edge data at given point along cirumference.
   * @param {number} d The one-dimensionsional coordinate along this edge.
   * @returns {number[]} The computed angle, radius, and normal angle
   */
  computePoint(d) {

    // list of cumulative side lengths
    const csl = this.csl;

    // which side of polygon are we on
    // Side Index
    const si = -1 + csl.findIndex((td) => d < td);

    // where along that side
    // Side Ratio 0-1
    const sr = (d - csl[si]) / (csl[si + 1] - csl[si]);

    // xy of two relevant polygon verts
    const v = this.#polyVerts;
    const v0 = v[si];
    const v1 = v[si + 1];

    // normal angle of polygon side
    const norm = cleanAngle(v1.sub(v0).getAngle() - pio2);

    // xy of point in question
    const p = va(v0, v1, sr);

    return [p.getAngle(), p.getMagnitude(), norm];
  }

  /**
   * Override Edge to trace more efficiently.
   * Trace the shape of the edge with the given pos,angle offsets.
   * @param {Vector} pos The position to draw at.
   * @param {number} angle The orientation to draw the edge with.
   * @param {?number} scale The scale factor used for BodyPreviewElement
   * @param {?number} _angleStep The angle increment (doesn't matter here)
   */
  * vTrace(pos, angle, scale = 1, _angleStep = 5e-2) {
    for (const v of this.#polyVerts) {
      yield pos.add(v.rotate(angle).mul(scale));
    }
  }
}
