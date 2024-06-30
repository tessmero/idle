/**
 * @file Test for skill card thumbnail sim.
 */
class BasicRainSkillCardTest extends Test {
  title = 'Basic Rain Skill Card Test';
  macro = null;

  #skill = Skill.basicRain;

  /**
   * Use same simulation as thumbnail in skills menu.
   * @returns {ParticleSim} The simulation to use for this test.
   */
  buildSim() {
    return this.#skill.buildThumbnailSim();
  }

  /**
   *
   * @param {GameScreen} screen The screen under test.
   */
  getTestAssertions(screen) {
    const sim = screen.sim;
    return [
      // time, label, func
      [1000, 'one body', () => sim.bodies.length === 1],
      [2000, 'active edge particles', () => sim.edgeGroup.countActiveParticles() > 0],
      [3000, 'active physics particles', () => sim.physicsGroup.countActiveParticles() > 0],
    ];
  }
}
