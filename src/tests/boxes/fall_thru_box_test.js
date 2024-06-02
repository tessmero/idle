/**
 * @file Test dropping particles through box.
 */
class FallThruBoxTest extends Test {

  /**
   * Use macro sequence defined in this file.
   */
  constructor() {
    super('Fall Thru Box Test', FallThruBoxTest._macro());
  }

  /**
   * Test sim has emitter at the top
   */
  buildSim() {
    const sim = new BoxTestPSim();

    sim.__r = sim.reset;
    sim.reset = () => {
      sim.__r();

      sim.addBody(new Emitter(sim,
        Test.simPos(sim, v(0.5, 0.05))
      ));

    };

    return sim;
  }

  /**
   *
   * @param screen
   */
  getTestAssertions(screen) {
    const sim = screen.sim;
    const ins = () => Test.getSingleBody(screen, BoxBuddy)
      .innerScreen.sim.physicsGroup;

    return [

      // 1000 place box
      [1100, 'box is empty', () => ins().countActiveParticles() === 0],

      // 2000-5000 first hold
      [5000, 'particles in box', () => ins().countActiveParticles() > 0],
      [5000, 'no particles collected', () => sim.particlesCollected === 0],
      [5000, 'no floaters', () => sim.floaters.activeCount === 0],

      // 8000-9000 second hold
      [9000, 'particles collected', () => sim.particlesCollected > 0],
      [9000, 'floaters visible', () => sim.floaters.activeCount > 0],

    ];
  }

  /**
   * Called in constructor.
   */
  static _macro() {

    const startPos = v(0.5, 0.9);

    // use minature box tool from BoxToolTutorial
    // override buildKeyFrames()
    return new BoxToolTutorial(() => [
      [0, 'pos', startPos],
      [1, 'primaryTool'],

      // place box at center
      [500, 'pos', v(0.5, 0.5)],
      [1000, 'down'],
      [1000, 'up'],
      [1000, 'defaultTool'],
      [1500, 'pos', v(0.5, 0.5)],

      [2000, 'pos', startPos],

      // expect to catch nothing
      [2000, 'down'],
      [5000, 'up'],

      // expect to catch particles
      [8000, 'down'],
      [9000, 'up'],

      [10000, 'pos', startPos],

    ]);
  }
}
