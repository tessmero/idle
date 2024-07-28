/**
 * @file CircleEdge defined by radius.
 */
class CircleEdge extends RadspecEdge {
  #rad;

  /**
   *
   * @param {boolean} isMini
   */
  constructor(isMini) {
    super(`${isMini ? 'mini ' : '' }circle`);

    this.#rad = (isMini ? global.tutorialScaleFactor : 1) * CircleEdge.rad();
  }

  /**
   *
   */
  static rad() {
    return 0.1;
  }

  /**
   *
   */
  get rad() {
    return this.#rad;
  }

  /**
   *
   */
  getCircumference() {
    return twopi * this.#rad;
  }

  /**
   *
   * @param {number} _a
   */
  computeRadius(_a) {
    return this.#rad;
  }

}
