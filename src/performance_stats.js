// object to store performance
// stats collected during one game loop
//
// instances assigned in update.js
//   global.performanceStats
//   global.lupStats (Last Update Performance Stats)
class PerformanceStats {

  // called in update.js at start of game loop
  constructor() {
    this.activeSims = new Map();
  }

  // for given ParticleSim instance,
  // add flag e.g. 'drawn'
  flagSim(sim, flag, value = true) {
    const as = this.activeSims;

    // make sure this sim is in list of active sime
    if (!(as.has(sim))) {
      as.set(sim, new Map());
    }

    // assert flag wasn't repeated
    // e.g. drawing the same thing twice
    if (as.get(sim).has(flag)) {
      throw new Error(f`(sim {flag}) repeated during single game loop`);
    }

    // insert flag
    as.get(sim).set(flag, value);
  }
}
