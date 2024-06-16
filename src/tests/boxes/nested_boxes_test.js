/**
 * @file Test dropping particles through box.
 */
class NestedBoxesTest extends Test {

  /**
   * Use macro sequence defined in this file.
   */
  constructor() {
    super('Nested Boxes Test', NestedBoxesTest._macro());
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
   * @param {GameScreen} screen The screen under test.
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
   * @returns {Macro} The player emulator script for this test.
   */
  static _macro() {

    const startPos = v(0.5, 0.9);

    // use minature box tool from BoxToolTutorial
    // override buildKeyframes()
    return new BoxToolTutorial(() => [

      [0, 'pos', startPos],
      [1, 'primaryTool'],

      // build first box
      [500, 'pos', v(0.5, 0.5)],
      [1000, 'down'],
      [1000, 'up'],
      [1000, 'defaultTool'],
      [1500, 'pos', v(0.5, 0.5)],

      [2000, 'pos', startPos],

      // double-click first box
      [3000, 'pos', v(0.5, 0.5)],
      [3200, 'down'],
      [3300, 'up'],
      [3400, 'down'],
      [3500, 'up'],
      [3600, 'pos', v(0.5, 0.5)],

      [4000, 'pos', startPos],
      [4500, 'pos', startPos],

      // build second box
      [4500, 'primaryTool'],
      [5000, 'pos', v(0.5, 0.5)],
      [5000, 'down'],
      [5200, 'up'],
      [5200, 'defaultTool'],
      [6000, 'pos', startPos],

      [7000, 'pos', startPos],
    ]);
  }
}
