/**
 * @file Test transfering a body into a black box inner sim.
 */
class CircleIntoBoxTest extends Test {

  /**
   * Use macro sequence defined in this file.
   */
  constructor() {
    super('Circle Into Box Test', CircleIntoBoxTest._macro());
  }

  /**
   * use test sim with no particles
   */
  buildSim() {
    return new BoxTestPSim();
  }

  /**
   *
   */
  buildScreen() {
    const screen = super.buildScreen();
    screen.prebuiltBoxScreen = BoxBuddy.buildInnerScreen(screen);
    return screen;
  }

  /**
   *
   * @param {GameScreen} screen The screen under test.
   */
  getTestAssertions(screen) {
    const sim = screen.sim;
    const ins = () => {
      const box = Test.getSingleBody(screen, BoxBuddy);
      return box.innerScreen;
    };

    return [

      // 1000 place box
      [1200, 'one body', () => sim.bodies.length === 1],

      // 2600 place circle
      [3000, 'two bodies', () => sim.bodies.length === 2],
      [3000, 'box is empty', () => ins().sim.bodies.length === 0],
      [3000, 'circle next to box', () => Test.getSingleBody(screen, CircleBuddy)],

      // 6000 insert circle into box
      [6500, 'circle in box', () => Test.getSingleBody(ins(), CircleBuddy)],

    ];
  }

  /**
   * Called in constructor.
   * @returns {Macro} The player emulator script for this test.
   */
  static _macro() {

    const start = v(0.5, 0.9);
    const box = v(0.5, 0.5);
    const circle = v(0.8, 0.5);

    // use minature box tool from BoxToolTutorial
    // override buildKeyframes()
    return new BoxToolTutorial(() => [
      [0, 'pos', start],
      [1, 'tool', BoxTool],

      // place box at center
      [500, 'pos', box],
      [600, 'down'],
      [700, 'up'],
      [800, 'pos', box],

      // [1500, 'pos', start],
      // [1500, 'pos', start],

      // place circle on right
      [2000, 'pos', start],
      [2000, 'tool', CircleTool],
      [2500, 'pos', circle],
      [2600, 'down'],
      [2700, 'up'],
      [2800, 'pos', circle],
      [2800, 'tool', DefaultTool],

      // [3200, 'pos', start],

      // drag circle to box
      [3500, 'pos', circle],
      [3500, 'down'],
      [4000, 'pos', box],
      [6000, 'up'],
      [6000, 'pos', box],
      [6500, 'pos', start],

      // double-click box
      [6800, 'pos', start],
      [7300, 'pos', box],
      [7400, 'down'],
      [7500, 'up'],
      [7600, 'down'],
      [7700, 'up'],
      [7800, 'pos', box],

    ]);
  }

  /**
   *
   */
  getDuration() { return 10000; }
}
