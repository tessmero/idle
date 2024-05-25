
/**
 * store performance stats collected
 * during a single game loop
 *
 * instances assigned in update.js
 *   global.livePerformanceStats
 *   global.lupStats (Last Update Performance Stats)
 */
class LivePerformanceStats {

  /**
   * called in update.js at start of game loop
   */
  constructor() {
    this.activeScreens = new Map();
  }

  /**
   * for given Gui instance,
   * add flag e.g. 'drawn'
   * @param {Gui} gui - The GUI instance for which the flag will be added.
   * @param {string} flag - The unique name of the flag to add.
   * @param {boolean|string} value - The value to set for the flag.
   */
  flagGui(gui, flag, value = true) {
    this.flagScreen(gui.screen, `${gui.title} ${flag}`, value);
  }

  /**
   * for given ParticleSim instance,
   * add flag e.g. 'drawn'
   * @param {ParticleSim} sim - The ParticleSim instance for which the flag will be added.
   * @param {string} flag - The unique name of the flag to add.
   * @param {boolean|string} value - The value to set for the flag.
   */
  flagSim(sim, flag, value = true) {
    this.flagScreen(sim.screen, `sim ${flag}`, value);
  }

  /**
   * for given GameScreen instance,
   * add flag e.g. 'drawn'
   * @param {GameScreen} screen - The game screen instance for which the flag will be added.
   * @param {string} flag - The name of the flag to add.
   * @param {boolean|string} value - The value to set for the flag.
   */
  flagScreen(screen, flag, value = true) {
    if (!screen) {
      throw new Error('screen is null');
    }

    const as = this.activeScreens;

    // make sure this screen is in list of active screens
    if (!(as.has(screen))) {
      as.set(screen, new Map());
    }

    // assert flag wasn't repeated
    // e.g. drawing the same thing twice
    if (as.get(screen).has(flag)) {
      console.log(screen);
      throw new Error(`(screen ${flag}) repeated during single game loop`);
    }

    // insert flag
    as.get(screen).set(flag, value);
  }
}
