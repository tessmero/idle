/**
 * @file Tool base class.
 * a tool is an element in the toolbar
 * it determines the appearnace of the mouse cursor
 * and some interaction with a particle sim when clicking
 */
class Tool {
  #screen;

  /**
   * @abstract
   * @type {Icon}
   */
  _icon;

  /**
   * @abstract
   * @type {string}
   */
  _tooltipText;

  /**
   * @abstract
   * @type {boolean}
   */
  _cursorCenter;

  /**
   *
   * @param {GameScreen} screen
   */
  constructor(screen) {
    this.setScreen(screen);
  }

  /**
   * called in particle_sim.js setTool()
   * @param {GameScreen} screen
   */
  setScreen(screen) {
    if (!screen) {
      return;
    }
    if (!(screen instanceof GameScreen)) {
      throw new Error('must be GameScreen isntance');
    }
    const sim = screen.sim;
    if (this.#screen) {
      const prev = this.#screen.sim;
      if (prev === sim) { return; }
      if (prev) { this.unregister(prev); }
    }
    this.#screen = screen;
  }

  /**
   *
   */
  get iconScale() {
    const s = this.screen;
    return s ? s.iconScale : 1;
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
  set sim(_s) { throw new Error('should use setScreen'); }

  /**
   * Prevent assigning screen with equals sign.
   */
  set screen(_s) { throw new Error('should use setScreen'); }

  /**
   *
   * @param {object} _s
   */
  setSim(_s) { throw new Error('should use setScreen'); }

  /**
   *
   */
  get sim() { return this.#screen.sim; }

  /**
   *
   */
  get screen() { return this.#screen; }

  /**
   *
   */
  get icon() { return this._icon; }

  /**
   *
   */
  get tooltipText() { return this._tooltipText; }

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
   * @param {Icon} icon Optional override the icon to draw.
   * @param {boolean} enableIdleAnim True if the icon may be animated when idle.
   * @param {boolean} forceAnim True if the icon should always be animated.
   */
  drawCursor(g, p, icon = null, enableIdleAnim = false, forceAnim = false) {
    const icn = icon ? icon : this._icon;
    const scale = this.iconScale;

    // get static cursor pixel art layout
    // or get animated cursor if idle
    const anim = forceAnim || (enableIdleAnim && (global.idleCountdown <= 0));
    const layout = anim ? icn.getCurrentAnimatedLayout() : icn.frames[0];

    g.fillStyle = global.colorScheme.fg;
    drawLayout(g, ...p.xy(), layout, this._cursorCenter, new FontSpec(0.005, scale, true));
    drawLayout(g, ...p.xy(), layout, this._cursorCenter, new FontSpec(0, scale, false));

  }
}
