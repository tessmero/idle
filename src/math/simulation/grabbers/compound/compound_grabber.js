/**
 * @file CompoundGrabber
 * Base class for grabbers that have children grabbers.
 */
class CompoundGrabber extends Grabber {
  #children = [];

  /**
   *
   * @param f
   */
  constructor(f = null) {
    super(f);
  }

  /**
   *
   */
  get children() { return this.#children; }

  /**
   * Prevent setting children with equals sign.
   */
  set children(_c) { throw new Error('should use setChildren'); }

  /**
   * Replace children with the given list.
   * @param {GuiElement[]} c The new list of children this composite should contain.
   */
  setChildren(c) { this.#children = c; }

  /**
   *
   * @param {object} g The graphics context.
   */
  drawDebug(g) {
    this.#children.forEach((c) => c.drawDebug(g));
  }

  /**
   * called periodically
   * set child member vars
   * do not add or remove children
   */
  update() {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }

  /**
   * check if point in grab region
   * if so, return nearest edge location
   * @param subgroup
   * @param _i
   * @param x
   * @param y
   * @param angle
   */
  contains(subgroup, _i, x, y, angle = 0) {
    const children = this.#children;
    for (let i = 0; i < children.length; i++) {
      const c = children[i];
      const hit = c.contains(subgroup, i, x, y, angle);
      if (hit) {
        return hit;
      }
    }
    return null;
  }
}
