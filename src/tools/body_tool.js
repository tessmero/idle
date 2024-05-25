
/**
 * base class for tools that spawn bodies
 */
class BodyTool extends Tool {

  /**
   *
   * @param {ParticleSim} sim
   * @param {string} title
   * @param {Icon} icon
   */
  constructor(sim, title, icon) {
    super(sim);

    this.title = title;
    this.icon = icon;
    this.tooltip = `build ${title}`;
    this.cursorCenter = true; // tool.js
  }

  /**
   * get title of body to build e.g. 'circle'
   */
  getTitle() {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }

  /**
   * create Body instance at point p
   * @param _p
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
      const s = this.sim;
      if (s === global.mainSim) {
        s.particlesCollected = s.particlesCollected - cost;
      }
      this.sim.floaters.signalChange(p, -cost);

      // add body
      const poi = this.buildBody(p);
      this.sim.addBody(poi);

      //
      if (this.sim === global.mainSim) {
        global.mainSim.setTool(global.toolList[0]);
      }
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
