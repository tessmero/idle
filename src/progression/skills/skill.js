// a purchasable skill that appears in the upgrades/skills menu
const _allSkillThumbnailSims = {};
class Skill {

  constructor(name) {
    this.name = name;
  }

  // called in gui/upgrade_menu/skill_tab.js
  getThumbnailSim() {
    const clazz = this.constructor;
    if (!(clazz in _allSkillThumbnailSims)) {
      _allSkillThumbnailSims[clazz] = this.buildThumbnailSim(...global.thumbnailSimDims);
    }
    return _allSkillThumbnailSims[clazz];
  }

  // should only be called in getThumbnailSim() ^
  buildThumbnailSim() {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }
}
