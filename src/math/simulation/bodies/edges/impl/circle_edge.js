/**
 * @file CircleEdge defined by radius.
 */
class CircleEdge extends RadspecEdge {

  /**
   *
   * @param rad
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
   * @param _a
   */
  computeRadius(_a) {
    return this.rad;
  }

}
