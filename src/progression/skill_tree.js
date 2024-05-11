// progression tree for purchasable skills
//
// specify tree in constructor
//
// persistant instance global.skillTree
//   contains state of purchased skills for the current game

class SkillTree {

  constructor() {
    this.state = {

      'basic_rain': {
        skill: new BasicRainSkill(),
        pos: [0.5, 0.7], // position in gui
        status: 'purchased',
      },

      'fast_rain': {
        skill: new FastRainSkill(),
        requires: 'basic_rain',
        precludes: 'snow',
        pos: [0.3, 0.5],
        status: 'available',
      },

      'snow': {
        skill: new SnowSkill(),
        requires: 'basic_rain',
        precludes: 'fast_rain',
        pos: [0.7, 0.5],
        status: 'available',
      },

      'fast_rain2': {
        skill: new FastRain2Skill(),
        requires: 'fast_rain',
        pos: [0.3, 0.3],
        status: 'locked',
      },

      'snow2': {
        skill: new Snow2Skill(),
        requires: 'snow',
        pos: [0.7, 0.3],
        status: 'locked',
      },
    };
  }

  isAvalable(key) {
    s = this.specs[key];
    if (!s.requires) { return true; }
    return this.specs[s.requires].purchased;
  }
}
