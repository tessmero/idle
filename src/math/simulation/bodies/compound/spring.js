/**
 * @file Spring
 * Unused physics constraint connecting two bodies
 */
class Spring {

  /**
   *
   * @param a
   * @param b
   */
  constructor(a, b) {
    this.a = a;
    this.b = b;

    const restLength = a.pos.sub(b.pos).getMagnitude();
    this.restLength = restLength;
    this.prevLength = restLength;
    this.springConstant = 2e-3;
    this.dampingConstant = 1;
  }

  /**
   *
   * @param dt
   */
  update(dt) {

    // Calculate the vector between the two balls
    const displacement = this.b.pos.sub(this.a.pos);

    // Calculate the current length of the spring
    const currentLength = displacement.getMagnitude();
    let dAngle = displacement.getAngle();

    // Calculate the force exerted by the spring
    let forceMagnitude = this.springConstant * (currentLength - this.restLength);
    let tooLong = true;
    if (forceMagnitude < 0) {
      tooLong = false;
      dAngle = dAngle + Math.PI;
      forceMagnitude = forceMagnitude * -1;
    }

    // apply damping
    const relativeSpeed = (currentLength - this.prevLength) / dt;
    if (tooLong === (relativeSpeed < 0)) {
      const dampingMagnitude = Math.abs(relativeSpeed) * this.dampingConstant;
      forceMagnitude = Math.max(0, forceMagnitude - dampingMagnitude);
    }
    this.prevLength = currentLength;

    // Calculate the force vector
    const force = Vector.polar(dAngle, forceMagnitude);

    // Apply damping
    // let dampingForce = relativeVelocity.mul(this.dampingConstant);
    // force = force.sub(dampingForce);

    // Apply the force to the balls
    this.a.accel(force, dt);
    this.b.accel(force.mul(-1), dt);
  }

  /**
   *
   * @param {object} g The graphics context.
   */
  draw(g) {
    g.moveTo(...this.a.pos);
    g.lineTo(...this.b.pos);
    g.stroke();
  }
}
