class BasicRainSkillCardTest extends SkillCardTest {

  constructor() {
    super(new BasicRainSkill());
  }

  getTitle() {
    return 'Basic Rain Skill Card';
  }

  getTestAssertions(sim) {
    return [
      // time, label, func
      [1000, 'one body', () => sim.getBodies().length === 1],
      [2000, 'active edge particles', () => sim.edgeGroup.countActiveParticles() > 0],
      [3000, 'active physics particles', () => sim.physicsGroup.countActiveParticles() > 0],
    ];
  }
}
