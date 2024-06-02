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
   * @param {string} titleKey readable and unique title.
   * @param {Macro} [macro] optional cursor animation sequence.
   */
  constructor(titleKey, macro = null) {
    this.#titleKey = titleKey;
    this.macro = macro;
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
    return GameStateManager.blankGsm();
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
   * Get GameScreen instance to run this test.
   * $returns {GameScreen}
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
   *
   * @param screen
   */
  getDuration(screen) {
    const ta = this.getTestAssertions(screen);
    if (ta.length === 0) {
      return 5000;
    }
    return 100 + ta.at(-1)[0]; // time of last assertion
  }

  /**
   *
   * @param _screen
   */
  getTestAssertions(_screen) {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }

  /**
   * Called in tests to form the subject of a test assertion.
   *
   * Asserts that the screen has exactly one top-level
   * body that is an instance of the given class.
   * @param  {GameScreen} screen The screen to search in.
   * @param  {object} clazz The Body subclass to find.
   * @returns {Body} The instance that exists in screen.
   */
  static getSingleBody(screen, clazz) {
    const bods = screen.sim.bodies;
    const matches = bods.filter((b) => b instanceof clazz);
    console.assert(matches.length === 1);
    return matches[0];
  }

  /**
   * Reset box internal sims between tests.
   * @param screen
   */
  static resetBoxSims(screen) {
    const abis = _allBoxInternalScreens;
    if (abis.has(screen)) {
      abis.get(screen).forEach((inner) => { inner.sim.reset(); });
    }
  }

  /**
   *
   * @param a
   * @param b
   */
  static anglesEqual(a, b) {
    const diff = Math.abs(cleanAngle(a - b));
    return diff < 1e-2; // radians
  }

  /**
   *
   * @param a
   * @param b
   * @param epsilon
   */
  static vectorsEqual(a, b, epsilon = 1e-2) {
    const d = a.sub(b);
    return d.getMagnitude() < epsilon;
  }

  /**
   * get relative position
   * @param sim
   * @param actualPos
   * @returns {Vector} e.g. v(.5,.5) is center of sim
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
   * @param sim
   * @param relPos
   * @returns {Vector} position in screen coordinates.
   */
  static simPos(sim, relPos) {
    const r = sim.rect;
    return v(
      r[0] + r[2] * relPos.x,
      r[1] + r[3] * relPos.y
    );
  }
}
