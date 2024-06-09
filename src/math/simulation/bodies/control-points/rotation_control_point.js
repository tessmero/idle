
/**
 * @file RotationControlPoint pseudo-body
 * circle for the user to click and drag
 * to rotate another body
 */
class RotationControlPoint extends ControlPoint {

  /**
   * anchoredTo is a body that this will be anchored to
   * aparent will recieve opposite force when dragging
   * @param sim
   * @param anchoredTo
   * @param angle
   * @param radius
   */
  constructor(sim, anchoredTo, angle, radius) {
    super(sim, anchoredTo);
    this.angle = angle;
    this.radius = radius;
  }

  /**
   * pass user input "force" to physics-enabled parent body
   * @param acc
   */
  accel(acc) {

    // extract rotation component
    const a = this.angle + this.anchoredTo.angle;
    const mag = acc.getMagnitude() * Math.sin(acc.getAngle() - a);
    const spn = mag * this.fscale;

    this.anchoredTo.spin(spn);
  }

  // remain stuck to parent
  /**
   *
   * @param _dt
   */
  update(_dt) {
    const par = this.anchoredTo;
    const a = this.angle + par.angle;
    this.pos = par.pos.add(vp(a, this.radius));
  }

}
