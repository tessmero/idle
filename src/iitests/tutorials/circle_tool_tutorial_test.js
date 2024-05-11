class CircleToolTutorialTest extends TutorialTest {

  constructor() {
    super(new CircleToolTutorial());
  }

  getTestAssertions(sim) {

    function b() {
      return sim.getBodies()[0].getMainBody();
    }

    return [
      // time, label, func
      [0, 'no bodies', () => sim.getBodies().length === 0],
      [1200, 'one body', () => sim.getBodies().length === 1],
      [1600, 'floaters active', () => sim.floaters.activeCount > 0],
      [3000, 'particles collected', () => sim.particlesCollected > 0],
      [3400, 'position changed', () => !Test.vectorsEqual(v(0.5, 0.5), Test.relPos(sim, b().pos))],
    ];
  }
}
