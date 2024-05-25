const _allTestScreens = {};

/**
 * integration test for a simulation
 */
class Test {

  /**
   * @param {string} titleKey readable and unique title.
   * @param {Macro} [macro] optional cursor animation sequence.
   */
  constructor(titleKey, macro = null) {
    this.titleKey = titleKey;
    this.macro = macro;
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
      screen.sim.title = `(TEST INSTANCE) ${ screen.sim.title}`;
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
   * return value  v(.5,.5) means center of sim
   * @param sim
   * @param actualPos
   */
  static relPos(sim, actualPos) {
    const r = sim.rect;
    return v(
      (actualPos.x - r[0]) / r[2],
      (actualPos.y - r[1]) / r[3]
    );
  }
}
