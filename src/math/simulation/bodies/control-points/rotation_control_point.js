
/**
 * @file RotationControlPoint pseudo-body
 * circle for the user to click and drag
 * to rotate another body
 */
class RotationControlPoint extends ControlPoint {

  /**
   * @param {ParticleSim} sim
   * @param {Body} anchoredTo
   * @param {number} angle
   * @param {number} distance
   */
  constructor(sim, anchoredTo, angle, distance) {
    super(sim, anchoredTo);
    this.angle = angle;
    this.distance = distance;
  }

  /**
   * pass user input "force" to physics-enabled parent body
   * @param {Vector} acc
   */
  accel(acc) {

    // extract rotation component
    const a = this.angle + this.anchoredTo.angle;
    const mag = acc.getMagnitude() * Math.sin(acc.getAngle() - a);
    const spn = mag * this.fscale;

    this.anchoredTo.spin(spn);
  }

  /**
   * remain stuck to parent
   * @param {number} _dt
   */
  update(_dt) {
    const par = this.anchoredTo;
    const a = this.angle + par.angle;
    this.pos = par.pos.add(vp(a, this.distance));
  }

}
