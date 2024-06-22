/**
 * @file Test for black box tool.
 */
class BoxToolTutorialTest extends Test {

  /**
   *
   */
  constructor() {
    super('Box Tutorial Test', new BoxToolTutorial());
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
    const sqr = () => Test.getSingleBody(screen, BoxBuddy).getMainBody();
    const sim = screen.sim;
    const flt = () => screen.sim.floaters;
    const bods = () => screen.sim.bodies;

    return [
      // time, label, test function
      [0, 'no bodies', () => bods().length === 0],
      [500, 'one body', () => bods().length === 1],
      [500, 'one floater', () => flt().activeCount === 1],
      [500, 'angle = 0', () => Test.anglesEqual(0, sqr().angle)],

      // 1200-2500 rotate box
      [3000, 'no floaters', () => flt().activeCount === 0],
      [3000, 'no active edge particles', () => sim.edgeGroup.countActiveParticles() === 0],
      [3000, 'angle changed', () => !Test.anglesEqual(0, sqr().angle)],
      [3000, 'position unchanged', () => Test.vectorsEqual(v(0.5, 0.5), Test.relPos(sim, sqr().pos))],
    ];
  }
}
