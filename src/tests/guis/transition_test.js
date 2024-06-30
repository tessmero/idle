/**
 * @file Test for start menu -> playing transition sequence
 */
class TransitionTest extends Test {
  title = 'TransitionTest';
  macro = null;

  /**
   * @returns {GameStateManager} with only start transition
   */
  getGameStateManager() {
    const gsm = new GameStateManager();
    gsm.rebuildGuis = (screen) => {
      gsm._state = GameStates.startTransition;
      gsm._screen = screen;
      const sr = screen.rect;
      gsm._guis = [
        null,
        new StartTransitionGui(sr),
        null,
        null,
        null,
      ];
      const gui = gsm.currentGui;
      gui.isMain = false;
      screen.setGui(gui);
    };
    return gsm;
  }

  /**
   * Extend standard test screen by watching some points for test assertions.
   * @returns {GameScreen} Screen with graphicsWrapper property assigned.
   */
  buildScreen() {
    const screen = super.buildScreen();

    // watch some points across the whole screen
    const sr = screen.sim.rect;
    const screenWatcher = new PointWatcherGW(sr, 8, 8);
    this.screenWatcher = screenWatcher;

    // watch some points where the message should appear
    const [x, y, w, h] = sr;
    const rx = 0.2 * w;
    const ry = 0.015 * h;
    const mr = [x + w / 2 - rx, y + h / 2 - ry, rx * 2, ry * 2];
    const msgWatcher = new PointWatcherGW(mr, 25, 4);

    // helper to debug watcher
    msgWatcher._gfgr = msgWatcher.getFgRate;
    msgWatcher.getFgRate = () => {
      const result = msgWatcher._gfgr();

      // console.log(result);
      return result;
    };

    this.msgWatcher = msgWatcher;

    screen.graphicsWrappers = [msgWatcher, screenWatcher];
    return screen;
  }

  /**
   *
   *
   * @param {GameScreen} _screen - The screen under test.
   * @returns {Array.<Array>} An array of assertions, where each assertion is an array consisting of:
   *  - {number} time - The time in milliseconds at which the assertion is evaluated.
   *  - {string} description - A description of the expected state at the given time.
   *  - {Function} condition - A function that returns a boolean indicating if the condition is met.
   */
  getTestAssertions(_screen) {
    const scr = () => this.screenWatcher.getFgRate();
    const msg = () => this.msgWatcher.getFgRate();

    return [

      // 0-1000 fade out to dark screen
      [100, 'mostly uncovered', () => scr() < 0.50],
      [1100, '100% covered', () => scr() === 1],
      [1100, 'no message', () => msg() === 1],

      // 1500-1700 message materializes
      [1600, 'partial message', () => (msg() > 0.85) && (msg() < 1)],

      // 1700-3700 message readable
      [3500, 'message fully visible', () => msg() < 0.85],

      // 3700-4200 message dissolves
      [4000, 'partial message', () => (msg() > 0.85) && (msg() < 1)],

      // 4200-5200 dark fade in
      [4200, '100% covered', () => scr() === 1],
      [5300, 'mostly uncovered', () => scr() < 0.50],
    ];
  }
}
