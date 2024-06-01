/**
 * @file StartAnimStage base class for short section of full-screen animation
 * involved in the (star tmenu -> playing) transition sequence
 */
class StartAnimStage {

  /**
   *
   */
  constructor() {
    this.t = 0;
    this.duration = 1000;
  }

  /**
   * @returns {boolean} False to let the screen be cleared before draw.
   */
  stopScreenClear() {
    return false;
  }

  /**
   *
   * @param _g
   * @param _rect
   */
  draw(_g, _rect) {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }
}
