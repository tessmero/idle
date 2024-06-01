/**
 * @file BoxPSim object type.
 * Simulation for a box buddy internal screen.
 * It is as big as the main game sim but square.
 */
class BoxPSim extends ParticleSim {

  /**
   *
   */
  constructor() {
    super(1e4, [0, 0, ...global.boxSimDims]);
    this.rainGroup.n = 0;
  }
}
