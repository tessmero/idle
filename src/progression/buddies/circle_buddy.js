// controlled circle body in global.mainSim
// eats particles and contributes to player currency
/**
 *
 */
class CircleBuddy extends Buddy {

  // sim is a ParticleSim instance
  /**
   *
   * @param sim
   * @param pos
   * @param rad
   */
  constructor(sim, pos, rad) {
    super(sim, pos);

    this.circle = new CircleBody(sim, pos, rad);
    const cp = new ControlPoint(sim, this.circle);
    cp.visible = true;
    cp.setRad(rad);
    this.controlPoint = cp;

    this.children = [this.circle, cp];
    this.controlPoints = [cp];
  }

  /**
   *
   */
  getMainBody() { return this.circle; }
}
