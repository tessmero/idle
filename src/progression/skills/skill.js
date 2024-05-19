// a purchasable skill that appears in the upgrades/skills menu
const _allSkillThumbnailScreens = {};
class Skill {

  constructor(name) {
    this.name = name;
  }

  // called in gui/upgrade_menu/skill_tab.js
  getThumbnailScreen() {
    const clazz = this.constructor;
    if (!(clazz in _allSkillThumbnailScreens)) {
      _allSkillThumbnailScreens[clazz] = this.buildThumnailScreen();
    }
    return _allSkillThumbnailScreens[clazz];
  }

  buildThumnailScreen() {
    const sim = this.buildThumbnailSim();
    const gui = null;
    const tut = null;
    return new GameScreen(sim.rect, sim, gui, tut);
  }

  // should only be called in buildThumbnailScreen()
  buildThumbnailSim() {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }
}
