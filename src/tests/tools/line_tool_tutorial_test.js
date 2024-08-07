/**
 * @file Test for line tool.
 */
class LineToolTutorialTest extends Test {
  title = 'Line Test';
  macro = new LineToolTutorial();

  /**
   *
   * @param {GameScreen} screen The screen under test.
   */
  getTestAssertions(screen) {
    const b = () => Test.getSingleBody(screen, ControlledSausageBody).getMainBody();
    const sim = screen.sim;
    const flt = () => sim.floaters;
    const bods = () => sim.bodies;

    return [
      // time, label, test function
      [0, 'no bodies', () => bods().length === 0],
      [900, 'one body', () => bods().length === 1],
      [900, 'one floater', () => flt().activeCount === 1],
      [1300, 'angle = 45°', () => Test.anglesEqual(pio4, b().angle)],
      [2400, 'no floaters', () => flt().activeCount === 0],
      [2400, 'active edge particles', () => sim.edgeGroup.countActiveParticles() > 0],
      [3800, 'angle changed', () => !Test.anglesEqual(pio4, b().angle)],
      [4200, 'position unchanged', () => {
        const lineCenter = Test.relPos(sim, b().pos);
        return Test.vectorsEqual(v(0.5, 0.5), lineCenter);
      }],
      [4200, 'active physics particles', () => sim.physicsGroup.countActiveParticles() > 0],
    ];
  }
}
