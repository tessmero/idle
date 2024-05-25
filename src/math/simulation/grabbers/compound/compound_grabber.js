/**
 *
 */
class CompoundGrabber extends Grabber {

  /**
   *
   * @param f
   */
  constructor(f = null) {
    super(f);
    this.children = [];
  }

  /**
   *
   * @param g
   */
  drawDebug(g) {
    this.children.forEach((c) => c.drawDebug(g));
  }

  // called periodically
  // set child member vars
  // do not add or remove children
  /**
   *
   */
  update() {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }

  // check if point in grab region
  // if so, return nearest edge location
  /**
   *
   * @param subgroup
   * @param _i
   * @param x
   * @param y
   * @param angle
   */
  contains(subgroup, _i, x, y, angle = 0) {
    for (let i = 0; i < this.children.length; i++) {
      const c = this.children[i];
      const hit = c.contains(subgroup, i, x, y, angle);
      if (hit) {
        return hit;
      }
    }
    return null;
  }
}
