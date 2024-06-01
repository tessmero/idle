/**
 * @file BoxTestPSim particle simulation
 *
 * Has no procedural particles. Meant to contain tests of box behavior.
 *
 * This is not for inside of box. All boxes contain BoxPSim instances (box_psim.js)
 */
class BoxTestPSim extends TutorialPSim {
  /**
   *
   * @param {...any} p
   */
  constructor(...p) {
    super(...p);
    this.rainGroup.n = 0;
    this.fallSpeed = 2e-4;
  }
}
