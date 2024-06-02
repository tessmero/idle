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
   * @param screen
   */
  getTestAssertions(screen) {
    const sqr = () => Test.getSingleBody(screen, BoxBuddy).getMainBody();
    const sim = screen.sim;
    const flt = () => screen.sim.floaters;
    const bods = () => screen.sim.bodies;

    return [
      // time, label, test function
      [0, 'no bodies', () => bods().length === 0],
      [900, 'one body', () => bods().length === 1],
      [900, 'one floater', () => flt().activeCount === 1],
      [1300, 'angle = 0', () => Test.anglesEqual(0, sqr().angle)],
      [2400, 'no floaters', () => flt().activeCount === 0],
      [2400, 'no active edge particles', () => sim.edgeGroup.countActiveParticles() === 0],

      // 2400-3300 rotate box
      [4000, 'angle changed', () => !Test.anglesEqual(0, sqr().angle)],
      [4000, 'position unchanged', () => Test.vectorsEqual(v(0.5, 0.5), Test.relPos(sim, sqr().pos))],
      [4000, 'active physics particles', () => sim.physicsGroup.countActiveParticles() > 0],
    ];
  }
}
