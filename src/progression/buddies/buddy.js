/**
 * @file Buddy base class for privileged bodies
 * with their own progression state
 */
class Buddy extends CompoundBody {

  particlesCollected = 0;

  /**
   *
   * @param {ParticleSim} sim
   * @param {Vector} pos
   */
  constructor(sim, pos) {
    super(sim, pos);

    this.exp = 0;
    this.expLevel = 1;

    this.levelCosts = ValueCurve.power(100, 2);
  }
}
