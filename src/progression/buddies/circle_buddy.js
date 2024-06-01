
/**
 * @file CircleBuddy object type.
 * controlled circle body
 * eats particles and contributes to player currency
 */
class CircleBuddy extends Buddy {

  /**
   *
   * @param {ParticleSim} sim
   * @param {Vector} pos
   * @param {number} rad
   */
  constructor(sim, pos, rad) {
    super(sim, pos);

    this.circle = new CircleBody(sim, pos, rad);
    const cp = new ControlPoint(sim, this.circle);
    cp.visible = true;
    cp.setRad(rad);
    this.controlPoint = cp;

    this.setChildren([this.circle, cp]);
    this.controlPoints = [cp];
  }

  /**
   *
   * @param dt
   */
  update(dt) {

    // request a particle to be eaten from edge
    // edge_particle_subgroup.js
    if (Math.random() < 0.1) { this.getMainBody().eatsQueued = 1; }

    return super.update(dt);
  }

  /**
   *
   */
  getMainBody() { return this.circle; }
}
