/**
 * @file StarEdge wavey star/flower edge shape.
 * defined by number of petals and radii.
 */
class StarEdge extends RadspecEdge {
  #n = 5;
  #minRad;
  #maxRad;

  /**
   *
   * @param {boolean} isMini
   */
  constructor(isMini) {
    super(`${isMini ? 'mini ' : '' }star`);

    const s = isMini ? global.tutorialScaleFactor : 1;
    this.#minRad = 0.05 * s;
    this.#maxRad = 0.1 * s;
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
