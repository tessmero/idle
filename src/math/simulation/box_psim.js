/**
 * @file BoxPSim object type.
 * Simulation for a box buddy internal screen.
 * When a box is initially built, the internal sim is small and fits in context menu without scaling.
 * After a box gains experience and levels up, its internal sim as big as the main game sim but square.
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
