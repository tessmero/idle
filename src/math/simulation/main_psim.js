
/**
 * main particle simulation
 * one instance: global.rootScreen.sim
 * constructed in setup.js
 */
class MainPSim extends ParticleSim {
  /**
   *
   */
  constructor() {
    super(1e5, [0, 0, 1, 1]);
  }
}
