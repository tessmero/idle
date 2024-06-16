/**
 * @file StarEdge wavey star/flower edge shape.
 * defined by number of petals and radii.
 */
class StarEdge extends RadspecEdge {

  /**
   *
   * @param {number} n
   * @param {number} minRad
   * @param {number} maxRad
   */
  constructor(n, minRad, maxRad) {
    super();
    this.n = n;
    this.minRad = minRad;
    this.maxRad = maxRad;
  }

  /**
   *
   * @param {number} angle
   */
  computeRadius(angle) {
    const mi = this.minRad;
    const ma = this.maxRad;
    const n = this.n;

    return mi + (ma - mi) * (1 + 0.5 * Math.sin(angle * n));
  }

}
