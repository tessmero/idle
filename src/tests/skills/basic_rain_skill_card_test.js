/**
 * @file Test for skill card thumbnail sim.
 */
class BasicRainSkillCardTest extends SkillCardTest {

  /**
   *
   */
  constructor() {
    super('Basic Rain Skill Card Test', Skill.basicRain);
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
