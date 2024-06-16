/**
 * @file Base class for testing skill cards' thumbnail sims.
 */
class SkillCardTest extends Test {

  /**
   *
   * @param {string} titleKey The readable unique title for this test.
   * @param {object} skill The Skill instance who's thumbnail screen will be tested.
   */
  constructor(titleKey, skill) {
    super(titleKey);
    this.skill = skill;
  }

  /**
   *
   */
  buildSim() {
    return this.skill.buildThumbnailSim();
  }
}
