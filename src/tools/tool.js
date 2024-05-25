/**
 * a tool is an element in the toolbar
 * it determines the appearnace of the mouse cursor
 * and some interaction with a particle sim when clicking
 */
class Tool {

  /**
   *
   * @param sim
   */
  constructor(sim) {
    this.sim = sim;
  }

  /**
   *
   */
  mouseDown() { throw new Error('not implemented'); }

  /**
   *
   * @param _dt
   */
  update(_dt) {}

  /**
   *
   */
  mouseMove() {}

  /**
   *
   */
  mouseUp() {}

  /**
   * remove any grabbers submitted to sim
   * @param _sim
   */
  unregister(_sim) {}

  /**
   *
   */
  isUsable() {

    if (this.sim !== global.mainSim) { return true; }

    const cost = this.getCost();
    const budget = this.sim.particlesCollected;
    return budget >= cost;
  }

  // return number of raindrops
  /**
   *
   */
  getCost() {
    return 0;
  }

  /**
   * return Macro instance
   */
  getTutorial() {
    return null;
  }

  /**
   * draw overlay
   * @param _g
   */
  draw(_g) {
    // do nothing
  }

  /**
   *
   * @param g
   * @param p
   * @param scale
   * @param enableIdleAnim
   */
  drawCursor(g, p, scale = 1, enableIdleAnim = false) {

    // get static cursor pixel art layout
    // or get animated cursor if idle
    const layout = (enableIdleAnim && (global.idleCountdown <= 0)) ?
      this.icon.getCurrentAnimatedLayout() : this.icon.frames[0];

    g.fillStyle = global.colorScheme.fg;
    drawLayout(g, ...p, layout, this.cursorCenter, new FontSpec(0.005, scale, true));
    drawLayout(g, ...p, layout, this.cursorCenter, new FontSpec(0, scale, false));

  }

  /**
   *
   * @param g
   * @param rect
   */
  drawToolbarIcon(g, rect) {

    // get static cursor pixel art layout
    // or get animated cursor if idle
    const layout = (global.mainScreen.idleCountdown <= 0) ?
      this.icon.getCurrentAnimatedLayout() : this.icon.frames[0];

    drawLayout(g, ...rectCenter(...rect), layout);
  }
}
