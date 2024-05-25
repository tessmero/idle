// a purchasable skill that appears in the upgrades/skills menu
const _allSkillThumbnailScreens = {};

/**
 *
 */
class Skill {

  /**
   *
   * @param name
   */
  constructor(name) {
    this.name = name;
  }

  // called in gui/upgrade_menu/skill_tab.js
  /**
   *
   */
  getThumbnailScreen() {
    const clazz = this.constructor;
    if (!(clazz in _allSkillThumbnailScreens)) {
      _allSkillThumbnailScreens[clazz] = this._buildThumnailScreen();
    }
    return _allSkillThumbnailScreens[clazz];
  }

  /**
   *
   */
  _buildThumnailScreen() {
    const titleKey = `${this.name} skill card`;
    const sim = this.buildThumbnailSim();
    const gsm = GameStateManager.blankGsm();
    const tut = null;
    return new GameScreen(titleKey, sim.rect, sim, gsm, tut);
  }

  // should only be called in buildThumbnailScreen()
  /**
   *
   */
  buildThumbnailSim() {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }
}
