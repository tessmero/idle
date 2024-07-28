/**
 * @file Tutorial Particle Simulation
 * a small particle simulation that appears in the gui
 */
class TutorialPSim extends ParticleSim {
  isMiniature = true;

  /**
   *
   */
  constructor() {
    super(1e4, [0, 0, ...global.tutorialSimDims]);
    this.fallSpeed = this.fallSpeed * 0.2;

    const rg = this.rainGroup;
    rg.wiggle = rg.wiggle * 0.3;
    rg.n = rg.n / 100;
  }
}
