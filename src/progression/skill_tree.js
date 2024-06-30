/**
 * @file SkillTree object type.
 *
 * progression tree for purchasable skills
 *
 * persistant instance global.skillTree
 *   contains state of purchased skills for the current game
 */
class SkillTree {

  /**
   * Load initial state from src/data/skill_tree.js
   */
  constructor() {
    this.state = SKILL_TREE;
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
