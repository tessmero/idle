/**
 * @file Test for start menu -> playing transition sequence
 */
class TransitionTest extends Test {

  /**
   *
   */
  constructor() {
    super('Transition Test');
  }

  /**
   * @returns {GameStateManager} with only start transition
   */
  getGameStateManager() {
    const gsm = new GameStateManager();
    gsm.rebuildGuis = (screen) => {
      gsm.gameState = GameStates.startTransition;
      gsm.gameScreen = screen;
      const sr = screen.rect;
      gsm.allGuis = [
        null,
        new StartTransitionGui(sr),
        null,
        null,
        null,
      ];

      // mock Hud Gui implementation
      // with only upgrade menu button
      const gui = gsm.allGuis[gsm.gameState];
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

    // start watching some points on the screen
    const watcher = new PointWatcherGW(screen.sim.rect);
    screen.graphicsWrapper = watcher;
    this.watcher = watcher;

    return screen;
  }

  /**
   *
   *
   * @param {GameScreen} screen - The simulation object containing the state and methods for the test.
   * @returns {Array.<Array>} An array of assertions, where each assertion is an array consisting of:
   *  - {number} time - The time in milliseconds at which the assertion is evaluated.
   *  - {string} description - A description of the expected state at the given time.
   *  - {Function} condition - A function that returns a boolean indicating if the condition is met.
   */
  getTestAssertions(screen) {
    const w = screen.graphicsWrapper;
    return [
      [100, 'mostly uncovered', () => w.getFgRate() < 0.50],

      [1500, '90% covered', () => w.getFgRate() > 0.90],

      [3000, '90% covered', () => w.getFgRate() > 0.90],

      [6000, 'mostly uncovered', () => w.getFgRate() < 0.50],
    ];
  }
}
