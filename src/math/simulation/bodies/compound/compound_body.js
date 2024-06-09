/**
 * @file CompoundBody
 * base class for bodies with children bodies
 */
class CompoundBody extends Body {

  #constraints = [];
  #children = [];
  #controlPoints = [];

  /**
   * return Body instance in this.children
   */
  getMainBody() {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
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
  draw(g) {
    this.#children.forEach((c) => c.draw(g));
  }

  /**
   *
   * @param {object} g The graphics context.
   */
  drawDebug(g) {
    // this.constraints.forEach(c => c.drawDebug(g) )
    this.#children.forEach((c) => c.drawDebug(g));
  }

  /**
   *
   * @param dt
   */
  update(dt) {
    const beingControlled = this.#controlPoints.find((cp) => cp === this.sim.draggingControlPoint);

    this.#constraints.forEach((c) => c.update(dt));
    this.#children.forEach((c) => c.update(dt, beingControlled));

    return true;
  }

  /**
   *
   * @param sim
   */
  register(sim) {
    this.#children.forEach((c) => {
      c.parent = this;
      c.register(sim);
    });
  }

  /**
   *
   * @param sim
   */
  unregister(sim) {
    this.#children.forEach((c) => c.unregister(sim));
  }
}
