/**
 * @file Test dropping particles through box.
 */
class DropThroughBoxTest extends Test {

  /**
   *
   */
  constructor() {
    super('Drop Through Box Test', new DropThroughBoxMacro());
  }

  /**
   *
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
    const sim = () => screen.sim;
    const flt = () => screen.sim.floaters;
    const ins = () => screen.sim.bodies[0].innerScreen.sim.physicsGroup;

    return [

      // 1000 place box
      [1100, 'box is empty', () => ins().countActiveParticles() === 0],

      // 2000-5000 first hold
      [5000, 'particles in box', () => ins().countActiveParticles() > 0],
      [5000, 'no particles collected', () => sim().particlesCollected === 0],
      [5000, 'no floaters', () => flt().activeCount === 0],

      // 8000-9000 second hold
      [9000, 'particles collected', () => sim().particlesCollected > 0],
      [9000, 'floaters visible', () => flt().activeCount > 0],
      [10000, 'box is empty', () => ins().countActiveParticles() === 0],

    ];
  }
}
