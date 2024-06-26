/**
 * @file Test sliding particles down a line
 * that intersects with a box.
 */
class LineThruBoxTest extends Test {
  title = 'Line Thru Box Test';
  macro = LineThruBoxTest._macro();

  /**
   *
   */
  buildScreen() {
    const screen = super.buildScreen();
    screen.prebuiltBoxScreen = BoxBuddy.buildInnerScreen(screen);
    return screen;
  }

  /**
   * sim starts with
   * emitter at top left
   * line below emitter
   */
  buildSim() {
    const sim = new BoxTestPSim();

    // lower friction for physics particles
    // sim.fallSpeed = 1e20;

    sim.__r = sim.reset;
    sim.reset = () => {
      sim.__r();

      sim.addBody(new Emitter(sim,
        Test.simPos(sim, v(0.1, 0.1))
      ));

      sim.addBody(new SausageBody(sim,
        Test.simPos(sim, v(0.0, 0.1)),
        Test.simPos(sim, v(0.5, 0.7)),
        1e-2
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
    const ins = () => {
      const box = Test.getSingleBody(screen, BoxBuddy);
      return box.innerScreen.sim;
    };

    return [

      // 1000 place box
      [1100, 'box is empty', () => ins().physicsGroup.countActiveParticles() === 0],
      [1100, 'one floater', () => sim.floaters.activeCount === 1],

      // 2000-6000 catching at end of line
      [6000, 'particles collected', () => sim.particlesCollected > 0],
      [6000, 'floaters visible', () => sim.floaters.activeCount > 0],

      // 7000-10000 move box down
      // 16000-17000 catching below box
      [17000, 'particles collected', () => sim.particlesCollected > 0],
      [17000, 'floaters visible', () => sim.floaters.activeCount > 0],
      [17000, 'particles in box', () => ins().physicsGroup.countActiveParticles() > 0],

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
      [1, 'tool', BoxTool],

      // place box at center
      [500, 'pos', v(0.5, 0.5)],
      [1000, 'down'],
      [1000, 'up'],
      [1000, 'tool', DefaultTool],
      [1500, 'pos', v(0.5, 0.5)],

      // expect to catch particles
      // at end of line
      [2000, 'pos', v(0.55, 0.75)],
      [2000, 'down'],
      [6000, 'up'],
      [6000, 'pos', v(0.55, 0.75)],

      // move box down
      [7000, 'pos', v(0.5, 0.5)],
      [7000, 'down'],
      [9000, 'pos', v(0.5, 0.7)],
      [10000, 'pos', v(0.5, 0.7)],
      [10000, 'up'],

      // wait, then expect to catch particles
      // below box
      [11000, 'pos', v(0.6, 0.9)],
      [16000, 'down'],
      [17000, 'up'],
      [17500, 'pos', v(0.6, 0.9)],

      // double-click box
      [18000, 'pos', v(0.5, 0.7)],
      [18100, 'down'],
      [18200, 'up'],
      [18300, 'down'],
      [18400, 'up'],
      [18500, 'pos', v(0.5, 0.7)],

    ]);
  }

  /**
   *
   */
  getDuration() { return 20000; }
}
