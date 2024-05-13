class SkillCardTest extends Test {

  constructor(skill) {
    super();
    this.skill = skill;
  }

  getDuration() {
    return Math.max(5000, this.getTestAssertions().at(-1)[0]);
  }

  buildScreen() {
    const sim = this.skill.buildThumbnailSim();
    const gui = null;
    const tut = null;
    return new GameScreen(sim.rect, sim, gui, tut);
  }
}
