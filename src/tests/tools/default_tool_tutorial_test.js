/**
 * @file Test for default tool.
 */
class DefaultToolTutorialTest extends Test {
  title = 'Default Tool Test';
  macro = new DefaultToolTutorial();

  /**
   *
   * @param {GameScreen} screen The screen under test.
   */
  getTestAssertions(screen) {
    const sim = screen.sim;
    return [
      // time, label, func
      [0, 'no particles collected', () => sim.particlesCollected === 0],
      [800, 'particles collected', () => sim.particlesCollected > 0],
      [1200, 'floaters visible', () => sim.floaters.activeCount > 0],
      [1600, 'no edge particles', () => sim.edgeGroup.countActiveParticles() === 0],
      [2000, 'no physics particles', () => sim.physicsGroup.countActiveParticles() === 0],
    ];
  }
}
