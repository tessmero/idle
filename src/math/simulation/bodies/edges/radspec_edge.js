
/**
 * @file RadspecEdge Radius Specified Edge
 * base class for edges that are specified
 * based on an angle->radius function
 */
class RadspecEdge extends Edge {

  /**
   *
   * @param {number} _angle
   */
  computeRadius(_angle) {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }

  /**
   *
   */
  computeEdgeShape() {

    // pre-compute angle->(radius,r2,distance)
    // (similar to shape, but indexed by
    // angle instead of distance along circumference)
    const angleLutN = 1000;
    const angleLutNDims = 3; // radius,r2
    const angleLut = new FloatArray(angleLutN * angleLutNDims).get();
    let circ = 0;
    const angleStep = twopi / angleLutN;
    for (let i = 0; i < angleLutN; i++) {
      const rad = this.computeRadius(i * twopi / angleLutN);
      angleLut[i * angleLutNDims + 0] = rad;
      angleLut[i * angleLutNDims + 1] = rad * rad;
      angleLut[i * angleLutNDims + 2] = circ;
      circ = circ + angleStep * rad;

      if (isNaN(circ)) { throw new Error('poop'); }
    }
    this.angleLutN = angleLutN;
    this.angleLutNDims = angleLutNDims;
    this.angleLut = angleLut;
    this.circ = circ;

    // pre-compute edge path shape in polar coords
    // (distance along circumference) -> (a,r,norm,r2)
    const distLutN = 1000;
    const distLutNDims = 4; // angle, radius, normal angle,r2
    const distLut = new FloatArray(distLutN * distLutNDims).get();
    for (let i = 0; i < distLutN; i++) {
      const [angle, radius, norm] = this.computePoint(circ * i / distLutN);
      distLut[i * distLutNDims + 0] = angle;
      distLut[i * distLutNDims + 1] = radius;
      distLut[i * distLutNDims + 2] = norm;
      distLut[i * distLutNDims + 3] = radius * radius;
    }
    this.distLutN = distLutN;
    this.distLutNDims = distLutNDims;
    this.distLut = distLut;
  }

  /**
   * called when pre-computing edge shape
   * compute position+normal [angle,radius,normal angle]
   * at given distance along circumerence
   * @param {number} targetD The 1D position along circumference.
   */
  computePoint(targetD) {

    let bestI = 0;
    let bestD = 1e5;
    for (let i = 0; i < this.angleLutN; i++) {
      const circ = this.angleLut[i * this.angleLutNDims + 2];
      const d = Math.abs(circ - targetD);
      if (d < bestD) {
        bestD = d;
        bestI = i;
      }
    }
    const angle = bestI * twopi / this.angleLutN;
    const j = bestI * this.angleLutNDims;
    const r = this.angleLut[j + 0];

    const prevI = nnmod(bestI - 1, this.angleLutN);
    const prevAngle = prevI * twopi / this.angleLutN;
    const prevJ = prevI * this.angleLutNDims;
    const prevRad = this.angleLut[prevJ];
    const prevP = vp(prevAngle, prevRad);

    const nextI = nnmod(bestI + 1, this.angleLutN);
    const nextAngle = nextI * twopi / this.angleLutN;
    const nextJ = nextI * this.angleLutNDims;
    const nextRad = this.angleLut[nextJ];
    const nextP = vp(nextAngle, nextRad);

    const norm = nextP.sub(prevP).getAngle() - pio2;

    return [angle, r, norm];

  }

}
