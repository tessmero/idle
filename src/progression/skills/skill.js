/**
 * @file Skill class with static instances and thumbnail screen registry.
 *
 * Skills appear in the sandbox/skills menu
 */
const _allSkillThumbnailScreens = {};

/**
 *
 */
class Skill {

  static basicRain = new Skill('Drizzle', (_sim) => {});

  static fastRain = new Skill('Downpour', (sim) => {
    sim.fallSpeed = sim.fallSpeed * 4;
  });

  static fastRain2 = new Skill('Monsoon', (sim) => {
    sim.fallSpeed = sim.fallSpeed * 8;
    sim.rainGroup.n = sim.rainGroup.n * 3;
  });

  static snow = new Skill('Wonderland', (sim) => {
    sim.fallSpeed = sim.fallSpeed / 10;
  });

  static snow2 = new Skill('Blizzard', (sim) => {
    sim.rainGroup.n = sim.rainGroup.n * 10;
  });

  /**
   *
   * @param name
   * @param prepSim
   */
  constructor(name, prepSim) {
    this.name = name;
    this.prepSim = prepSim;
  }

  /**
   * called in gui/upgrade_menu/skill_tab.js
   */
  getThumbnailScreen() {
    const name = this.name;
    if (!(name in _allSkillThumbnailScreens)) {
      _allSkillThumbnailScreens[name] = this._buildThumbnailScreen();
    }
    return _allSkillThumbnailScreens[name];
  }

  /**
   *
   */
  _buildThumbnailScreen() {
    const titleKey = `${this.name} skill card`;
    const sim = this.buildThumbnailSim();
    const gsm = new BlankGSM();
    const tut = null;
    return new GameScreen(titleKey, sim.rect, sim, gsm, tut);
  }

  /**
   *
   */
  buildThumbnailSim() {
    const sim = new ThumbnailPSim();
    this.prepSim(sim);
    return sim;
  }
}
