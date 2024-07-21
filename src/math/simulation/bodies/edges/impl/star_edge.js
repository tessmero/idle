/**
 * @file StarEdge wavey star/flower edge shape.
 * defined by number of petals and radii.
 */
class StarEdge extends RadspecEdge {
  #n = 5;
  #minRad = 0.05;
  #maxRad = 0.1;

  /**
   *
   */
  constructor() {
    super('star');
  }

  /**
   *
   * @param {number} angle
   */
  computeRadius(angle) {
    const mi = this.#minRad;
    const ma = this.#maxRad;
    const n = this.#n;

    return mi + (ma - mi) * (1 + 0.5 * Math.sin(angle * n));
  }

}
