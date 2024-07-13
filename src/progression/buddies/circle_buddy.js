
/**
 * @file CircleBuddy object type.
 * controlled circle body
 * eats particles and contributes to player currency
 */
class CircleBuddy extends Buddy {
  expMechLabel = 'consumer';
  expMechIcon = hungerIcon;

  #maxSatiety;
  #maxSatietyCurve = ValueCurve.power(5, 2);
  #satiety;

  /**
   * Passive loss in satiety per millisecond, at max satiety.
   * @type {number}
   */
  #satietyDecay;
  #satietyDecayCurve = ValueCurve.power(5e-3, 1.5);

  /**
   *
   * @param {ParticleSim} sim
   * @param {Vector} pos
   * @param {number} rad
   */
  constructor(sim, pos, rad) {
    super(sim, pos);

    this.#maxSatiety = this.#maxSatietyCurve.f(this.expLevel);
    this.#satietyDecay = this.#satietyDecayCurve.f(this.expLevel);
    this.#satiety = this.#maxSatiety;

    this.circle = new CircleBody(sim, pos, rad);
    const cp = new ControlPoint(sim, this.circle);
    cp.visible = true;
    cp.setRad(rad);
    this.controlPoint = cp;

    this.setChildren([this.circle, cp]);
    this.controlPoints = [cp];
  }

  /**
   * Used to build tooltip for exp level indicator.
   * @abstract
   * @returns {string} The readable explaination of the bonuses
   *                      imparted by this buddy's exp level
   */
  describeCurrentExpLevel() {
    const rps = Math.floor(this.#satietyDecay * 1000);
    const n = Math.floor(this.getExpDeficit());

    return [
      `collects ${rps} rain / sec`,
      `${n} more to level up`,
    ].join('\n');
  }

  /**
   * Called in constructor.
   * Determines experience needed to advance through exp levels.
   * @returns {object} The ValueCurve instance.
   */
  getExpLevelCostCurve() {
    return ValueCurve.power(100, 2);
  }

  /**
   * Extend buddy exp gain mechanic, adding restoring satiety.
   * @param {number} amt The amount of experience to gain.
   */
  gainExp(amt) {
    super.gainExp(amt);

    // increase satiety
    this.#satiety = Math.min(
      this.#satiety + amt, this.#maxSatiety);
  }

  /**
   * Extend buddy level up mechanic, adding increasing appetite.
   */
  leveledUp() {
    super.leveledUp();
    this.#maxSatiety = this.#maxSatietyCurve.f(this.expLevel);
    this.#satietyDecay = this.#satietyDecayCurve.f(this.expLevel);
  }

  /**
   * Extend standard update, adding management of hunger and eating.
   * @param {number} dt The time elapsed in millseconds.
   */
  update(dt) {

    // decrease satiety
    const s = this.#satiety;
    this.#satiety = Math.max(
      s - dt * this.#satietyDecay * (s / this.#maxSatiety), 0);

    // attempt to stay near max satiety
    // by eating edge particles (edge_particle_subgroup.js)
    const hunger = this.#maxSatiety - this.#satiety;
    this.getMainBody().eatsQueued = Math.floor(hunger);

    // perform standard update
    return super.update(dt);
  }

  /**
   * Extend BuddyContextMenu with satiety indicator.
   * @param {number[]} rect The bounding rectangle containing the menu.
   */
  buildContextMenu(rect) {
    return new CircleBuddyContextMenu(rect, this);
  }

  /**
   * Called in circle_buddy_context_menu.js.
   * @param  {number[]} r The rectangle to align elements in.
   * @param  {number} s The font size.
   * @returns {GuiElement[]} Satiety indicator elements.
   */
  buildSatietyGuiElems(r, s) {
    return [
      new DynamicTextLabel(r, () => this._satLabel())
        .withScale(s)
        .withAutoAdjustRect(false)
        .withDynamicTooltip(() => this._satTooltip()),
      new ProgressIndicator(r, () => this.#satiety / this.#maxSatiety),
    ];
  }

  /**
   * Get one-word description of satiety state e.g. 'hungry'.
   * @returns {string} The one-word description.
   */
  _satLabel() {
    const s = this.#satiety / this.#maxSatiety;
    if (s < 0.25) { return 'starving'; }
    if (s < 0.5) { return 'hungry'; }
    if (s < 0.75) { return 'peckish'; }
    return 'full';
  }

  /**
   * Get report of satiety as readable integers.
   * @returns {string} The report.
   */
  _satTooltip() {
    const sat = this.#satiety.toFixed(0);
    const max = this.#maxSatiety.toFixed(0);
    return `${sat}/${max} satiety`;
  }

  /**
   *
   */
  getMainBody() { return this.circle; }
}
