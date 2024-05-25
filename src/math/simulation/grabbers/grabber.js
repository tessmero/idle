/**
 *
 */
class Grabber {

  // callback f(x,y) when a particle is grabbed
  /**
   *
   * @param f
   */
  constructor(f = null) {
    this.grabbed = f;
  }

  /**
   *
   * @param em
   */
  withEdgeMap(em) {
    this.edgeMap = em;
    return this;
  }

  /**
   *
   * @param _g
   */
  drawDebug(_g) {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }

  // check if point in grab region
  // if so, return nearest edge location
  /**
   *
   * @param _subgroup
   * @param _i
   * @param _x
   * @param _y
   */
  contains(_subgroup, _i, _x, _y) {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }
}
