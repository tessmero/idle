/**
 * @file DefaultControlFrame body with two control points.
 *
 * One at center of body to move, second nearby to rotate.
 */
class DefaultControlFrame extends CompoundBody {

  /**
   * Wrap the given body and add two control points to move and rotate it.
   * @param {Body} body The body to add control points to.
   * @param {number} angle The angle to position the rotation control point.
   * @param {number} dist The distance to put between the two control points.
   */
  constructor(body, angle = pio2, dist = 0.1) {
    super(body.sim, body.pos);

    const sim = body.sim;
    this.body = body;

    // init control points for user to click and drag
    this.movCp = new ControlPoint(sim, body);
    this.rotCp0 = new RotationControlPoint(sim, body, angle, dist);
    this.controlPoints = [this.movCp, this.rotCp0];
    this.rotCp0.fscale = 6;

    this.setChildren([body, ...this.controlPoints]);

  }

  /**
   *
   */
  getMainBody() { return this.body; }
}
