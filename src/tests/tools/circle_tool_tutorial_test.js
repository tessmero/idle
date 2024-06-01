/**
 * @file Test for circle tool.
 */
class CircleToolTutorialTest extends Test {

  /**
   *
   */
  constructor() {
    super('Circle Test', new CircleToolTutorial());
  }

  /**
   *
   * @param screen
   */
  getTestAssertions(screen) {
    const sim = screen.sim;
    const b = () => Test.getSingleBody(screen, CircleBuddy).getMainBody();

    return [
      // time, label, func
      [0, 'no bodies', () => sim.bodies.length === 0],
      [1200, 'one body', () => sim.bodies.length === 1],
      [1600, 'floaters active', () => sim.floaters.activeCount > 0],
      [3000, 'particles collected', () => sim.particlesCollected > 0],
      [3000, 'floaters active', () => sim.floaters.activeCount > 0],
      [3400, 'position changed', () => !Test.vectorsEqual(v(0.5, 0.5), Test.relPos(sim, b().pos))],
    ];
  }
}
