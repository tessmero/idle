
/**
 * @file BodyTool abstract base class
 * for tools that spawn bodies.
 */
class BodyTool extends Tool {

  /**
   * Called when this tool is used.
   * Create a new body at the given position.
   * @abstract
   * @param _p The position for the new body.
   * @returns {Body} The new Body instance.
   */
  buildBody(_p) {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }

  /**
   *
   * @param p
   */
  mouseDown(p) {
    if (this.isUsable()) {

      // pay
      const cost = this.getCost();
      const sim = this.sim;
      if (sim.usesGlobalCurrency) {
        global.particlesCollected = global.particlesCollected - cost;
      }
      sim.floaters.signalChange(p, -cost);

      // add body
      const poi = this.buildBody(p);
      sim.addBody(poi);

      // switch back to default tool
      sim.setTool(sim.toolList[0]);

    }
  }

  /**
   *
   * @param _p
   */
  mouseMove(_p) {}

  /**
   *
   * @param _p
   */
  mouseUp(_p) {}
}
