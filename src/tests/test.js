/**
 * @file Test base class and screen registry
 * Screens are constructed the first time each test subclass is executed
 * by the test context menu (/src/gui/sandbox-menus/tests)
 */
const _allTestScreens = {};

/**
 * Test base class.
 */
class Test {

  #titleKey;

  /**
   * @param {string} titleKey The readable and unique title.
   * @param {Macro} macro The optional cursor animation sequence.
   */
  constructor(titleKey, macro = null) {
    this.#titleKey = titleKey;
    this.macro = macro;
  }

  /**
   *
   * @param {GameScreen} _screen - The screen under test.
   * Should return {Array.<Array>} An array of assertions, where each assertion is an array consisting of:
   *  - {number} time - The time in milliseconds at which the assertion is evaluated.
   *  - {string} description - A description of the expected state at the given time.
   *  - {Function} condition - A function that returns a boolean indicating if the condition is met.
   */
  getTestAssertions(_screen) {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }

  /**
   *
   */
  set titleKey(_tk) {
    throw new Error('not allowed');
  }

  /**
   *
   */
  get titleKey() {
    return this.#titleKey;
  }

  /**
   * @returns {GameStateManager} new mock instance with no GUIs.
   */
  getGameStateManager() {
    return new BlankGSM();
  }

  /**
   * build default sim (small tutorial particle sim).
   * @returns {ParticleSim} sim instance to run this test.
   */
  buildSim() {
    return new TutorialPSim();
  }

  /**
   * Screen cannot be reassigned.
   */
  set screen(_s) {
    throw new Error('not allowed');
  }

  /**
   * @returns {GameScreen} The screen to run this test.
   */
  get screen() {
    const clazz = this.constructor;
    if (!(clazz in _allTestScreens)) {
      const screen = this.buildScreen();
      _allTestScreens[clazz] = screen;
    }
    return _allTestScreens[clazz];
  }

  /**
   * Allocate new GameScreen, at most once per test subclass.
   * @returns {GameScreen} The newly constructed screen.
   */
  buildScreen() {
    const sim = this.buildSim();
    const gsm = this.getGameStateManager();
    const macro = this.macro;
    const titleKey = this.titleKey;
    const screen = new GameScreen(titleKey, sim.rect, sim, gsm, macro);
    return screen;
  }

  /**
   * Compute the time needed to run this test.
   * @param {GameScreen} screen The screen under test.
   * @returns {number} The duration in milliseconds.
   */
  getDuration(screen) {
    const ta = this.getTestAssertions(screen);
    if (ta.length === 0) {
      return 5000;
    }
    return 100 + ta.at(-1)[0]; // time of last assertion
  }

  /**
   * Called in tests to form the subject of a test assertion.
   *
   * Asserts that the screen has exactly one top-level
   * body that fits the given criteria/class.
   * @param  {GameScreen} screen The screen to search in.
   * @param  {object} crit The body->boolean function or Body subclass to use as criteria.
   * @returns {Body} The matching instance that exists in screen.
   */
  static getSingleBody(screen, crit) {
    const f = (crit.prototype instanceof Body) ?
      ((b) => b instanceof crit) : ((b) => crit(b));
    const matches = screen.sim.bodies.filter(f);
    console.assert(matches.length === 1);
    return matches[0];
  }

  /**
   * Reset box internal sims between tests.
   * @param {GameScreen} screen The screen who's boxes should be reset.
   */
  static resetBoxSims(screen) {
    const abis = _allBoxScreenRels;
    if (abis.has(screen)) {
      abis.get(screen).forEach((inner) => { inner.sim.reset(); });
    }
  }

  /**
   * Check if two angles are nearly equivalent.
   * @param {number} a The first angle.
   * @param {number} b The second angle.
   * @param {number} epsilon
   */
  static anglesEqual(a, b, epsilon = 1e-2) {
    const diff = Math.abs(cleanAngle(a - b));
    return diff < epsilon;
  }

  /**
   * Check if two vectors are nearly equal.
   * @param {Vector} a The first vector.
   * @param {Vector} b The second vector.
   * @param {number} epsilon
   */
  static vectorsEqual(a, b, epsilon = 1e-2) {
    const d = a.sub(b);
    return d.getMagnitude() < epsilon;
  }

  /**
   * Compute relative position, e.g. a return value of v(.5,.5)
   * indicates that the given point is in the center of the given sim.
   * @param {ParticleSim} sim The simulation in question.
   * @param {Vector} actualPos The position in sim's coordinates.
   * @returns {Vector} the relative postiion
   */
  static relPos(sim, actualPos) {
    const r = sim.rect;
    return v(
      (actualPos.x - r[0]) / r[2],
      (actualPos.y - r[1]) / r[3]
    );
  }

  /**
   * Convert relative position to coordinates of sim.
   * relative position of v(.5,.5) indicates the center of the sim
   * @param {ParticleSim} sim
   * @param {Vector} relPos The relative position.
   * @returns {Vector} The position in sim's coordinates.
   */
  static simPos(sim, relPos) {
    const r = sim.rect;
    return v(
      r[0] + r[2] * relPos.x,
      r[1] + r[3] * relPos.y
    );
  }
}
