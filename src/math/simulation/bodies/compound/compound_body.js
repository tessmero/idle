/**
 * @file CompoundBody
 * base class for bodies with children bodies
 */
class CompoundBody extends Body {
  #constraints = [];
  #children = [];
  #controlPoints = [];
  #isMiniature;

  /**
   * return Body instance in this.children
   */
  getMainBody() {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }

  /**
   *
   */
  set isMiniature(m) {
    this.#isMiniature = m;
    this.#children.forEach((c) => { c.isMiniature = m; });
  }

  /**
   *
   */
  get isMiniature() {
    return this.#isMiniature;
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
   * @param {Body} c The child to add
   */
  addChild(c) { this.#children.push(c); }

  /**
   *
   * @param {Body[]} c The children to add
   */
  addChildren(c) {
    c.forEach((cc) => this.addChild(cc));
  }

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
   * @param {number} dt The time elapsed in millseconds.
   */
  update(dt) {
    const beingControlled = this.#controlPoints.find((cp) => cp === this.sim.draggingControlPoint);

    this.#constraints.forEach((c) => c.update(dt));
    this.#children.forEach((c) => c.update(dt, beingControlled));
    this.pos = this.getMainBody().pos;

    return true;
  }

  /**
   *
   * @param {ParticleSim} sim
   */
  register(sim) {
    this.#children.forEach((c) => {
      c.parent = this;
      c.register(sim);
    });

    if (this.isMiniature) {
      const scale = global.tutorialScaleFactor;
      this.#children
        .filter((c) => c instanceof ControlPoint)
        .forEach((cp) => {
          cp.setRad(cp.rad * scale);
          if (cp instanceof RotationControlPoint) {
            cp.distance = cp.distance * scale;
          }
        });
    }
  }

  /**
   *
   * @param {ParticleSim} sim
   */
  unregister(sim) {
    this.#children.forEach((c) => c.unregister(sim));
  }
}
