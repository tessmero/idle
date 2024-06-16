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
   * @param {ParticleSim} sim
   * @param {Icon} icon
   * @param {string} tooltipText
   * @param {boolean} cursorCenter
   */
  constructor(sim, icon, tooltipText, cursorCenter) {
    this.#sim = sim;
    this.#icon = icon;
    this.#tooltipText = tooltipText;
    this.#cursorCenter = cursorCenter;
  }

  /**
   * Tool implementations should define a distinct mouse click behavior.
   * @abstract
   * @param {Vector} _p The position of the mouse.
   */
  mouseDown(_p) {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }

  /**
   * Prevent assigning sim with equals sign.
   */
  set sim(_s) { throw new Error('should use setSim'); }

  /**
   * called in particle_sim.js setTool()
   * @param {ParticleSim} sim
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
   * @param {number} _dt The time elapsed in millisecs.
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
   * @param {ParticleSim} _sim
   */
  unregister(_sim) {}

  /**
   * @returns {boolean} True if the player can afford to use this tool.
   */
  isUsable() {
    if (!global.mainScreen) { return false; }
    if (this.sim !== global.mainScreen.sim) { return true; }

    const cost = this.getCost();
    const budget = this.sim.particlesCollected;
    return budget >= cost;
  }

  /**
   * @returns {number} The cost to use this tool.
   */
  getCost() {
    return 0;
  }

  /**
   * @returns {?Macro} The tutorial associated with this tool.
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
   * Draw mouse cursor for this tool.
   * @param {object} g The graphics context.
   * @param {Vector} p The positiont to draw at.
   * @param {number} scale The optional size scale factor.
   * @param {boolean} enableIdleAnim True if the icon should be animated.
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
