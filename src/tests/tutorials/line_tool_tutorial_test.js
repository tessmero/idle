/**
 *
 */
class LineToolTutorialTest extends Test {

  /**
   *
   */
  constructor() {
    super('Line Test', new LineToolTutorial());
  }

  /**
   *
   * @param screen
   */
  getTestAssertions(screen) {
    const sim = screen.sim;

    /**
     *
     */
    function b() {
      return sim.getBodies()[0].getMainBody();
    }

    return [
      // time, label, test function
      [0, 'no bodies', () => sim.getBodies().length === 0],
      [900, 'one body', () => sim.getBodies().length === 1],
      [900, 'one floater', () => sim.floaters.activeCount === 1],
      [1300, 'angle = -135°', () => Test.anglesEqual(-3 * pi / 4, b().angle)],
      [2400, 'no floaters', () => sim.floaters.activeCount === 0],
      [2800, 'angle changed', () => !Test.anglesEqual(-3 * pi / 4, b().angle)],
      [3200, 'position unchanged', () => Test.vectorsEqual(v(0.5, 0.5), Test.relPos(sim, b().pos))],
    ];
  }
}
