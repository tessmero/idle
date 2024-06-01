/**
 * @file Tool base class.
 * a tool is an element in the toolbar
 * it determines the appearnace of the mouse cursor
 * and some interaction with a particle sim when clicking
 */
class Tool {

  #sim;
  #icon;
  #tooltipText;
  #cursorCenter;

  /**
   *
   * @param sim
   * @param icon
   * @param tooltipText
   * @param cursorCenter
   */
  constructor(sim, icon, tooltipText, cursorCenter) {
    this.#sim = sim;
    this.#icon = icon;
    this.#tooltipText = tooltipText;
    this.#cursorCenter = cursorCenter;
  }

  /**
   *
   */
  set sim(_s) { throw new Error('should use setSim'); }

  /**
   * called in particle_sim.js setTool()
   * @param sim
   */
  setSim(sim) {
    const prev = this.#sim;
    if (prev === sim) { return; }
    if (prev) { this.unregister(prev); }
    this.#sim = sim;
  }

  /**
   *
   */
  get sim() { return this.#sim; }

  /**
   *
   */
  get icon() { return this.#icon; }

  /**
   *
   */
  get tooltipText() { return this.#tooltipText; }

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
   * Return true if the player can afford to use this tool.
   */
  isUsable() {
    if (!global.mainScreen) { return false; }
    if (this.sim !== global.mainScreen.sim) { return true; }

    const cost = this.getCost();
    const budget = this.sim.particlesCollected;
    return budget >= cost;
  }

  /**
   * Get number of raindrops required to use this tool.
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
   * @param {object} _g The graphics context.
   */
  draw(_g) {
    // do nothing
  }

  /**
   *
   * @param {object} g The graphics context.
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
    drawLayout(g, ...p.xy(), layout, this.#cursorCenter, new FontSpec(0.005, scale, true));
    drawLayout(g, ...p.xy(), layout, this.#cursorCenter, new FontSpec(0, scale, false));

  }
}
