/**
 * @file CircleEdge defined by radius.
 */
class CircleEdge extends RadspecEdge {

  /**
   *
   * @param {number} rad
   */
  constructor(rad) {
    super();
    this.rad = rad;
  }

  /**
   *
   */
  getCircumference() {
    return twopi * this.rad;
  }

  /**
   *
   * @param {number} _a
   */
  computeRadius(_a) {
    return this.rad;
  }

}
