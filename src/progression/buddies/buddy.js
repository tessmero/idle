/**
 * @file Buddy base class for privileged bodies
 * with their own progression state
 */
class Buddy extends CompoundBody {

  /**
   * Experience mechanic label,
   * explains how this buddy gains experience.
   * @abstract
   * @type {string}
   */
  expMechLabel;

  /**
   * Experience mechanic icon,
   * explains how this buddy gains experience.
   * @abstract
   * @type {Icon}
   */
  expMechIcon;

  #expPoints;
  #expPointsOffset;

  #expLevel = 1;
  #expLevelCostCurve;

  /**
   *
   * @param {ParticleSim} sim The simulation the buddy will live in.
   * @param {Vector} pos The position of the buddy in the simulation.
   */
  constructor(sim, pos) {
    super(sim, pos);

    // set initial experience value
    // account for cost curve y-intercept
    const lvlCost = this.getExpLevelCostCurve();
    const exp0 = lvlCost.f(0);

    this.#expLevelCostCurve = lvlCost;
    this.#expPointsOffset = exp0;
    this.#expPoints = exp0;
  }

  /**
   * Called in constructor.
   * Determines experience needed to advance through exp levels.
   * @abstract
   * @returns {object} The ValueCurve instance.
   */
  getExpLevelCostCurve() {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }

  /**
   * Used to build tooltip for exp level indicator.
   * @abstract
   * @returns {string} The readable explaination of the bonuses
   *                      imparted by this buddy's exp level
   */
  describeCurrentExpLevel() {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }

  /**
   * Buddy implementations should construct a BuddyContextMenu
   * and add some subclass-specific gui elements.
   * @abstract
   * @param {number[][]} _rects The rectangles to allign elements in.
   * @returns {GuiElement} The new context menu.
   */
  buildContextMenu(_rects) {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }

  /**
   * Called once for each exp level threshold passed.
   */
  leveledUp() {
    this.sim.floaters.spawnFloater(this.getMainBody().pos, 'LEVEL UP');
  }

  /**
   * Called when the buddy gains experience.
   * @param  {number} amt The amount of experience to gain.
   */
  gainExp(amt) {
    this.#expPoints = this.#expPoints + amt;
    this._checkLevelUp();
  }

  /**
   * Compute how many exp points must still be gained
   * to reach the next level.
   * @returns {number} The number of additional exp points needed.
   */
  getExpDeficit() {
    const lvl = this.#expLevel;
    const nextLevelCost = this.#expLevelCostCurve.f(lvl);
    return nextLevelCost - this.#expPoints;
  }

  /**
   * Called in gainExp.
   * Check exp and increment level as many times as necessary.
   */
  _checkLevelUp() {
    if (this.getExpDeficit() < 0) {
      this.#expLevel = this.#expLevel + 1;
      this.leveledUp();
      this._checkLevelUp();
    }
  }

  /**
   *
   */
  get expLevel() { return this.#expLevel; }

  /**
   * Get progress in range 0-1 to show in the exp bar.
   * @returns {number} The progress value to display.
   */
  getLevelProgress() {
    const lvl = this.#expLevel;
    const f = this.#expLevelCostCurve.f;
    const c0 = f(lvl - 1);
    const c1 = f(lvl);
    return (this.#expPoints - c0) / (c1 - c0);
  }
}
