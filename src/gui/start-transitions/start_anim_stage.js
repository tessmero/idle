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
   *
   * @param {object} _g The graphics context.
   * @param {number[]} _rect The rectangle to cover with the animation.
   */
  draw(_g, _rect) {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }
}
