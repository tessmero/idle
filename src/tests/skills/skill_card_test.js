/**
 * @file Base class for testing skill cards' thumbnail sims.
 */
class SkillCardTest extends Test {

  /**
   *
   * @param titleKey
   * @param skill
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
