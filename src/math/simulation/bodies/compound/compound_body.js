// base class for boddies with "children" boddies
/**
 *
 */
class CompoundBody extends Body {

  /**
   *
   * @param sim
   * @param pos
   */
  constructor(sim, pos) {
    super(sim, pos);

    this.constraints = [];
    this.children = [];
    this.controlPoints = [];
  }

  // return Body instance in this.children
  /**
   *
   */
  getMainBody() {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }

  /**
   *
   * @param g
   */
  draw(g) {
    this.children.forEach((c) => c.draw(g));
  }

  /**
   *
   * @param g
   */
  drawDebug(g) {
    // this.constraints.forEach(c => c.drawDebug(g) )
    this.children.forEach((c) => c.drawDebug(g));
  }

  /**
   *
   * @param dt
   */
  update(dt) {
    const beingControlled = this.controlPoints.find((cp) => cp === this.sim.draggingControlPoint);

    this.constraints.forEach((c) => c.update(dt));
    this.children.forEach((c) => c.update(dt, beingControlled));

    return true;
  }

  /**
   *
   * @param sim
   */
  register(sim) {
    this.children.forEach((c) => {
      c.parent = this;
      c.register(sim);
    });
  }

  /**
   *
   * @param sim
   */
  unregister(sim) {
    this.children.forEach((c) => c.unregister(sim));
  }
}
