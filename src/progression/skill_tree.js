/**
 * @file SkillTree object type.
 *
 * progression tree for purchasable skills
 *
 * specify tree in constructor
 *
 * persistant instance global.skillTree
 *   contains state of purchased skills for the current game
 */
class SkillTree {

  /**
   *
   */
  constructor() {
    this.state = {

      'basic_rain': {
        skill: Skill.basicRain,
        pos: [0.5, 0.7], // position in gui
        status: 'purchased',
      },

      'fast_rain': {
        skill: Skill.fastRain,
        requires: 'basic_rain',
        precludes: 'snow',
        pos: [0.3, 0.5],
        status: 'available',
      },

      'snow': {
        skill: Skill.snow,
        requires: 'basic_rain',
        precludes: 'fast_rain',
        pos: [0.7, 0.5],
        status: 'available',
      },

      'fast_rain2': {
        skill: Skill.fastRain2,
        requires: 'fast_rain',
        pos: [0.3, 0.3],
        status: 'locked',
      },

      'snow2': {
        skill: Skill.snow2,
        requires: 'snow',
        pos: [0.7, 0.3],
        status: 'locked',
      },
    };
  }

  /**
   *
   * @param {string} key The key in this.state.
   */
  isAvalable(key) {
    s = this.specs[key];
    if (!s.requires) { return true; }
    return this.specs[s.requires].purchased;
  }
}
