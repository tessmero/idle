// base class for edges that are specified
// based on a path along the circumference
class PathspecEdge extends Edge {

  // compute polar coord [angle,radius,normal angle,r2]
  // at given distance along circumerence
  computePoint(_d) {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }

  // get length of edge (which may loop)
  getCircumference() {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }

  computeEdgeShape() {
    const circ = this.getCircumference();
    this.circ = circ;

    // pre-compute edge shape as a path in polar coords
    // (distance along circumference) -> (angle,radius,norm,r2)
    const distLutN = 1000;
    const distLutNDims = 4; // angle, radius, normal angle,r2
    const distLut = new Float32Array(distLutN * distLutNDims);
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

    // pre-compute shape again, this time indexed by angle
    // angle -> (radius,r2,distance along circ)
    const angleLutN = 1000;
    const angleLutNDims = 3; // radius,r2, dist along circ
    const angleLut = new Float32Array(angleLutN * angleLutNDims);
    const startAngle = this.computePoint(0)[0];
    const ioff = nnmod(Math.floor(angleLutN * startAngle / twopi), angleLutN);
    for (let i = 0; i < angleLutN; i++) {
      const targetAngle = startAngle + twopi * i / angleLutN;

      const dli = this._getBestMatch(distLut, distLutNDims, targetAngle);
      const rad = distLut[dli * distLutNDims + 1];
      const dist = dli * circ / distLutN;

      const j = nnmod(i + ioff, angleLutN) * angleLutNDims;
      angleLut[j + 0] = rad;
      angleLut[j + 1] = rad * rad;
      angleLut[j + 2] = dist;
    }
    this.angleLutN = angleLutN;
    this.angleLutNDims = angleLutNDims;
    this.angleLut = angleLut;
  }

  // get
  _getBestMatch(distLut, ndims, targetAngle) {
    const n = distLut.length / ndims;
    let bestI = 0;
    let bestDa = 7;
    for (let i = 0; i < n; i++) {
      const angle = distLut[i * ndims];
      const da = Math.abs(cleanAngle(angle - targetAngle));
      if (da < bestDa) {
        bestDa = da;
        bestI = i;
      }
    }

    return bestI;
  }

}
